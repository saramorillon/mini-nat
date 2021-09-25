import net = require('net')
import { readConfigs } from './readConfig'

const configs = readConfigs()

for (const config of configs) {
  const socket = net.createServer((instream) => {
    const outstream = net.createConnection(config.out)
    instream.pipe(outstream)
    outstream.pipe(instream)
  })

  socket.listen(config.in.port, config.in.host)
}
