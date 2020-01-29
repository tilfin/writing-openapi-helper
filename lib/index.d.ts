/// <reference types="node" />
import { RequestListener, IncomingMessage, ServerResponse } from "http";
export declare function createHookListener(listener: RequestListener): (req: IncomingMessage, res: ServerResponse) => void;
export declare function dumpDefinition(): string;
//# sourceMappingURL=index.d.ts.map