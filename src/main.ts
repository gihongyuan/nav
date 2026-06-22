import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './router'
import { useConfigStore } from './stores'
import App from './App.vue'

import 'virtual:uno.css'
import '@/styles/global.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

// 用 settings.yaml 的配置初始化浏览器标签页：标题 + favicon
const configStore = useConfigStore(pinia)
if (configStore.config.title) {
  document.title = configStore.config.title
}
if (configStore.config.icon) {
  setFavicon(configStore.config.icon)
}

app.mount('#app')

/** 动态设置浏览器标签页 favicon（支持 svg/png/ico 等任意格式） */
function setFavicon(href: string) {
  const link = document.querySelector<HTMLLinkElement>('link[rel~="icon"]')
  if (link) {
    link.href = href
  } else {
    const el = document.createElement('link')
    el.rel = 'icon'
    el.href = href
    document.head.appendChild(el)
  }
}
