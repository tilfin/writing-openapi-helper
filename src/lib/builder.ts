import { Request, Response, RequestResponsePair } from './types'
import { convertResponse, headersToParameters, createRequestBody } from './converter'

export class Builder {
  constructor(private data: Map<string, RequestResponsePair[]>) {
  }

  toOpenApi() {
    const paths: Record<string, any> = {}

    this.data.forEach((pairs, _requestKey) => {
      const req = pairs[0].request
      const { requestBody, parameters } = this.buildRequestBodyAndParameters(req)
      paths[req.url] = {
        [req.method]: {
          summary: 'API',
          operationId: 'operationId',
          responses: this.buildResponses(pairs.map(it => it.response)),
          requestBody,
          parameters,
        }
      }
    })

    return {
      openapi: '3.0.0',
      paths
    }
  }

  buildResponses(responses: Response[]): Record<string, any> {
    return responses.reduce((target: Record<string, any>, it: Response) => {
      target[it.statusCode.toString()] = {
        description: it.statusMessage,
        content: convertResponse(it),
      }
      return target
    }, {})
  }

  buildRequestBodyAndParameters(request: Request) {
    const headers: Record<string, any> = {}
    for (let i = 0; i < request.headers.length; i += 2) {
      const field = request.headers[i].toLowerCase()
      const value = request.headers[i + 1]
      headers[field] = value
    }

    return {
      requestBody: createRequestBody(request.body, headers),
      parameters: headersToParameters(headers),
    }
  }
}
