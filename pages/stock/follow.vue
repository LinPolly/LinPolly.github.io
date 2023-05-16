<template>
    <v-text-field label="股票代碼"
        v-model="inputfollow"
        append-inner-icon="mdi-plus"
        @click:append-inner="followstock"></v-text-field>
    <v-row v-if="inputfollow.length > 0">
        <v-col
            v-for="s in infos.filter(x => x.公司代號.toString().indexOf(inputfollow) > -1 || x.公司簡稱.toString().indexOf(inputfollow) > -1 || x.公司名稱.toString().indexOf(inputfollow) > -1)">
            <v-btn @click="inputfollow = s.公司代號">
                <v-card-title>
                    {{ s.公司簡稱 }} {{ s.公司代號 }}
                </v-card-title>
            </v-btn>
        </v-col>
    </v-row>
    <div style="height: 8px;"></div>
    <v-btn-toggle v-model="toggle_exclusive"
        elevation="5"
        mandatory>
        <v-btn>
            <v-icon>mdi-view-grid</v-icon>
        </v-btn>
        <v-btn>
            <v-icon>mdi-grid</v-icon>
        </v-btn>
        <v-btn>
            <v-icon>mdi-format-list-bulleted</v-icon>
        </v-btn>
    </v-btn-toggle>
    <div style="height: 8px;"></div>
    <v-card>
        <v-progress-linear v-if="realtimeData.isdatareload"
            color="primary"
            indeterminate>
        </v-progress-linear>
        <ClientOnly>
            <v-row v-if="toggle_exclusive == 0">
                <v-col v-for="data in realtimeData.data"
                    :key="data.c"
                    cols="12"
                    sm="6"
                    md="6"
                    lg="4"
                    lx="3"
                    xxl="2">
                    <v-card elevation="5">
                        <v-card-title>
                            {{ data.n }} {{ data.c }}
                        </v-card-title>
                        <hr>
                        <v-card-title>
                            <span
                                :style="{ fontSize: '32px', marginRight: '8px', color: diff(data?.z, data?.y) == 0 ? 'black' : (diff(data?.z, data?.y) > 0 ? 'red' : 'green') }">
                                {{
                                    trimEnd(formatAsCurrency(parseFloat(data.z), 2), '0')
                                }}
                            </span>
                            <svg v-if="diff(data?.z, data?.y) < 0"
                                width="15"
                                height="15"
                                viewBox="0 0 10 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M4.12046 8.42605C4.5011 9.11206 5.48741 9.11259 5.86878 8.42698L9.17336 2.4861C9.54412 1.81956 9.06218 1 8.29946 1L1.69849 0.999999C0.936239 0.999999 0.454246 1.81866 0.824077 2.48518L4.12046 8.42605Z"
                                    fill="#30B566"></path>
                            </svg>
                            <svg v-if="diff(data?.z, data?.y) > 0"
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
                                :style="{ fontSize: '20px', color: diff(data?.z, data?.y) == 0 ? 'black' : (diff(data?.z, data?.y) > 0 ? 'red' : 'green') }">
                                {{ Math.abs(diff(data?.z, data?.y)) }}
                            </span>
                            <span
                                :style="{ fontSize: '20px', color: diff(data?.z, data?.y) == 0 ? 'black' : (diff(data?.z, data?.y) > 0 ? 'red' : 'green') }">
                                ({{ Math.abs(diffp(data?.z, data?.y)) }}%)
                            </span>
                        </v-card-title>
                        <v-row>
                            <v-col cols="6">
                                <v-list class="v-col-12">
                                    <v-list-item title="成交"
                                        :subtitle="trimEnd(data?.z, '0')"></v-list-item>
                                    <v-list-item title="開盤"
                                        :subtitle="trimEnd(data?.o, '0')"></v-list-item>
                                    <v-list-item title="最高"
                                        :subtitle="trimEnd(data?.h, '0')"></v-list-item>
                                    <v-list-item title="最低"
                                        :subtitle="trimEnd(data?.l, '0')"></v-list-item>
                                </v-list>
                            </v-col>
                            <v-col cols="6">
                                <v-list class="v-col-12">
                                    <v-list-item title="昨收"
                                        :subtitle="trimEnd(data?.y, '0')"></v-list-item>
                                    <v-list-item title="漲跌"
                                        :subtitle="`${diff(data?.z, data?.y)}`"></v-list-item>
                                    <v-list-item title="漲跌幅(%)"
                                        :subtitle="`${diffp(data?.z, data?.y)}%`"></v-list-item>
                                    <v-list-item title="總量"
                                        :subtitle="data?.v"></v-list-item>
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
                                            <v-list-item v-for="item in trimEnd(data?.g ?? '', '_').split('_')"
                                                :key="item">
                                                <v-list-item-title v-text="formatAsCurrency(parseInt(item), 0)">
                                                </v-list-item-title>
                                                <v-list-item-action>
                                                    <v-progress-linear :model-value="parseInt(item)"
                                                        :max="trimEnd(data?.g ?? '', '_').split('_').map(x => parseInt(x)).sort((a, b) => b - a)[0]"
                                                        reverse>
                                                    </v-progress-linear>
                                                </v-list-item-action>
                                            </v-list-item>
                                        </v-list>
                                    </v-col>
                                    <v-col>
                                        <v-list>
                                            <v-list-item v-for="item in trimEnd(data?.b ?? '', '_').split('_')"
                                                :key="item">
                                                <v-list-item-title
                                                    :style="{ color: data?.y == item ? 'black' : (parseFloat(item) > parseFloat(data?.y) ? 'red' : 'green') }"
                                                    v-text="trimEnd(item, '0')"></v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                    </v-col>
                                </v-row>
                                <hr style="margin-left: 8px;margin-right: 8px;">
                                <v-row>
                                    <v-col>
                                        <v-list-item
                                            :title="formatAsCurrency(trimEnd(data?.g ?? '', '_').split('_').map(x => parseInt(x)).reduce((a, b) => a + b), 0)">
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
                                            <v-list-item v-for="item in trimEnd(data?.a ?? '', '_').split('_')"
                                                :key="item">
                                                <v-list-item-title
                                                    :style="{ color: data?.y == item ? 'black' : (parseFloat(item) > parseFloat(data?.y) ? 'red' : 'green') }"
                                                    v-text="trimEnd(item, '0')"></v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                    </v-col>
                                    <v-col>
                                        <v-list>
                                            <v-list-item v-for="item in trimEnd(data?.f ?? '', '_').split('_')"
                                                :key="item">
                                                <v-list-item-title v-text="formatAsCurrency(parseInt(item), 0)">
                                                </v-list-item-title>
                                                <v-list-item-action>
                                                    <v-progress-linear :model-value="parseInt(item)"
                                                        :max="trimEnd(data?.f ?? '', '_').split('_').map(x => parseInt(x)).sort((a, b) => b - a)[0]">
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
                                            :title="formatAsCurrency(trimEnd(data?.f ?? '', '_').split('_').map(x => parseInt(x)).reduce((a, b) => a + b), 0)">
                                        </v-list-item>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
            <v-row v-if="toggle_exclusive == 1">
                <v-col v-for="data in realtimeData.data"
                    :key="data.c">
                    <v-card elevation="5">
                        <v-card-title>
                            {{ data.n }} {{ data.c }}
                        </v-card-title>
                        <v-card-title>
                            <span
                                :style="{ fontSize: '32px', marginRight: '8px', color: diff(data?.z, data?.y) == 0 ? 'black' : (diff(data?.z, data?.y) > 0 ? 'red' : 'green') }">
                                {{
                                    trimEnd(formatAsCurrency(parseFloat(data.z), 2), '0')
                                }}
                            </span>
                            <svg v-if="diff(data?.z, data?.y) < 0"
                                width="15"
                                height="15"
                                viewBox="0 0 10 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M4.12046 8.42605C4.5011 9.11206 5.48741 9.11259 5.86878 8.42698L9.17336 2.4861C9.54412 1.81956 9.06218 1 8.29946 1L1.69849 0.999999C0.936239 0.999999 0.454246 1.81866 0.824077 2.48518L4.12046 8.42605Z"
                                    fill="#30B566"></path>
                            </svg>
                            <svg v-if="diff(data?.z, data?.y) > 0"
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
                                :style="{ fontSize: '20px', color: diff(data?.z, data?.y) == 0 ? 'black' : (diff(data?.z, data?.y) > 0 ? 'red' : 'green') }">
                                {{ Math.abs(diff(data?.z, data?.y)) }}
                            </span>
                            <span
                                :style="{ fontSize: '20px', color: diff(data?.z, data?.y) == 0 ? 'black' : (diff(data?.z, data?.y) > 0 ? 'red' : 'green') }">
                                ({{ Math.abs(diffp(data?.z, data?.y)) }}%)
                            </span>
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-row>
            <v-data-table v-if="toggle_exclusive == 2"
                :headers="realtimeData.headers"
                :items="realTimetableData"
                item-value="name">
                <template v-slot:item.c="{ item }">
                    <v-card elevation="0">
                        <v-card-title>
                            <span>{{ item.value.n }}</span>
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
                <template v-slot:item.action="{ item }">
                    <v-btn class="bg-warning"
                        icon="mdi-delete"
                        @click="removeFollow(item.value.c)"></v-btn>
                </template>
            </v-data-table>
        </ClientOnly>
    </v-card>
