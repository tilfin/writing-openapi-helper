import { RequestListener, IncomingMessage, ServerResponse } from "http"
import { Aggregator } from "./lib/aggregator"
import { Builder } from "./lib/builder"
import jsyaml from "js-yaml"

const aggregator = new Aggregator()

export function createHookListener(listener: RequestListener) {
  return function(req: IncomingMessage, res: ServerResponse) {
    let reqBodyChunks: Buffer[] = []
    let reqBody: string = ''
    let resBodyChunks: Buffer[] = []
    let resBody: string = ''

    const orgReqOn: Function = req.on;
    (req as any).on = function (evtname: string, callback: Function) {
      if (evtname === 'data') {
        orgReqOn.call(this, evtname, (chunk: any) => {
          reqBodyChunks.push(Buffer.from(chunk));
          callback(chunk)
        })
      } else if (evtname === 'end') {
        orgReqOn.call(this, evtname, () => {
          reqBody = Buffer.concat(reqBodyChunks).toString()
          callback()
        })
      } else {
        orgReqOn.call(this, evtname, callback)
      }
    }

    const orgResWrite: Function = res.write;
    (res as any).write = function (chunk: any, encoding: any, callback: Function) {
      resBodyChunks.push(Buffer.from(chunk))
      orgResWrite.call(this, chunk, encoding, callback)
    }

    const orgResEnd: Function = res.end;
    (res as any).end = function (data: any, encoding: any, callback: Function) {
      resBodyChunks.push(Buffer.from(data))
      orgResEnd.call(this, data, encoding, callback)

      resBody = Buffer.concat(resBodyChunks).toString()

      const { rawHeaders, method, url } = req
      const { statusCode, statusMessage } = res
      const headers = res.getHeaders()

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
      })

      reqBodyChunks = []
      reqBody = ''
      resBodyChunks = []
      resBody = ''
    }

    listener(req, res)
  }
}

export function dumpDefinition(): string {
  const builder = new Builder(aggregator.toData())
  const definition = builder.toOpenApi()
  return jsyaml.dump(definition, { indent: 2 })
}
