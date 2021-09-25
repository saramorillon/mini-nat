import { cleanEnv, str } from 'envalid'

const env = cleanEnv(process.env, {
  CONF_DIR: str({ default: '/usr/app/conf.d' }),
})

export const settings = {
  configDir: env.CONF_DIR,
}
