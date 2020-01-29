"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aggregator_1 = require("./lib/aggregator");
const builder_1 = require("./lib/builder");
const js_yaml_1 = __importDefault(require("js-yaml"));
const aggregator = new aggregator_1.Aggregator();
function createHookListener(listener) {
    return function (req, res) {
        let reqBodyChunks = [];
        let reqBody = '';
        let resBodyChunks = [];
        let resBody = '';
        const orgReqOn = req.on;
        req.on = function (evtname, callback) {
            if (evtname === 'data') {
                orgReqOn.call(this, evtname, (chunk) => {
                    reqBodyChunks.push(Buffer.from(chunk));
                    callback(chunk);
                });
            }
            else if (evtname === 'end') {
                orgReqOn.call(this, evtname, () => {
                    reqBody = Buffer.concat(reqBodyChunks).toString();
                    callback();
                });
            }
            else {
                orgReqOn.call(this, evtname, callback);
            }
        };
        const orgResWrite = res.write;
        res.write = function (chunk, encoding, callback) {
            resBodyChunks.push(Buffer.from(chunk));
            orgResWrite.call(this, chunk, encoding, callback);
        };
        const orgResEnd = res.end;
        res.end = function (data, encoding, callback) {
            resBodyChunks.push(Buffer.from(data));
            orgResEnd.call(this, data, encoding, callback);
            resBody = Buffer.concat(resBodyChunks).toString();
            const { rawHeaders, method, url } = req;
            const { statusCode, statusMessage } = res;
            const headers = res.getHeaders();
            aggregator.collect({
                method: method.toLowerCase(),
                url,
                headers: rawHeaders,
                body: reqBody,
            }, {
                statusCode,
                statusMessage,
                headers,
                body: resBody,
            });
            reqBodyChunks = [];
            reqBody = '';
            resBodyChunks = [];
            resBody = '';
        };
        listener(req, res);
    };
}
exports.createHookListener = createHookListener;
function dumpDefinition() {
    const builder = new builder_1.Builder(aggregator.toData());
    const definition = builder.toOpenApi();
    return js_yaml_1.default.dump(definition, { indent: 2 });
}
exports.dumpDefinition = dumpDefinition;
