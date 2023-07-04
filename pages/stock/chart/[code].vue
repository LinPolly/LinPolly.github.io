<template>
    <Line v-if="loaded"
        :data="chartData"></Line>
</template>

<script lang="ts">
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    components: { Line },
    data: () => ({
        loaded: false,
        chartData: null
    }),
    async mounted() {
        this.loaded = false

        try {
            const { data } = await useAsyncData(this.code, () => $fetch('/api/chart', {
                params: {
                    code: this.code
                }
            }))
            this.chartdata = data.value

            this.loaded = true
        } catch (e) {
            console.error(e)
        }
    },
    computed: {
        code() {
            return this.$route.params.code as string
        },
    }
}
</script>