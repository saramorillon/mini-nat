import net = require('net')
import { readConfigs } from './readConfig'

const configs = readConfigs()

for (const config of configs) {
  const socket = net.createServer((instream) => {
    console.log(`Stream connected from ${config.out.host}:${config.out.port} to ${config.in.host}:${config.in.port}`)
    const outstream = net.createConnection(config.out)
    instream.pipe(outstream)
    outstream.pipe(instream)
  })

  socket.listen(config.in.port, config.in.host, () => {
    console.log(`Listening on ${config.in.host}:${config.in.port}`)
  })
}