</template>

<script lang="ts">
import { Info } from '~/models/stock/info'
import { MsgArray } from '~/models/stock/twse'

export default {
    data() {
        return {
            toggle_exclusive: 0,
            inputfollow: '',
            follow: new Array<string>(),
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
                    { title: '', align: 'end', key: 'action' },
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

            if (this.infos && this.follow.length > 0) {
                var labels = this.follow
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
                            if (this.realtimeData.data == null) {
                                this.realtimeData.data = []
                            }
                            if (this.realtimeData.data.some(x => x.c == item.c) != true) {
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

            var f = localStorage.getItem('follow')
            if (f != null && f != '') {
                this.follow = f?.split('|').filter(x => x != '')
            }
        },
        async init() {
            if (this.$route.query.f) {
                // @ts-ignore
                this.follow = this.$route.query.f.split('|').filter(x => x != '')
            }
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
        },
        async followstock() {
            if (this.follow.some(x => x == this.follow)) {
                this.inputfollow = ''
                return
            }

            this.follow.push(this.inputfollow)
            this.follow = this.follow.filter(x => x != '')
            this.inputfollow = ''

            if (this.timer.lastudt.getHours() < 9
                || this.timer.lastudt.getHours() >= 14
                || (this.timer.lastudt.getHours() >= 13 && this.timer.lastudt.getMinutes() > 30)) {
                await this.loadRealTimeData()
                return
            }
        },
        async removeFollow(c: string) {
            this.follow = this.follow.filter(x => x != c)
            this.realtimeData.data = this.realtimeData.data.filter(x => x.c != c)

            if (this.timer.lastudt.getHours() < 9
                || this.timer.lastudt.getHours() >= 14
                || (this.timer.lastudt.getHours() >= 13 && this.timer.lastudt.getMinutes() > 30)) {
                await this.loadRealTimeData()
                return
            }
        }
    },
    watch: {
        'follow': function () {
            localStorage.setItem('follow', this.follow.join('|'))
            const urlParams = new URLSearchParams();
            urlParams.set('f', this.follow.join('|'))
            // @ts-ignore
            history.pushState({}, null, this.$route.path + '?' + urlParams.toString())
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
            return this.realtimeData.data ?? []
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