/// <reference types="@vavite/multibuild" />
import type { PluginOption } from 'vite'

export type ServerRenderLightOptions = {
  ssr: {
    /**
     * The entrypoint for the server-side rendering
     */
    entrypoint: string
  }
}
export default function serverRenderLight(options: ServerRenderLightOptions): PluginOption {
  return {
    name: 'vite-plugin-server-render-light',
    config: (_, { command }) => {
      if (command === 'build') {
        process.env.NODE_ENV = 'production'
      }

      return {
        buildSteps: [
          {
            name: 'build-ssr',
            description: 'build server bundle',
            config: {
              build: {
                ssr: true,
                outDir: 'build/ssr',
                rollupOptions: { input: options.ssr.entrypoint },
              },
            },
          },
        ],
      }
    },
  }
}
