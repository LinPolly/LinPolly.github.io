// https://nuxt.com/docs/api/configuration/nuxt-config
const routerBase = process.env.DEPLOY_ENV === 'GH_PAGES' ? {
    app: {
        baseURL: '/LinPolly.github.io/'
    },
} : {}
export default defineNuxtConfig({
    ...routerBase,
    css: [
        'vuetify/lib/styles/main.css',
        '@mdi/font/css/materialdesignicons.min.css'
    ],
    build: {
        transpile: [
            'vuetify',
            'chart.js',
            '@vuepic/vue-datepicker'
        ],
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
