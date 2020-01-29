"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function headersToParameters(headers) {
    const parameters = [];
    for (const [name, value] of Object.entries(headers)) {
        if (name.startsWith('x-') || name === 'authorization') {
            parameters.push({
                schema: { type: (typeof value) },
                in: 'header',
                name,
                required: true,
            });
        }
    }
    return parameters;
}
exports.headersToParameters = headersToParameters;
function createRequestBody(rawBody, headers) {
    let contentType = headers['content-type'].toString();
    contentType = contentType.split(';')[0];
    const data = JSON.parse(rawBody || '{}');
    return {
        content: {
            [contentType.toString()]: {
                schema: dataToSchema(data)
            }
        }
    };
}
exports.createRequestBody = createRequestBody;
function convertResponse(response) {
    let contentType = response.headers['content-type'].toString();
    contentType = contentType.split(';')[0];
    const data = JSON.parse(response.body || '{}');
    return {
        [contentType.toString()]: {
            schema: dataToSchema(data)
        }
    };
}
exports.convertResponse = convertResponse;
function dataToSchema(data) {
    if (data instanceof Array) {
        return {
            type: 'array',
            items: dataToSchema(data[0])
        };
    }
    else if (typeof data === 'object') {
        return {
            type: 'object',
            required: [],
            properties: objectToProperties(data)
        };
    }
    else {
        return {
            type: (typeof data)
        };
    }
}
exports.dataToSchema = dataToSchema;
function objectToProperties(obj) {
    const props = {};
    for (const [key, value] of Object.entries(obj)) {
        props[key] = dataToSchema(value);
    }
    return props;
}
