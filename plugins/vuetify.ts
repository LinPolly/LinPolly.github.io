import { createVuetify, ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// import { VDataTable, VDataTableServer } from 'vuetify/labs/VDataTable'
import * as labs from 'vuetify/labs/components'

export default defineNuxtPlugin(nuxtApp => {
    const vuetify = createVuetify({
        theme: {
            defaultTheme: 'dark'
        },
        ssr: true,
        components: {
            ...components,
            ...labs,
        },
        directives,
    })

    nuxtApp.vueApp.use(vuetify)
})