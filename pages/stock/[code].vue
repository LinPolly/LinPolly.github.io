<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import { Bar } from 'vue-chartjs'
import '@vuepic/vue-datepicker/dist/main.css'
import {
    subtract
} from 'mathjs'
</script>

<template>
    <h1>{{ code }}</h1>
    <v-row v-if="realtimeData?.main">
        <v-col cols="12"
            md="6">
            <h2>即時現價</h2>
            <v-card>
                <v-progress-linear v-if="realtimeData.isreload"
                    color="primary"
                    indeterminate>
                </v-progress-linear>
                <v-row>
                    <v-col cols="6">
                        <v-list class="v-col-6">
                            <v-list-item title="成交"
                                :subtitle="trim(realtimeData?.main?.tv, '0')"></v-list-item>
                            <v-list-item title="開盤"
                                :subtitle="trim(realtimeData?.main?.o, '0')"></v-list-item>
                            <v-list-item title="最高"
                                :subtitle="trim(realtimeData?.main?.h, '0')"></v-list-item>
                            <v-list-item title="最低"
                                :subtitle="trim(realtimeData?.main?.l, '0')"></v-list-item>
                        </v-list>
                    </v-col>
                    <v-col cols="6">
                        <v-list class="v-col-6">
                            <v-list-item title="昨收"
                                :subtitle="trim(realtimeData?.main?.y, '0')"></v-list-item>
                            <v-list-item title="漲跌"
                                :subtitle="subtract(parseFloat(trim(realtimeData?.main?.z, '0')), parseFloat(trim(realtimeData?.main?.y, '0')))"></v-list-item>
                            <v-list-item title="總量"
                                :subtitle="realtimeData?.main?.v"></v-list-item>
                        </v-list>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6">
                        <v-row>
                            <div style="width: 8px;"></div>
                            <v-col>
                                <v-label>量</v-label>
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col>
                                <v-label>委買價</v-label>
                            </v-col>
                        </v-row>
                        <hr>
                        <v-row>
                            <v-col>
                                <v-list>
                                    <v-list-item v-for="item in trim(realtimeData?.main?.g ?? '', '_').split('_')"
                                        :key="item">
                                        <v-list-item-title v-text="formatAsCurrency(parseInt(item), 0)">
                                        </v-list-item-title>
                                        <v-list-item-action>
                                            <v-progress-linear :model-value="parseInt(item)"
                                                :max="trim(realtimeData?.main?.g ?? '', '_').split('_').map(x => parseInt(x)).sort((a, b) => b - a)[0]"
                                                reverse>
                                            </v-progress-linear>
                                        </v-list-item-action>
                                    </v-list-item>
                                </v-list>
                            </v-col>
                            <v-col>
                                <v-list>
                                    <v-list-item v-for="item in trim(realtimeData?.main?.b ?? '', '_').split('_')"
                                        :key="item">
                                        <v-list-item-title
                                            :style="{ color: realtimeData?.main?.y == item ? 'black' : (parseFloat(item) > parseFloat(realtimeData?.main?.y) ? 'red' : 'green') }"
                                            v-text="trim(item, '0')"></v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-col>
                        </v-row>
                        <hr style="margin-left: 8px;margin-right: 8px;">
                        <v-row>
                            <v-col>
                                <v-list-item
                                    :title="formatAsCurrency(trim(realtimeData?.main?.g ?? '', '_').split('_').map(x => parseInt(x)).reduce((a, b) => a + b), 0)">
                                </v-list-item>
                            </v-col>
                            <v-col>
                                <v-list-item title="小計">
                                </v-list-item>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="6">
                        <v-row>
                            <div style="width: 8px;"></div>
                            <v-col>
                                <v-label>委賣價</v-label>
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col>
                                <v-label>量</v-label>
                            </v-col>
                        </v-row>
                        <hr>
                        <v-row>
                            <v-col>
                                <v-list>
                                    <v-list-item v-for="item in trim(realtimeData?.main?.a ?? '', '_').split('_')"
                                        :key="item">
                                        <v-list-item-title
                                            :style="{ color: realtimeData?.main?.y == item ? 'black' : (parseFloat(item) > parseFloat(realtimeData?.main?.y) ? 'red' : 'green') }"
                                            v-text="trim(item, '0')"></v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-col>
                            <v-col>
                                <v-list>
                                    <v-list-item v-for="item in trim(realtimeData?.main?.f ?? '', '_').split('_')"
                                        :key="item">
                                        <v-list-item-title v-text="formatAsCurrency(parseInt(item), 0)">
                                        </v-list-item-title>
                                        <v-list-item-action>
                                            <v-progress-linear :model-value="parseInt(item)"
                                                :max="trim(realtimeData?.main?.f ?? '', '_').split('_').map(x => parseInt(x)).sort((a, b) => b - a)[0]">
                                            </v-progress-linear>
                                        </v-list-item-action>
                                    </v-list-item>
                                </v-list>
                            </v-col>
                        </v-row>
                        <hr style="margin-left: 8px;margin-right: 8px;">
                        <v-row>
                            <v-col>
                                <v-list-item title="小計">
                                </v-list-item>
                            </v-col>
                            <v-col>
                                <v-list-item
                                    :title="formatAsCurrency(trim(realtimeData?.main?.f ?? '', '_').split('_').map(x => parseInt(x)).reduce((a, b) => a + b), 0)">
                                </v-list-item>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
        <v-col cols="12"
            md="6">
            <h2>成分股即時現價</h2>
            <v-card>
                <v-progress-linear v-if="realtimeData.isreload"
                    color="primary"
                    indeterminate>
                </v-progress-linear>
                <v-data-table height="480px"
                    :headers="realtimeData.headers"
                    :items="realTimetableData"
                    item-value="name"></v-data-table>
            </v-card>
        </v-col>
    </v-row>
    <v-row style="height: 8px;"></v-row>
    <h2>{{ code }} 每日成分股異動 {{ (stocks?.length ?? 0) > 0 ? stocks[0]?.date : '' }} - {{ (stocks?.length ?? 0) ?
        stocks.at(stocks.length
            -
            1)?.date : '' }}</h2>
    <v-app-bar :style="{ 'padding-top': '8px', 'height': `${appbarHeight}px` }">
        <v-btn class="bg-secondary"
            @click="date = prevDate(date)"
            :disabled="formatDate(date) == prevDate(date)">前一日</v-btn>
        <VueDatePicker v-model="selectDate"
            :enable-time-picker="false"
            :clearable="false"
            auto-apply
            @open="appbarHeight = 422"
            @closed="appbarHeight = 72"
            :min-date="stocks != null && stocks[0] != null ? stocks[0].date : ''"
            :max-date="stocks != null && stocks[0] != null ? stocks[stocks.length - 1].date : ''" />
        <v-btn class="bg-primary"
            @click="date = nextDate(date)"
            :disabled="formatDate(date) == nextDate(date)">後一日</v-btn>
    </v-app-bar>
    <v-row>
        <v-col cols="12"
            sm="6">
            <Bar :data="chartData"
                :options="chartOptions"></Bar>
        </v-col>
        <v-col cols="12"
            sm="6">
            <v-data-table height="600px"
                :headers="headers"
                :items="tableData"
                item-value="name"></v-data-table>
        </v-col>
    </v-row>
    <v-row>
        <h2>{{ formatDate(date) }}與{{ formatDate(prevDate(date)) }}比較</h2>
    </v-row>
    <v-row style="height: 300px;">
        <Bar :data="compareData"
            :options="compareOptions"></Bar>
    </v-row>
