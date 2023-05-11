<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import { Bar } from 'vue-chartjs'
import '@vuepic/vue-datepicker/dist/main.css'
</script>

<template>
    <h1>00878 每日成分股異動 {{ (stocks?.length ?? 0) > 0 ? stocks[0]?.date : '' }} - {{ (stocks?.length ?? 0) ?
        stocks.at(stocks.length
            -
            1)?.date : '' }}</h1>
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
    <v-row style="height: 700px;flex-direction: column;">
        <Bar class="v-col-12 v-col-sm-6"
            :data="chartData"
            :options="chartOptions"></Bar>
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
import { Stock } from '~/models/stock/stock.js';
import { Info } from '~/models/stock/info';

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
            selectDate: '',
            date: ''
        }
    },
    methods: {
        formatAsCurrency(value: number, dec: number) {
            dec = dec || 0
            if (value === null) {
                return 0
            }
            return '' + value.toFixed(dec).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
        },
        formatDate(date: any) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return `${year}-${month}-${day}`;
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
            var route = useRoute()
            const code = route.params.code as string
            const { data } = await useAsyncData(code, () => $fetch(`/stock/${code}.json`), { server: false })
            // @ts-ignore
            this.stocks = data.value
        },
        async init() {
            await Promise.all([
                this.loadInfo(),
                this.loadData()
            ])
            var route = useRoute()
            if (route.query.d
                && route.query.d != undefined
                && route.query.d != null
                && !Number.isNaN(Date.parse(route.query.d as string))) {
                this.selectDate = this.formatDate(Date.parse(route.query.d as string))
                this.date = this.formatDate(Date.parse(route.query.d as string))
            } else {
                this.selectDate = this.formatDate(this.stocks[this.stocks.length - 1].date)
                this.date = this.formatDate(this.stocks[this.stocks.length - 1].date)
            }
        }
    },
    computed: {
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
                .forEach(x => data.labels.push(x));

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
                .forEach(x => data.labels.push(x));

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
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            if (urlParams.get('d') != this.formatDate(this.date)) {
                urlParams.set('d', this.formatDate(this.date));
                var route = useRoute()
                const code = route.params.code as string
                history.pushState(null, '', `/stock/${code}?${urlParams.toString()}`);
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