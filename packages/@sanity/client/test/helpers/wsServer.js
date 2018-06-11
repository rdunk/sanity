const WebSocket = require('ws')

const port = 31177

module.exports = () =>
  new Promise((resolve, reject) => {
    const listeners = new Set()
    const wss = new WebSocket.Server({port})
    wss.on('listening', onListening)
    wss.on('connection', onConnection)

    function onListening(err) {
      return err ? reject(err) : resolve({port, close: () => wss.close()})
    }

    function onConnection(ws) {
      ws.on('message', msg => onMessage(msg, ws))
    }

    function onMissingParams(msg, missing, ws) {
      return ws.send(
        formatRpcError(msg.id || null, {
          code: -32600,
          message: 'Invalid Request',
          data: `Missing required parameter(s): ${missing.join(', ')}`
        })
      )
    }

    async function onListen(msg, ws) {
      listeners.add(msg.id)
      ws.send(formatRpcMessage(msg.id, {event: 'welcome', listenerName: msg.id}, true))

      let i = 0
      for (i = 0; i < 30 && listeners.has(msg.id); i++) {
        ws.send(formatRpcMessage(msg.id, {event: 'mutation', counter: i}))
        await wait(100) // eslint-disable-line no-await-in-loop
      }

      if (listeners.has(msg.id)) {
        ws.send(formatRpcMessage({event: 'mutation', counter: i++}, msg.id, undefined, true))
        listeners.delete(msg.id)
      }
    }

    function onCancel(msg, ws) {
      listeners.delete(msg.id)
    }

    function onUnknownMethod(msg, ws) {
      ws.send(
        formatRpcError(msg.id || null, {
          code: -32601,
          message: 'Method not found'
        })
      )
    }

    function onMessage(message, ws) {
      const msg = JSON.parse(message)
      const missing = ['id', 'method', 'jsonrpc'].filter(param => !msg[param])
      if (missing.length > 0) {
        return onMissingParams(msg, missing, ws)
      }

      if (msg.method === 'listen') {
        return onListen(msg, ws)
      }

      if (msg.method === 'cancel') {
        return onCancel(msg, ws)
      }

      return onUnknownMethod(msg, ws)
    }
  })

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function formatRpcError(id, error) {
  return JSON.stringify({
    jsonrpc: '2.0',
    error,
    id
  })
}

function formatRpcMessage(id, result, stream, complete) {
  return JSON.stringify({
    jsonrpc: '2.0',
    result,
    stream,
    complete,
    id
  })
}
