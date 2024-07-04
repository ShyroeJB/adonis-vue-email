/// <reference types="@adonisjs/vite/vite_provider" />

import { Message } from '@adonisjs/mail'
import { render } from '@vue-email/render'
import type { ApplicationService } from '@adonisjs/core/types'
import { pathToFileURL } from 'node:url'
import { locatePath } from 'locate-path'

export default class VueEmailProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  async register() {}

  /**
   * The container bindings have booted
   */
  async boot() {
    const vite = await this.app.container.make('vite')
    const devServer = vite.getDevServer()

    let searchComponent
    if (devServer) {
      const runtime = await vite.createRuntime()
      searchComponent = await runtime.executeEntrypoint('ssr.ts')
    } else {
      /**
       * Otherwise, just import the SSR bundle
       */
      const possiblesLocations = ['./ssr/ssr.js', './ssr/ssr.mjs']
      const path = await locatePath(possiblesLocations, { cwd: this.app.appRoot })
      const defaultPath = 'ssr/ssr.js'
      const buildPath = this.app.makePath(path || defaultPath)
      searchComponent = await import(pathToFileURL(buildPath).href)
    }

    Message.templateEngine = {
      async render(templatePath, _helpers, data) {
        const component = await searchComponent.default(templatePath, 'emails')
        const html = await render(component, data, { pretty: true })
        return html
      },
    }
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
