/// <reference types="node" />
import { Response } from './types';
import { OutgoingHttpHeaders } from 'http';
export declare function headersToParameters(headers: OutgoingHttpHeaders): {
    schema: {
        type: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
    };
    in: string;
    name: string;
    required: boolean;
}[];
export declare function createRequestBody(rawBody: string, headers: OutgoingHttpHeaders): {
    content: {
        [x: string]: {
            schema: Record<string, any>;
        };
    };
};
export declare function convertResponse(response: Response): {
    [x: string]: {
        schema: Record<string, any>;
    };
};
export declare function dataToSchema(data: any): Record<string, any>;
//# sourceMappingURL=converter.d.ts.map