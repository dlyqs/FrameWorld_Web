// https://nuxt.com/docs/api/configuration/nuxt-config
const appName = process.env.NUXT_PUBLIC_APP_NAME ?? 'FrameWord'
// @ts-ignore
export default defineNuxtConfig({
    debug: process.env.NODE_ENV !== 'production',
    ssr: process.env.SSR !== 'false',
    app: {
      head: {
          title: appName,
      },
    },
    runtimeConfig: {
      public: {
          appName: appName,
          typewriter: false,
          typewriterDelay: 50,
          customApiKey: false
      }
    },
    build: {
      transpile: ['vuetify']
    },
    css: [
      'vuetify/styles',
      'material-design-icons-iconfont/dist/material-design-icons.css',
    ],
    modules: [

    ],
    vite: {
        server: {
            fs: {
                strict: false
            }
        }
    },
})
