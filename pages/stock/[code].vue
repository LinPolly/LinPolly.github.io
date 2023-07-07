<template>
    <v-row>
        <v-col v-if="realtimeData?.main"
            cols="12"
            md="6">
            <h2>即時現價</h2>
            <stockcard :symbol="realtimeData.main"
                :is-odd="isOdd"
                @target-odd="targetOdd"></stockcard>
        </v-col>
        <v-col v-if="stocks"
            cols="12"
            md="6">
            <h2>成分股即時現價</h2>
            <v-card elevation="5"
                v-if="realtimeData?.data">
                <v-layout :style="{ height: code.endsWith('_odd') == true ? '630px' : '1064px', overflow: 'auto' }">
                    <v-sheet class="d-flex flex-wrap">
                        <v-flex v-for="(data, i) in realtimeData.data"
                            :key="i"
                            class="ma-2 pa-2">
                            <stockcard :symbol="data"
                                :id-odd="false"
                                card-style="mini"></stockcard>
                        </v-flex>
                    </v-sheet>
                </v-layout>
            </v-card>
        </v-col>
    </v-row>
    <v-row style="height: 8px;"></v-row>
    <v-layout v-if="realtimeData.main">
        <v-row style="height: 600px;margin-left: 25px;padding-right: 25px;padding-bottom: 35px;">
            <stockhischart v-if="realtimeData.main?.c"
                :symbol="realtimeData.main"
                style="width: 100%;"></stockhischart>
        </v-row>
    </v-layout>
    <div v-if="stocks">
        <h2>{{ code.endsWith('_odd') ? code.substring(0, code.length - '_odd'.length) : code }} 每日成分股異動 {{
            (stocks?.length ?? 0) > 0 ? stocks[0]?.date : '' }} - {{
        (stocks?.length ??
            0) ?
        stocks.at(stocks.length
            -
            1)?.date : '' }}</h2>
        <v-banner :style="{ 'padding-top': '8px', 'height': `${appbarHeight}px` }"
            :sticky="true"
            lines="one">
            <v-row>
                <v-col cols="1">
                    <v-btn class="bg-secondary"
                        @click="selectDate = prevDate(date);"
                        :disabled="formatDate(date) == prevDate(date)">前一日</v-btn>
                </v-col>
                <v-col>
                    <VueDatePicker v-model="selectDate"
                        :enable-time-picker="false"
                        :clearable="false"
                        auto-apply
                        @open="appbarHeight = 422"
                        @closed="appbarHeight = 72"
                        :min-date="stocks != null && stocks[0] != null ? stocks[0].date : ''"
                        :max-date="stocks != null && stocks[0] != null ? stocks[stocks.length - 1].date : ''" />
                </v-col>
                <v-col cols="1">
                    <v-btn class="bg-primary"
                        @click="selectDate = nextDate(date)"
                        :disabled="formatDate(date) == nextDate(date)">後一日</v-btn>
                </v-col>
                <v-spacer></v-spacer>
            </v-row>
        </v-banner>
        <v-row>
            <v-col cols="12"
                sm="6">
                <Bar :data="chartData"
                    :options="chartOptions"></Bar>
            </v-col>
            <v-col cols="12"
                sm="6">
                <ClientOnly>
                    <v-data-table height="600px"
                        :headers="headers"
                        :items="tableData"
                        item-value="name"></v-data-table>
                </ClientOnly>
            </v-col>
        </v-row>
        <v-row>
            <h2>{{ formatDate(date) }}與{{ formatDate(prevDate(date)) }}比較</h2>
        </v-row>
        <v-row style="height: 300px;">
            <Bar :data="compareData"
                :options="compareOptions"></Bar>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { trimEnd, formatAsCurrency, diff, diffp, formatDate } from '~/lib/string'
import VueDatePicker from '@vuepic/vue-datepicker'
import { Bar } from 'vue-chartjs'
import '@vuepic/vue-datepicker/dist/main.css'
</script>

