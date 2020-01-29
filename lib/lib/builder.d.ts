import { Request, Response, RequestResponsePair } from './types';
export declare class Builder {
    private data;
    constructor(data: Map<string, RequestResponsePair[]>);
    toOpenApi(): {
        openapi: string;
        paths: Record<string, any>;
    };
    buildResponses(responses: Response[]): Record<string, any>;
    buildRequestBodyAndParameters(request: Request): {
        requestBody: {
            content: {
                [x: string]: {
                    schema: Record<string, any>;
                };
            };
        };
        parameters: {
            schema: {
                type: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
            };
            in: string;
            name: string;
            required: boolean;
        }[];
    };
}
//# sourceMappingURL=builder.d.ts.map