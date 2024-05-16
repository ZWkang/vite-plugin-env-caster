import { defineConfig } from 'vite'
import Plugin from '../../src/index'

export default defineConfig({
  plugins: [Plugin({
    configs: [
      ['VITE_PROXY_PORT', Number],
      ['VITE_START_PROXY', Boolean],
    ],
  })],
})
