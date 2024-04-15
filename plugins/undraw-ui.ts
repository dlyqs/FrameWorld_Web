// plugins/undraw-ui.ts
import UndrawUi from 'undraw-ui'
import 'undraw-ui/dist/style.css'
// @ts-ignore
export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.use(UndrawUi)
})
