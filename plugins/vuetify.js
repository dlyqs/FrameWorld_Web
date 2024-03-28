import { createVuetify } from 'vuetify'
import { aliases, md } from 'vuetify/iconsets/md'
import * as components from 'vuetify/components'
import { md3 } from 'vuetify/blueprints'
// import * as directives from 'vuetify/directives'

export default defineNuxtPlugin(nuxtApp => {
    const vuetify = createVuetify({
        ssr: true,
        blueprint: md3,
        icons: {
            defaultSet: 'md',
            aliases,
            sets: {
                md
            }
        },
        components,
        theme: {
            defaultTheme: 'myCustomTheme', // 设置默认主题
            themes: {
                myCustomTheme: {
                    colors: {
                        primary: '#ffcad4', // 替换为你喜欢的颜色，例如 '#FFC107'
                        // 这里可以继续添加其他颜色
                    },
                },
            },
        },
    })

    nuxtApp.vueApp.use(vuetify)
})