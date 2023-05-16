<template>
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
</template>

<script lang="ts">
import { Info } from '~/models/stock/info'
import { MsgArray } from '~/models/stock/twse'

export default {
    data() {
        return {
            infos: new Array<Info>(),
            realtimeData: {
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
                data: new Array<MsgArray>(),
            },
            timer: {
                lastudt: new Date()
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
            // @ts-ignore
            return ((arg1 * m - arg2 * m) / m).toFixed(n) as number;
        },
        async loadRealTimeData() {
            this.realtimeData.isdatareload = true

            if (this.infos) {
                var labels = this.infos.map(x => x.公司代號).sort((a, b) => b.toString().localeCompare(a.toString()))
                if (labels.length > 0) {
                    const batchSize = 10
                    var round = labels.length % batchSize == 0 ? labels.length / batchSize : (labels.length / batchSize) + 1;

                    for (let i = 0; i < round; i++) {
                        const offset = i * batchSize
                        const limit = batchSize
                        const _labels = labels.slice(offset, offset + limit)
                        const { data } = await useAsyncData(_labels.join('-'), () => $fetch('/api/stock', {
                            params: {
                                code: _labels
                            }
                        }))

                        var newData = (data.value as MsgArray[]).filter(x => x.c != this.code)

                        newData.forEach(item => {
                            if (!this.realtimeData.data.some(x => x.c == item.c)) {
                                this.realtimeData.data.push(item)
                            }
                        })

                        newData.forEach(async item => {
                            var d = this.realtimeData.data.find(x => x.c == item.c) as MsgArray

                            var keys = Object.keys(item)
                            keys.forEach(x => {
                                if (x == 'z' && item[x] == '-') {
                                } else {
                                    // @ts-ignore
                                    d[x] = item[x]
                                }
                            })

                            if (d.z == '-'
                                || d.z == undefined
                                || d.z == null) {
                                const { data } = await useAsyncData(`yahoo_${d.c}`, () => $fetch(`/api/price?code=${d.c}`))
                                // @ts-ignore
                                d.z = data.value
                            }
                        })

                        var delay = new Promise((resolve, reject) => {
                            setTimeout(resolve, 5000)
                        })
                        await delay
                    }
                }
            } else {
                // @ts-ignore
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
        async loadInfo() {
            // @ts-ignore
            const { data } = await useAsyncData('18419', () => $fetch(`/stock/18419.json`), { server: false })
            // @ts-ignore
            this.infos = data.value
        },
        async init() {
            await Promise.all([
                this.loadInfo(),
            ])

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

            setTimeout(this.repeat, 5000);
        }
    },
    computed: {
        code() {
            return this.$route.params.code as string
        },
        d() {
            return this.$route.query.d
        },
        realTimetableData() {
            return this.realtimeData.data
        }
    },
    beforeMount() {
        this.init()
    },
    mounted() {
        this.init()
    }
}
</script>