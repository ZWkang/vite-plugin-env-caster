import type { Plugin } from 'vite'

type Key = string
type Config = ({
  key: Key
  handle: (data: string) => any
} | [
  Key,
  typeof Boolean | typeof Number,
])
interface Options {
  configs?: Config[]
}

function handleSingleItem(obj: Record<string, string>, config: Config) {
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

function VitePlugin(options: Options = {}): Plugin {
  const { configs = [] } = options

  return {
    name: `vite-plugin-env-caster`,
    configResolved(config) {
      const envs = config.env || {}
      const envsKeys = Object.keys(envs)
      configs.forEach((_config) => {
        const { key, value } = handleSingleItem(envs, _config)
        if (envsKeys.includes(key))
          config.env[key] = value
      })
    },
  }
}

export default VitePlugin
