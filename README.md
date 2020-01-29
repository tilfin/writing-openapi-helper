# Writing OpenAPI helper

helps you write OpenAPI definition.

## Install

```
$ npm i tilfin/writing-openapi-helper.git
```

## How to use

```js
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const request = require('supertest')
const { createHookListener, dumpDefinition } = require('writing-openapi-helper')

const app = new Koa()

app.use(bodyParser())
app.use(async (ctx, next) => {
  ctx.body = {
    data: {
      items: [
        {
          id: 1,
          name: 'A',
        },
        {
          id: 2,
          name: 'B',
        }
      ],
      totalItems: 2,
    },
    metadata: {
      cursor: 'abcdef'
    }
  }
})

request(createHookListener(app.callback()))
  .post('/items/search')
  .send({ q: 'A' })
  .set('x-app-key', 'app_key')
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .end((err, res) => {
    console.log(dumpDefinition())
  })
```

## Result

```yaml
openapi: 3.0.0
paths:
  /items/search:
    post:
      summary: API
      operationId: operationId
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                required: []
                properties:
                  data:
                    type: object
                    required: []
                    properties:
                      items:
                        type: array
                        items:
                          type: object
                          required: []
                          properties:
                            id:
                              type: number
                            name:
                              type: string
                      totalItems:
                        type: number
                  metadata:
                    type: object
                    required: []
                    properties:
                      cursor:
                        type: string
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required: []
              properties:
                q:
                  type: string
      parameters:
        - schema:
            type: string
          in: header
          name: x-app-key
          required: true
```
