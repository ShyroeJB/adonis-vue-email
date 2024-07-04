/// <reference types="vite/client" />

import { DefineComponent } from 'vue'

const resolve = (name: string, emailPath: string) => {
  const pages = import.meta.glob<DefineComponent>(`${emailPath}/**/*.vue`, { eager: true })
  return pages[`${emailPath}/${name}.vue`]
}

export default function render(name: string, emailPath: string) {
  Promise.resolve(resolve(name, emailPath)).then((module) => module.default || module)
}