<script lang="ts">
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,

} from 'chart.js'
import { Stock } from '~/models/stock/stock.js'
import { Info } from '~/models/stock/info'
import { MsgArray } from '~/models/stock/twse'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default {
    data() {
        return {
            isOdd: this.$route.path.endsWith('_odd'),
            appbarHeight: 72,
            headers: [
                {
                    title: '名稱',
                    align: 'start',
                    sortable: false,
                    key: 'name',
                },
                { title: '股', align: 'end', key: 'volumn' },
                { title: '占比', align: 'end', key: 'weights' },
            ],
            infos: new Array<Info>(),
            stocks: new Array<Stock>(),
            realtimeData: {
                ismainreload: false,
                isdatareload: false,
                // headers: [
                //     { title: '名稱', align: 'start', sortable: false, key: 'c' },
                //     { title: '股價', align: 'end', key: 'z' },
                //     { title: '漲跌', align: 'end', key: 'diff' },
                //     { title: '漲跌幅(%)', align: 'end', key: 'diffp' },
                //     { title: '開盤', align: 'end', key: 'o' },
                //     { title: '昨收', align: 'end', key: 'y' },
                //     { title: '最高', align: 'end', key: 'h' },
                //     { title: '最低', align: 'end', key: 'l' },
                // ],
                main: {} as MsgArray,
                data: new Array<MsgArray>(),
            },
            selectDate: '',
            date: '',
            timer: {
                lastudt: new Date()
            }
        }
    },
    methods: {
        targetOdd(c: string) {
            c = this.$route.path
            if (!c.endsWith('_odd')) {
                c += '_odd'
            } else {
                c = c.substring(0, c.length - '_odd'.length)
            }
            // @ts-ignore
            history.pushState({}, null, c)

            this.$route.path = c
            this.$route.params.code = c.split('/')[c.split('/').length - 1]
            this.isOdd = this.$route.params.code.endsWith('_odd')
        },
        async loadRealTimeMainData() {
            this.realtimeData.ismainreload = true

            const { data } = await useFetch('/api/stock', {
                params: {
                    code: this.code
                }
            })

            var c = this.code
            if (this.code.endsWith('_odd')) {
                c = this.code.substring(0, this.code.length - '_odd'.length)
            }
            var newData = (data.value as MsgArray[]).find(x => x.c == c) as MsgArray
            if (this.realtimeData.main.c == '')
                this.realtimeData.main = newData

            var keys = Object.keys(newData)
            keys.forEach(x => {
                if (x == 'z' && newData[x] == '-') {
                } else {
                    // @ts-ignore
                    this.realtimeData.main[x] = newData[x]
                }
            })

            if (!this.code.endsWith('_odd')) {
                if (this.realtimeData.main.z == '-'
                    || this.realtimeData.main.z == undefined
                    || this.realtimeData.main.z == null
                    // 價格跳太快從yahoo修正當前價格
                    || parseFloat(this.realtimeData.main.z) > parseFloat(trimEnd(this.realtimeData.main.a ?? '', '_').split('_')[0])
                    || parseFloat(this.realtimeData.main.z) < parseFloat(trimEnd(this.realtimeData.main?.b ?? '', '_').split('_')[0])
                ) {
                    const { data } = await useAsyncData(`yahoo_${this.realtimeData.main.c}`, () => $fetch(`/api/price?code=${this.realtimeData.main.c}`))
                    // @ts-ignore
                    this.realtimeData.main.z = data.value?.toString()
                }
            }
            this.realtimeData.ismainreload = false
        },
        async loadRealTimeData() {
            await this.loadRealTimeMainData()
            this.realtimeData.isdatareload = true

            if (this.stocks) {
                var labels = this.stocks[this.stocks.length - 1]?.stock?.sort((a, b) => b.code.localeCompare(a.code)).map(x => x.code)
                if (labels) {
                    const { data } = await useFetch('/api/stock', {
                        params: {
                            code: labels
                        }
                    })

                    var newData = (data.value as MsgArray[]).filter(x => x.c != this.code)

                    if (this.realtimeData.data.length == 0)
                        this.realtimeData.data = newData
                    // console.log(this.realtimeData.data.length)
                    newData.forEach(async item => {
                        var keys = Object.keys(item)
                        keys.forEach(x => {
                            if (x == 'z' && item[x] == '-') {
                            } else {
                                var d = this.realtimeData.data.find(x => x.c == item.c)
                                // @ts-ignore
                                d[x] = item[x]
                            }
                        })

                        var dd = this.realtimeData.data.find(x => x.c == item.c) as MsgArray
                        if (dd.z == '-'
                            || dd.z == undefined
                            || dd.z == null
                            // 價格跳太快從yahoo修正當前價格
                            || parseFloat(dd.z) > parseFloat(trimEnd(dd.a ?? '', '_').split('_')[0])
                            || parseFloat(dd.z) < parseFloat(trimEnd(dd?.b ?? '', '_').split('_')[0])
                        ) {
                            const { data } = await useAsyncData(`yahoo_${dd.c}`, () => $fetch(`/api/price?code=${dd.c}`))
                            // @ts-ignore
                            dd.z = data.value?.toString()
                        }
                    })
                }
            } else {
                // @ts-ignore
                this.realtimeData.data = null
            }

            this.realtimeData.isdatareload = false
        },
        prevDate(date: any) {
            if (this.stocks == null) return date
            if (this.stocks.length == 0) return date

            var nowIndex = this.stocks?.findIndex(x => formatDate(x.date) == date)
            if (nowIndex == null || nowIndex == -1 || nowIndex == 0)
                return date

            if (this.stocks[nowIndex - 1] == null)
                return date
            return formatDate(this.stocks[nowIndex - 1]?.date)
        },
        nextDate(date: any) {
            if (this.stocks == null) return date

            var nowIndex = this.stocks?.findIndex(x => formatDate(x.date) == date)
            if (nowIndex == null || nowIndex == -1 || nowIndex == this.stocks.length - 1)
                return date

            if (this.stocks[nowIndex + 1] == null)
                return date
            return formatDate(this.stocks[nowIndex + 1]?.date)
        },
        async loadInfo() {
            // @ts-ignore
            const { data } = await useAsyncData('18419', () => $fetch(`/stock/18419.json`), { server: false })
            // @ts-ignore
            this.infos = data.value
        },
        async loadData() {
            var c = this.code
            if (this.code.endsWith('_odd')) {
                c = this.code.substring(0, this.code.length - '_odd'.length)
            }
            const { data } = await useAsyncData(`${c}_json`, () => $fetch(`/stock/${c}.json`), { server: false })
            // @ts-ignore
            if (Array.isArray(data.value)) {
                // @ts-ignore
                this.stocks = data.value
            } else {
                // @ts-ignore
                this.stocks = null
            }
        },
        async init() {
            await Promise.all([
                this.loadInfo(),
                this.loadData()
            ])
            if (this.stocks != null) {
                if (this.d
                    && this.d != undefined
                    && this.d != null
                    && !Number.isNaN(Date.parse(this.d as string))) {
                    this.selectDate = formatDate(Date.parse(this.d as string))
                    this.date = formatDate(Date.parse(this.d as string))
                } else {
                    this.selectDate = formatDate(this.stocks[this.stocks.length - 1].date)
                    this.date = formatDate(this.stocks[this.stocks.length - 1].date)
                }
            }
            await this.loadRealTimeData()
            this.repeat();
        },
        async repeat() {
            if (this.timer.lastudt.getHours() < 9
                || this.timer.lastudt.getHours() >= 14
                || (this.timer.lastudt.getHours() >= 13 && this.timer.lastudt.getMinutes() > 30)) {
                setTimeout(this.repeat, 1000 / 60);
                return
            }

            // @ts-ignore
            if (new Date() - this.timer.lastudt > 5_000) {
                this.timer.lastudt = new Date()
                await this.loadRealTimeData()
            }

            setTimeout(this.repeat, 1000 / 60);
        }
    },
    computed: {
        code() {
            return this.$route.params.code as string
        },
        d() {
            return this.$route.query.d
        },
        tableData() {
            // @ts-ignore
            var data = []
            // @ts-ignore
            if (this.stocks == null) return data

            var s = this.stocks.find(x => formatDate(x.date) == formatDate(this.date))
            s?.stock.sort((a, b) => b.code.localeCompare(a.code)).map(x => {
                return {
                    name: this.infos.find(y => y.公司代號 == x.code)?.公司簡稱 ?? x.code,
                    volumn: formatAsCurrency(x.volumn, 0),
                    weights: x.weights
                }
            }).forEach(x => data.push(x))

            // @ts-ignore
            return data
        },
        chartData() {
            var data = {
                labels: new Array<string>(),
                datasets: [
                    {
                        label: 'Dataset 1',
                        axis: 'y',
                        fill: false,
                        data: new Array<number>()
                    }
                ]
            }
            if (this.stocks == null) return data

            data.labels = []
            data.datasets[0].label = formatDate(this.date)
            data.datasets[0].data = []

            var s = this.stocks.find(x => formatDate(x.date) == formatDate(this.date))
            s?.stock.sort((a, b) => b.code.localeCompare(a.code)).map(x => this.infos.find(y => y.公司代號 == x.code)?.公司簡稱 ?? x.code)
                .forEach(x => data.labels.push(x))

            s?.stock.sort((a, b) => b.code.localeCompare(a.code)).map(x => x.weights).forEach(x => data.datasets[0].data.push(x))
            return data
        },
        chartOptions() {
            return {
                indexAxis: 'y',
                elements: {
                    bar: {
                        borderWidth: 2,
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                stacked: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                }
            }
        },
        compareData() {
            var data = {
                labels: new Array<string>(),
                datasets: [
                    {
                        label: '買進',
                        fill: false,
                        data: new Array<number>(),
                        backgroundColor: '#ff333a'
                    },
                    {
                        label: '賣出',
                        fill: false,
                        data: new Array<number>(),
                        backgroundColor: '#00ab5e'
                    }
                ]
            }
            if (this.stocks == null) return data

            var sdt = this.prevDate(this.date)
            var edt = formatDate(this.date)

            data.labels = []
            data.datasets[0].data = []

            var ed = this.stocks.find(x => formatDate(x.date) == formatDate(edt))
            var sd = this.stocks.find(x => formatDate(x.date) == formatDate(sdt))

            ed?.stock.sort((a, b) => b.code.localeCompare(a.code)).map(x => this.infos.find(y => y.公司代號 == x.code)?.公司簡稱 ?? x.code)
                .forEach(x => data.labels.push(x))

            ed?.stock.sort((a, b) => b.code.localeCompare(a.code)).map(x => {
                var f = sd?.stock.find(y => x.code == y.code)
                return x.volumn - (f?.volumn ?? 0)
            }).forEach(x => {
                data.datasets[0].data.push(x >= 0 ? x : 0)
                data.datasets[1].data.push(x < 0 ? x : 0)
            })
            return data
        },
        compareOptions() {
            return {
                elements: {
                    bar: {
                        borderWidth: 2,
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                stacked: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                }
            }
        },
    },
    watch: {
        'd': function (newValue) {
            this.selectDate = formatDate(newValue)
        },
        'selectDate': function (newValue) {
            this.date = formatDate(newValue)
        },
    },
    components: {
        Bar, VueDatePicker
    },
    mounted() {
        this.init()
    }
}
</script>