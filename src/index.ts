import type { Plugin } from 'vite'

type Key = string
export type Config = ({
  key: Key
  handle: (data: string) => any
} | [
  Key,
  typeof Boolean | typeof Number,
])
export interface Options {
  configs?: Config[]
}

export function handleSingleItem(obj: Record<string, string>, config: Config) {
  if (Array.isArray(config)) {
    const [key, handle] = config
    return {
      key,
      value: handle ? handle(obj[key]) : obj[key],
    }
  }
  else {
    const { key, handle } = config
    return {
      key,
      value: handle ? handle(obj[key]) : obj[key],
    }
  }
}

export function handleConfigsWithEnvs(obj: Record<string, string>, configs: Config[]) {
  const envs = obj || {}
  const envsKeys = Object.keys(envs)
  configs.forEach((_config) => {
    const { key, value } = handleSingleItem(envs, _config)
    if (envsKeys.includes(key))
      obj[key] = value
  })
}

function VitePlugin(options: Options = {}): Plugin {
  const { configs = [] } = options

  return {
    name: `vite-plugin-env-caster`,
    configResolved(config) {
      handleConfigsWithEnvs(config.env, configs)
    },
  }
}

export default VitePlugin
