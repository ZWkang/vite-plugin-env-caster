import type { Plugin } from 'vite'

type Key = string
export type Config = ({
  key: Key
  handle: (data: string) => any
} | [
  Key,
  (data: string) => any
])
export interface Options {
  configs?: Config[]
  ignoreUndefined?: boolean
}

export function handleConfigsWithEnvs(obj: Record<string, string>, configs: Config[], ignoreUndefined: boolean) {
  const envs = obj || {}
  configs.forEach((_config) => {
    console.log(_config)
    let key: Key
    let handle: (data: string) => any
    if (Array.isArray(_config)) {
      [key, handle] = _config
    }
    else {
      ({ key, handle } = _config)
    }
    if (ignoreUndefined && typeof envs[key] === 'undefined') {
      return;
    }

    obj[key] = handle ? handle(envs[key]) : envs[key]
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
