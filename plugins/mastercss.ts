import mastercss from '@master/css'

export default defineNuxtPlugin(nuxtApp => {
    return {
        provide: {
            _: mastercss
        }
    }
})