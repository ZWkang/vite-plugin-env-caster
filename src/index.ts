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
  ignoreUndefined?: boolean
}

export function handleConfigsWithEnvs(obj: Record<string, string>, configs: Config[], ignoreUndefined: boolean) {
  const envs = obj || {}
  const envsKeys = Object.keys(envs)
  configs.forEach((_config) => {

    let key: Key
    let handle: (data: string) => any
    if (Array.isArray(_config)) {
      [key, handle] = _config
    }
    else {
      ({ key, handle } = _config)
    }

    if (!envsKeys.includes(key)) {
      return;
    }

    if (ignoreUndefined && typeof envs[key] === 'undefined') {
      return;
    }

    return {
      key,
      value: handle ? handle(envs[key]) : envs[key],
    }
  })
}

function VitePlugin(options: Options = {}): Plugin {
  const { configs = [], ignoreUndefined = true } = options

  return {
    name: `vite-plugin-env-caster`,
    configResolved(config) {
      handleConfigsWithEnvs(config.env, configs, ignoreUndefined)
    },
  }
}

export default VitePlugin
