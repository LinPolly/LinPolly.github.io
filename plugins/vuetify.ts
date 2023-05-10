import { createVuetify, ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// import { VDataTable, VDataTableServer } from 'vuetify/labs/VDataTable'
import * as labs from 'vuetify/labs/components'

const light: ThemeDefinition = {
    dark: false,
    colors: {
        background: '#FFFFFF',
        surface: '#FFFFFF',
        primary: '#6200EE',
        'primary-darken-1': '#3700B3',
        secondary: '#03DAC6',
        'secondary-darken-1': '#018786',
        error: '#B00020',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',
    }
}
const dark: ThemeDefinition = {
    dark: true,
    colors: {
        primary: "#52E3C2",
        "page-header-background": "#282831",
        "page-background": "#32323E",
        "table-header": "#2e2e2e",
        background: "#3F3F4A",
        "header-background": "#4a4a59",
        "info-text": "#99999F",
    }
}

export default defineNuxtPlugin(nuxtApp => {
    const vuetify = createVuetify({
        theme: {
            defaultTheme: 'light',
            themes: {
                light,
                dark
            }
        },
        // ssr: true,
        components: {
            ...components,
            ...labs,
        },
        directives,
    })

    nuxtApp.vueApp.use(vuetify)
})