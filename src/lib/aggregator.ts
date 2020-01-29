import { Request, Response, RequestResponsePair } from './types'

export class Aggregator {
  private requestResponse: Map<string, RequestResponsePair[]>

  constructor() {
    this.requestResponse = new Map<string, RequestResponsePair[]>()
  }

  collect(request: Request, response: Response) {
    const requestKey = request.method + ' ' + request.url

    if (this.requestResponse.has(requestKey)) {
      this.requestResponse.get(requestKey).push({ request, response })
    } else {
      this.requestResponse.set(requestKey, [{ request, response }])
    }
  }

  toData() {
    return this.requestResponse
  }
}
