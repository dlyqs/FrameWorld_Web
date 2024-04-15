// doc ref - https://nuxt.com/docs/api/configuration/nuxt-config

// 环境变量中获取应用名称，默认为 'FrameWord'
const appName = process.env.NUXT_PUBLIC_APP_NAME ?? 'FrameWord'
// @ts-ignore
export default defineNuxtConfig({
    debug: process.env.NODE_ENV !== 'production',   // 根据环境变量启用调试模式，生产环境下默认关闭
    ssr: process.env.SSR !== 'false',               // 服务器端渲染开关，通过环境变量控制，默认开启
    // 应用配置
    app: {
        // 设置页面的默认标题为应用名称
        head: {
            title: appName,
        },
    },
    // 运行时配置，可通过 useRuntimeConfig() 在客户端和服务端访问
    runtimeConfig: {
        public: {
            appName: appName,
            customApiKey: false
        }
    },
    // 构建配置
    build: {
        // 指定需要通过 babel(JS编译器) 转译的依赖
        transpile: ['vuetify']
    },
    // 全局 CSS
    css: [
        'vuetify/styles',
        'material-design-icons-iconfont/dist/material-design-icons.css',
    ],
    // Nuxt模块
    modules: [
    ],
    // Vite配置
    vite: {
        server: {
            fs: {
                strict: false   // 关闭 Vite 的严格文件服务，以允许加载外部文件
            }
        }
    },
    router: {
        middleware: ['auth']
    },
    plugins: ['~/plugins/auth-persist.js','~/plugins/undraw-ui.ts',],
})