</template>

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
                isreload: false,
                headers: [
                    {
                        title: '名稱',
                        align: 'start',
                        sortable: false,
                        key: 'name',
                    },
                    { title: '股價', align: 'end', key: 'volumn' },
                    { title: '漲跌', align: 'end', key: 'weights' },
                    { title: '漲跌幅(%)', align: 'end', key: 'weights' },
                    { title: '開盤', align: 'end', key: 'weights' },
                    { title: '昨收', align: 'end', key: 'weights' },
                    { title: '最高', align: 'end', key: 'weights' },
                    { title: '最低', align: 'end', key: 'weights' },
                ],
                main: {} as MsgArray,
                data: new Array<MsgArray>(),
            },
            selectDate: '',
            date: ''
        }
    },
    methods: {
        async loadRealTimeMainData() {
            if (this.stocks == null) return
            const { data } = await useAsyncData(`realtime_${this.code}`, () => $fetch('/api/stock', {
                params: {
                    code: this.code
                }
            }))

            this.realtimeData.main = (data.value as MsgArray[]).find(x => x.c == this.code) as MsgArray
            if (this.realtimeData.main.z == '-') {
                this.realtimeData.main.z = this.realtimeData.main.y
            }
        },
        async loadRealTimeData() {
            if (this.stocks == null) return
            this.realtimeData.isreload = true

            var labels = this.stocks[this.stocks.length - 1].stock.sort((a, b) => b.code.localeCompare(a.code)).map(x => x.code)
            const { data } = await useAsyncData(labels.join('-'), () => $fetch('/api/stock', {
                params: {
                    code: labels
                }
            }))

            this.realtimeData.data = (data.value as MsgArray[]).filter(x => x.c != this.code)
            await this.loadRealTimeMainData()
            this.realtimeData.isreload = false
        },
        formatAsCurrency(value: number, dec: number) {
            dec = dec || 0
            if (value === null) {
                return 0
            }
            return '' + value.toFixed(dec).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
        },
        trim(str: string, c: string) {
            if (str) {
                const pattern = new RegExp(`^${c}+|${c}+$`, 'g');
                return str.replace(pattern, '')
            }
            return str
        },
        formatDate(date: any) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear()

            if (month.length < 2)
                month = '0' + month
            if (day.length < 2)
                day = '0' + day

            return `${year}-${month}-${day}`
        },
        prevDate(date: any) {
            if (this.stocks == null) return date
            var nowIndex = this.stocks.findIndex(x => this.formatDate(x.date) == date)
            if (nowIndex == 0)
                return date

            if (this.stocks[nowIndex - 1] == null)
                return date
            return this.formatDate(this.stocks[nowIndex - 1]?.date)
        },
        nextDate(date: any) {
            if (this.stocks == null) return date

            var nowIndex = this.stocks.findIndex(x => this.formatDate(x.date) == date)
            if (nowIndex == this.stocks.length - 1)
                return date

            if (this.stocks[nowIndex + 1] == null)
                return date
            return this.formatDate(this.stocks[nowIndex + 1]?.date)
        },
        async loadInfo() {
            const { data } = await useAsyncData('18419', () => $fetch(`/stock/18419.json`), { server: false })
            // @ts-ignore
            this.infos = data.value
        },
        async loadData() {
            const { data } = await useAsyncData(this.code, () => $fetch(`/stock/${this.code}.json`), { server: false })
            // @ts-ignore
            this.stocks = data.value
        },
        async init() {
            await Promise.all([
                this.loadInfo(),
                this.loadData()
            ])
            if (this.d
                && this.d != undefined
                && this.d != null
                && !Number.isNaN(Date.parse(this.d as string))) {
                this.selectDate = this.formatDate(Date.parse(this.d as string))
                this.date = this.formatDate(Date.parse(this.d as string))
            } else {
                this.selectDate = this.formatDate(this.stocks[this.stocks.length - 1].date)
                this.date = this.formatDate(this.stocks[this.stocks.length - 1].date)
            }

            this.loadRealTimeData()
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

            var s = this.stocks.find(x => this.formatDate(x.date) == this.formatDate(this.date))
            s?.stock.sort((a, b) => b.code.localeCompare(a.code)).map(x => {
                return {
                    name: this.infos.find(y => y.公司代號 == x.code)?.公司簡稱 ?? x.code,
                    volumn: this.formatAsCurrency(x.volumn, 0),
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
            data.datasets[0].label = this.formatDate(this.date)
            data.datasets[0].data = []

            var s = this.stocks.find(x => this.formatDate(x.date) == this.formatDate(this.date))
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
            var edt = this.formatDate(this.date)

            data.labels = []
            data.datasets[0].data = []

            var ed = this.stocks.find(x => this.formatDate(x.date) == this.formatDate(edt))
            var sd = this.stocks.find(x => this.formatDate(x.date) == this.formatDate(sdt))

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
            this.selectDate = this.formatDate(newValue)
        },
        'date': function () {
            const queryString = window.location.search
            const urlParams = new URLSearchParams(queryString)
            if (urlParams.get('d') != this.formatDate(this.date)) {
                urlParams.set('d', this.formatDate(this.date))
                history.pushState(null, '', `/stock/${this.code}?${urlParams.toString()}`)
            }
        },
        'selectDate': function (newValue) {
            this.date = this.formatDate(newValue)
        }
    },
    components: {
        Bar, VueDatePicker
    },
    beforeMount() {
        this.init()
    },
    mounted() {
        this.init()
    }
}
</script>