import { cleanEnv, host, makeValidator, port, ValidatorSpec } from 'envalid'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { settings } from './settings'

interface IConfig {
  in: {
    port: number
    host?: string
  }
  out: {
    port: number
    host?: string
  }
}

export function readConfigs(): IConfig[] {
  const result: IConfig[] = []
  const files = readdirSync(settings.configDir)
  for (const file of files) {
    if (!file.endsWith('.json')) continue
    result.push(readConfig(join(settings.configDir, file)))
  }
  return result
}

function readConfig(path: string): IConfig {
  const content = readFileSync(path, 'utf8')
  const json = JSON.parse(content)
  return cleanEnv(json, {
    in: obj({
      port: port(),
      host: host({ default: undefined }),
    }),
    out: obj({
      port: port(),
      host: host({ default: undefined }),
    }),
  })
}

function obj<T>(validators: { [K in keyof T]: ValidatorSpec<T[K]> }): ValidatorSpec<T> {
  return makeValidator<T>((input: string | Record<string, unknown>) => {
    let obj: Record<string, unknown>
    if (typeof input === 'object') {
      obj = input
    } else {
      try {
        obj = JSON.parse(String(input))
      } catch (error) {
        throw new Error(`Value "${input}" should be a valid stringified object`)
      }
    }
    return cleanEnv(obj, validators)
  })()
}
