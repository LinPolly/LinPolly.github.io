<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import { Bar } from 'vue-chartjs'
import '@vuepic/vue-datepicker/dist/main.css'
</script>

<template>
    <v-row>
        <v-col style="display: flex !important;align-items: center;">
            <h1 v-if="realtimeData?.main"
                style="margin-right: 8px;">{{ realtimeData.main.n }}</h1>
            <span style="font-size: 24px;">{{ code }}</span>
        </v-col>
    </v-row>
    <v-row>
        <v-col v-if="realtimeData?.main"
            cols="12"
            md="6">
            <h2>即時現價</h2>
            <v-card elevation="5">
                <v-progress-linear v-if="realtimeData.ismainreload"
                    color="primary"
                    indeterminate>
                </v-progress-linear>
                <v-card-title>
                    <span
                        :style="{ fontSize: '32px', marginRight: '8px', color: diff(realtimeData?.main?.z, realtimeData?.main?.y) == 0 ? 'black' : (diff(realtimeData?.main?.z, realtimeData?.main?.y) > 0 ? 'red' : 'green') }">
                        {{
                            trimEnd(formatAsCurrency(parseFloat(realtimeData.main.z), 2), '0')
                        }}
                    </span>
                    <svg v-if="diff(realtimeData?.main?.z, realtimeData?.main?.y) < 0"
                        width="15"
                        height="15"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M4.12046 8.42605C4.5011 9.11206 5.48741 9.11259 5.86878 8.42698L9.17336 2.4861C9.54412 1.81956 9.06218 1 8.29946 1L1.69849 0.999999C0.936239 0.999999 0.454246 1.81866 0.824077 2.48518L4.12046 8.42605Z"
                            fill="#30B566"></path>
                    </svg>
                    <svg v-if="diff(realtimeData?.main?.z, realtimeData?.main?.y) > 0"
                        width="15"
                        height="15"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M4.12046 1.57395C4.5011 0.887937 5.48741 0.887414 5.86878 1.57302L9.17336 7.5139C9.54412 8.18044 9.06218 9 8.29946 9L1.69849 9C0.936239 9 0.454246 8.18134 0.824077 7.51482L4.12046 1.57395Z"
                            fill="#D3321C"></path>
                    </svg>
                    <span
                        :style="{ fontSize: '20px', color: diff(realtimeData?.main?.z, realtimeData?.main?.y) == 0 ? 'black' : (diff(realtimeData?.main?.z, realtimeData?.main?.y) > 0 ? 'red' : 'green') }">
                        {{ Math.abs(diff(realtimeData?.main?.z, realtimeData?.main?.y)) }}
                    </span>
                    <span
                        :style="{ fontSize: '20px', color: diff(realtimeData?.main?.z, realtimeData?.main?.y) == 0 ? 'black' : (diff(realtimeData?.main?.z, realtimeData?.main?.y) > 0 ? 'red' : 'green') }">
                        ({{ Math.abs(diffp(realtimeData?.main?.z, realtimeData?.main?.y)) }}%)
                    </span>
                </v-card-title>
                <v-row>
                    <v-col cols="6">
                        <v-list class="v-col-12">
                            <v-list-item title="成交"
                                :subtitle="trimEnd(realtimeData?.main?.z, '0')"></v-list-item>
                            <v-list-item title="開盤"
                                :subtitle="trimEnd(realtimeData?.main?.o, '0')"></v-list-item>
                            <v-list-item title="最高"
                                :subtitle="trimEnd(realtimeData?.main?.h, '0')"></v-list-item>
                            <v-list-item title="最低"
                                :subtitle="trimEnd(realtimeData?.main?.l, '0')"></v-list-item>
                        </v-list>
                    </v-col>
                    <v-col cols="6">
                        <v-list class="v-col-12">
                            <v-list-item title="昨收"
                                :subtitle="trimEnd(realtimeData?.main?.y, '0')"></v-list-item>
                            <v-list-item title="漲跌"
                                :subtitle="`${diff(realtimeData?.main?.z, realtimeData?.main?.y)}`"></v-list-item>
                            <v-list-item title="漲跌幅(%)"
                                :subtitle="`${diffp(realtimeData?.main?.z, realtimeData?.main?.y)}%`"></v-list-item>
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
                                    <v-list-item v-for="item in trimEnd(realtimeData?.main?.g ?? '', '_').split('_')"
                                        :key="item">
                                        <v-list-item-title v-text="formatAsCurrency(parseInt(item), 0)">
                                        </v-list-item-title>
                                        <v-list-item-action>
                                            <v-progress-linear :model-value="parseInt(item)"
                                                :max="trimEnd(realtimeData?.main?.g ?? '', '_').split('_').map(x => parseInt(x)).sort((a, b) => b - a)[0]"
                                                reverse>
                                            </v-progress-linear>
                                        </v-list-item-action>
                                    </v-list-item>
                                </v-list>
                            </v-col>
                            <v-col>
                                <v-list>
                                    <v-list-item v-for="item in trimEnd(realtimeData?.main?.b ?? '', '_').split('_')"
                                        :key="item">
                                        <v-list-item-title
                                            :style="{ color: realtimeData?.main?.y == item ? 'black' : (parseFloat(item) > parseFloat(realtimeData?.main?.y) ? 'red' : 'green') }"
                                            v-text="trimEnd(item, '0')"></v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-col>
                        </v-row>
                        <hr style="margin-left: 8px;margin-right: 8px;">
                        <v-row>
                            <v-col>
                                <v-list-item
                                    :title="formatAsCurrency(trimEnd(realtimeData?.main?.g ?? '', '_').split('_').map(x => parseInt(x)).reduce((a, b) => a + b), 0)">
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
                                    <v-list-item v-for="item in trimEnd(realtimeData?.main?.a ?? '', '_').split('_')"
                                        :key="item">
                                        <v-list-item-title
                                            :style="{ color: realtimeData?.main?.y == item ? 'black' : (parseFloat(item) > parseFloat(realtimeData?.main?.y) ? 'red' : 'green') }"
                                            v-text="trimEnd(item, '0')"></v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-col>
                            <v-col>
                                <v-list>
                                    <v-list-item v-for="item in trimEnd(realtimeData?.main?.f ?? '', '_').split('_')"
                                        :key="item">
                                        <v-list-item-title v-text="formatAsCurrency(parseInt(item), 0)">
                                        </v-list-item-title>
                                        <v-list-item-action>
                                            <v-progress-linear :model-value="parseInt(item)"
                                                :max="trimEnd(realtimeData?.main?.f ?? '', '_').split('_').map(x => parseInt(x)).sort((a, b) => b - a)[0]">
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
                                    :title="formatAsCurrency(trimEnd(realtimeData?.main?.f ?? '', '_').split('_').map(x => parseInt(x)).reduce((a, b) => a + b), 0)">
                                </v-list-item>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
        <v-col v-if="realtimeData?.data"
            cols="12"
            md="6">
            <h2>成分股即時現價</h2>
            <v-card elevation="5">
                <v-progress-linear v-if="realtimeData.isdatareload"
                    color="primary"
                    indeterminate>
                </v-progress-linear>
                <ClientOnly>
                    <v-data-table :headers="realtimeData.headers"
                        :items="realTimetableData"
                        item-value="name">
                        <template v-slot:item.c="{ item }">
                            <v-card elevation="0">
                                <v-card-title>
                                    <span>{{ infos.find(x => x.公司代號 == item.value.c)?.公司簡稱 }}</span>
                                </v-card-title>
                                <v-card-subtitle>
                                    <span>{{ item.value.c }}</span>
                                </v-card-subtitle>
                            </v-card>
                        </template>
                        <template v-slot:item.z="{ item }">
                            <span
                                :style="{ color: diff(item.value.z, item.value.y) == 0 ? 'black' : (diff(item.value.z, item.value.y) > 0 ? 'red' : 'green') }">{{
                                    trimEnd(item.value.z, '0') }}</span>
                        </template>
                        <template v-slot:item.diff="{ item }">
                            <span
                                :style="{ color: diff(item.value.z, item.value.y) == 0 ? 'black' : (diff(item.value.z, item.value.y) > 0 ? 'red' : 'green') }">
                                {{
                                    diff(item.value.z, item.value.y)
                                }}
                            </span>
                        </template>
                        <template v-slot:item.diffp="{ item }">
                            <span
                                :style="{ color: diffp(item.value.z, item.value.y) == 0 ? 'black' : (diff(item.value.z, item.value.y) > 0 ? 'red' : 'green') }">
                                {{
                                    diffp(item.value.z, item.value.y)
                                }}%
                            </span>
                        </template>
                        <template v-slot:item.o="{ item }">
                            <span
                                :style="{ color: parseFloat(item.value.o) == parseFloat(item.value.y) ? 'black' : (parseFloat(item.value.o) > parseFloat(item.value.y) ? 'red' : 'green') }">
                                {{ trimEnd(item.value.o, '0') }}
                            </span>
                        </template>
                        <template v-slot:item.y="{ item }">
                            <span>
                                {{ trimEnd(item.value.y, '0') }}
                            </span>
                        </template>
                        <template v-slot:item.h="{ item }">
                            <span
                                :style="{ color: parseFloat(item.value.h) == parseFloat(item.value.y) ? 'black' : (parseFloat(item.value.h) > parseFloat(item.value.y) ? 'red' : 'green') }">
                                {{ trimEnd(item.value.h, '0') }}
                            </span>
                        </template>
                        <template v-slot:item.l="{ item }">
                            <span
                                :style="{ color: parseFloat(item.value.l) == parseFloat(item.value.y) ? 'black' : (parseFloat(item.value.l) > parseFloat(item.value.y) ? 'red' : 'green') }">
                                {{ trimEnd(item.value.l, '0') }}
                            </span>
                        </template>
                    </v-data-table>
                </ClientOnly>
            </v-card>
        </v-col>
    </v-row>
    <v-row style="height: 8px;"></v-row>
    <div v-if="stocks">
        <h2>{{ code }} 每日成分股異動 {{ (stocks?.length ?? 0) > 0 ? stocks[0]?.date : '' }} - {{ (stocks?.length ??
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
                ismainreload: false,
                isdatareload: false,
                headers: [
                    { title: '名稱', align: 'start', sortable: false, key: 'c' },
                    { title: '股價', align: 'end', key: 'z' },
                    { title: '漲跌', align: 'end', key: 'diff' },
                    { title: '漲跌幅(%)', align: 'end', key: 'diffp' },
                    { title: '開盤', align: 'end', key: 'o' },
                    { title: '昨收', align: 'end', key: 'y' },
                    { title: '最高', align: 'end', key: 'h' },
                    { title: '最低', align: 'end', key: 'l' },
                ],
                main: {} as MsgArray,
                data: new Array<MsgArray>(),
            },
            selectDate: '',
            date: '',
            timer: {
                lastudt: new Date(),
                t: ''
            }
        }
    },
    methods: {
        diff(z: string, y: string) {
            var v = this.accSubtr(parseFloat(z), parseFloat(y))
            if (v == 0)
                return 0
            return v
        },
        diffp(z: string, y: string) {
            var v = ((this.accSubtr(parseFloat(z), parseFloat(y)) * 100 /
                parseFloat(y) * 100) / 100)

            if (v == 0)
                return 0
            return this.trimEnd(v.toFixed(2), '0')
        },
        //除法
        accDiv(arg1: number, arg2: number) {
            var t1 = 0, t2 = 0, r1, r2;
            try {
                t1 = arg1.toString().split(".")[1].length;
            } catch (e) { }
            try {
                t2 = arg2.toString().split(".")[1].length;
            } catch (e) { }

            r1 = Number(arg1.toString().replace(".", ""));
            r2 = Number(arg2.toString().replace(".", ""));
            return (r1 / r2) * Math.pow(10, t2 - t1);
        },
        //乘法
        accMul(arg1: number, arg2: number) {
            var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
            try {
                m += s1.split(".")[1].length;
            } catch (e) { }
            try {
                m += s2.split(".")[1].length;
            } catch (e) { }
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
        },
        //加法
        accAdd(arg1: number, arg2: number) {
            var r1, r2, m;
            try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
            try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
            m = Math.pow(10, Math.max(r1, r2));
            return (arg1 * m + arg2 * m) / m;
        },
        //減法
        accSubtr(arg1: number, arg2: number) {
            var r1, r2, m, n;
            try {
                r1 = arg1.toString().split(".")[1].length;
            } catch (e) { r1 = 0 }
            try {
                r2 = arg2.toString().split(".")[1].length;
            } catch (e) { r2 = 0 }
            m = Math.pow(10, Math.max(r1, r2));
            n = (r1 >= r2) ? r1 : r2;
            return ((arg1 * m - arg2 * m) / m).toFixed(n) as number;
        },
        async loadRealTimeMainData() {
            this.realtimeData.ismainreload = true
            const { data } = await useAsyncData(`realtime_${this.code}`, () => $fetch('/api/stock', {
                params: {
                    code: this.code
                }
            }))

            var newData = (data.value as MsgArray[]).find(x => x.c == this.code) as MsgArray
            if (this.realtimeData.main.c == '')
                this.realtimeData.main = newData

            var keys = Object.keys(newData)
            keys.forEach(x => {
                if (x == 'z' && newData[x] == '-') {
                } else {
                    this.realtimeData.main[x] = newData[x]
                }
            })
            if (this.realtimeData.main.z == '-') {
                this.realtimeData.main.z = this.realtimeData.main.y
            }
            this.realtimeData.ismainreload = false
        },
        async loadRealTimeData() {
            await this.loadRealTimeMainData()

            this.realtimeData.isdatareload = true

            if (this.stocks) {
                var labels = this.stocks[this.stocks.length - 1]?.stock?.sort((a, b) => b.code.localeCompare(a.code)).map(x => x.code)
                if (labels) {
                    const { data } = await useAsyncData(labels.join('-'), () => $fetch('/api/stock', {
                        params: {
                            code: labels
                        }
                    }))

                    var newData = (data.value as MsgArray[]).filter(x => x.c != this.code)
                    if (this.realtimeData.data.length == 0)
                        this.realtimeData.data = newData

                    newData.forEach(item => {
                        var keys = Object.keys(item)
                        keys.forEach(x => {
                            if (x == 'z' && item[x] == '-') {
                            } else {
                                var d = this.realtimeData.data.find(x => x.c == item.c)
                                d[x] = item[x]
                            }
                        })
                    })
                }
            } else {
                this.realtimeData.data = null
            }
            this.realtimeData.isdatareload = false
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
                if (str === '0.00')
                    return '0'

                const pattern = new RegExp(`^${c}+|${c}+$`, 'g');
                var v = str.replace(pattern, '')

                if (v.endsWith('.')) {
                    return v.substring(0, v.length - 1)
                }

                return v
            }
            return str
        },
        trimEnd(str: string, c: string) {
            if (str) {
                if (str === '0.00')
                    return '0'

                const pattern = new RegExp(`^|${c}+$`, 'g');
                var v = str.replace(pattern, '')

                if (v.endsWith('.')) {
                    return v.substring(0, v.length - 1)
                }

                return v
            }
            return str
        },
        trimStart(str: string, c: string) {
            if (str) {
                if (str === '0.00')
                    return '0'

                const pattern = new RegExp(`^${c}+|$`, 'g');
                var v = str.replace(pattern, '')

                if (v.endsWith('.')) {
                    return v.substring(0, v.length - 1)
                }

                return v
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
            if (this.stocks.length == 0) return date

            var nowIndex = this.stocks?.findIndex(x => this.formatDate(x.date) == date)
            if (nowIndex == null || nowIndex == -1 || nowIndex == 0)
                return date

            if (this.stocks[nowIndex - 1] == null)
                return date
            return this.formatDate(this.stocks[nowIndex - 1]?.date)
        },
        nextDate(date: any) {
            if (this.stocks == null) return date

            var nowIndex = this.stocks?.findIndex(x => this.formatDate(x.date) == date)
            if (nowIndex == null || nowIndex == -1 || nowIndex == this.stocks.length - 1)
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
            if (Array.isArray(data.value)) {
                // @ts-ignore
                this.stocks = data.value
            } else {
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
                    this.selectDate = this.formatDate(Date.parse(this.d as string))
                    this.date = this.formatDate(Date.parse(this.d as string))
                } else {
                    this.selectDate = this.formatDate(this.stocks[this.stocks.length - 1].date)
                    this.date = this.formatDate(this.stocks[this.stocks.length - 1].date)
                }
            }

            this.loadRealTimeData()
            this.t = setInterval(async () => {
                if (this.timer.lastudt.getHours() < 9 || (this.timer.lastudt.getHours() >= 13 && this.timer.lastudt.getMinutes() > 30)) {
                    clearInterval(this.t)
                    return
                }
                if (new Date() - this.timer.lastudt > 5_000) {
                    this.timer.lastudt = new Date()
                    await this.loadRealTimeData()
                }
            }, 1000 / 60);
        },
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
        realTimetableData() {
            var data = {}
            return this.realtimeData.data
        }
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