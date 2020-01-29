import { Request, Response, RequestResponsePair } from './types';
export declare class Aggregator {
    private requestResponse;
    constructor();
    collect(request: Request, response: Response): void;
    toData(): Map<string, RequestResponsePair[]>;
}
//# sourceMappingURL=aggregator.d.ts.map