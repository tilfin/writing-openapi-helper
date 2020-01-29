import { Request, Response, RequestResponsePair } from './types'
import { OutgoingHttpHeaders } from 'http'

export function headersToParameters(headers: OutgoingHttpHeaders) {
  const parameters = []
  for (const [name, value] of Object.entries(headers)) {
    if (name.startsWith('x-') || name === 'authorization') {
      parameters.push({
        schema: { type: (typeof value) },
        in: 'header',
        name,
        required: true,
      })
    }
  }
  return parameters
}

export function createRequestBody(rawBody: string, headers: OutgoingHttpHeaders) {
  let contentType = headers['content-type'].toString()
  contentType = contentType.split(';')[0]
  const data = JSON.parse(rawBody || '{}')

  return {
    content: {
      [contentType.toString()]: {
        schema: dataToSchema(data)
      }
    }
  }
}

export function convertResponse(response: Response) {
  let contentType = response.headers['content-type'].toString()
  contentType = contentType.split(';')[0]
  const data = JSON.parse(response.body || '{}')

  return {
    [contentType.toString()]: {
      schema: dataToSchema(data)
    }
  }
}

export function dataToSchema(data: any): Record<string, any> {
  if (data instanceof Array) {
    return {
      type: 'array',
      items: dataToSchema(data[0])
    }
  } else if (typeof data === 'object') {
    return {
      type: 'object',
      required: [],
      properties: objectToProperties(data)
    }
  } else {
    return {
      type: (typeof data)
    }
  }
}

function objectToProperties(obj: any): Record<string, any> {
  const props: Record<string, any> = {}
  for (const [key, value] of Object.entries(obj)) {
    props[key] = dataToSchema(value)
  }
  return props
}
