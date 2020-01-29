# Writing OpenAPI helper

## Install

```
$ npm i -D tilfin/writing-openapi-helper.git
```

## How to use

```js
const server = http.createServer(createHookListener(app.callback()))
server.listen(3000)
server.on('close', () => {
  console.log(dumpDefinition())
})
```
