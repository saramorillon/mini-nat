import { cleanEnv, host, port } from 'envalid'
import net = require('net')

const env = cleanEnv(process.env, {
  IN_PORT: port(),
  IN_HOST: host(),
  OUT_PORT: port(),
  OUT_HOST: host(),
})

const socket = net.createServer((instream) => {
  const outstream = net.createConnection({ host: env.OUT_HOST, port: env.OUT_PORT })
  instream.pipe(outstream)
  outstream.pipe(instream)
})

socket.listen(env.IN_PORT, env.IN_HOST)
