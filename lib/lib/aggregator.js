"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Aggregator {
    constructor() {
        this.requestResponse = new Map();
    }
    collect(request, response) {
        const requestKey = request.method + ' ' + request.url;
        if (this.requestResponse.has(requestKey)) {
            this.requestResponse.get(requestKey).push({ request, response });
        }
        else {
            this.requestResponse.set(requestKey, [{ request, response }]);
        }
    }
    toData() {
        return this.requestResponse;
    }
}
exports.Aggregator = Aggregator;
