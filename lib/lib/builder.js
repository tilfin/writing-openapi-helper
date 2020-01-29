"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const converter_1 = require("./converter");
class Builder {
    constructor(data) {
        this.data = data;
    }
    toOpenApi() {
        const paths = {};
        this.data.forEach((pairs, _requestKey) => {
            const req = pairs[0].request;
            const { requestBody, parameters } = this.buildRequestBodyAndParameters(req);
            paths[req.url] = {
                [req.method]: {
                    summary: 'API',
                    operationId: 'operationId',
                    responses: this.buildResponses(pairs.map(it => it.response)),
                    requestBody,
                    parameters,
                }
            };
        });
        return {
            openapi: '3.0.0',
            paths
        };
    }
    buildResponses(responses) {
        return responses.reduce((target, it) => {
            target[it.statusCode.toString()] = {
                description: it.statusMessage,
                content: converter_1.convertResponse(it),
            };
            return target;
        }, {});
    }
    buildRequestBodyAndParameters(request) {
        const headers = {};
        for (let i = 0; i < request.headers.length; i += 2) {
            const field = request.headers[i].toLowerCase();
            const value = request.headers[i + 1];
            headers[field] = value;
        }
        return {
            requestBody: converter_1.createRequestBody(request.body, headers),
            parameters: converter_1.headersToParameters(headers),
        };
    }
}
exports.Builder = Builder;
