// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({    
    ssr: false,
    css: [
        'vuetify/lib/styles/main.css',
        '@mdi/font/css/materialdesignicons.min.css'
    ],
    build: {
        transpile: ['vuetify', 'chart.js'],
    },
    modules: [
    ],
    components: [
        {
            path: '~/components',
            extensions: ['.vue'],
        }
    ],
})
