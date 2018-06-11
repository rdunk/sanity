const test = require('tape')
const assign = require('xtend')
const sanityClient = require('../src/sanityClient')
const wsServer = require('./helpers/wsServer')

const getClient = (options = {port: 31177}) =>
  sanityClient(
    assign(
      {
        dataset: 'prod',
        namespace: 'beerns',
        apiHost: `http://localhost:${options.port}`,
        useProjectHostname: false,
        useCdn: false
      },
      options
    )
  )

/*****************
 * LISTENER      *
 *****************/
test('[listener] can listen for mutations', async t => {
  const server = await wsServer()
  await new Promise(resolve => setTimeout(resolve, 5000))
  server.close()
  t.end()
})
