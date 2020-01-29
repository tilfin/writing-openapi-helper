import { OutgoingHttpHeaders } from "http";

export interface Request {
  method: string
  url: string
  headers: string[]
  body: string
}

export interface Response {
  statusCode: number
  statusMessage: string
  headers: OutgoingHttpHeaders
  body: string
}

export interface RequestResponsePair {
  request: Request
  response: Response
}
