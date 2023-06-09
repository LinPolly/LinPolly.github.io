<script setup lang="ts">
import { trimEnd, formatAsCurrency, diff, diffp, isNumeric } from '~/lib/string'
</script>

<template>
    <stocksearch :followstock="followstock"></stocksearch>
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
                <v-col v-for="(data, i) in realtimeData.data"
                    :key="i"
                    cols="12"
                    sm="12"
                    md="6"
                    lg="4"
                    lx="3"
                    xxl="2">
                    <stockcard :symbol="data"
                        :is-odd="follow.find(x => x.indexOf(data.c) > -1)?.endsWith('_odd') == true"
                        @target-odd="targetOdd"></stockcard>
                </v-col>
            </v-row>
            <v-row v-if="toggle_exclusive == 1">
                <v-col v-for="(data, i) in realtimeData.data"
                    :key="i">
                    <v-card elevation="5">
                        <v-card-title>
                            {{ data.n }} {{ data.c }}
                        </v-card-title>
                        <v-card-title>
                            <span
                                :style="{ fontSize: '32px', marginRight: '8px', color: diff(data?.z, data?.y) == 0 || !isNumeric(data.z) ? 'black' : (diff(data?.z, data?.y) > 0 ? 'red' : 'green') }">
                                {{
                                    isNumeric(data.z) ? trimEnd(formatAsCurrency(parseFloat(data.z), 2), '0') : data.z
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
                                :style="{ fontSize: '20px', color: diff(data?.z, data?.y) == 0 || !isNumeric(data.z) ? 'black' : (diff(data?.z, data?.y) > 0 ? 'red' : 'green') }">
                                {{ isNumeric(data.z) ? Math.abs(diff(data?.z, data?.y)) : data.z }}
                            </span>
                            <span
                                :style="{ fontSize: '20px', color: diff(data?.z, data?.y) == 0 || !isNumeric(data.z) ? 'black' : (diff(data?.z, data?.y) > 0 ? 'red' : 'green') }">
                                ({{ isNumeric(data.z) ? Math.abs(diffp(data?.z, data?.y)) : data.z }}%)
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
                    <v-switch
                        :label="`切換至${follow.find(x => x.indexOf(item.value.c) > -1)?.endsWith('_odd') ? '整股' : '零股'}`"
                        color="indigo"
                        :model-value="follow.find(x => x.indexOf(item.value.c) > -1)?.endsWith('_odd') == true"
                        inset
                        hide-details
                        @change="targetOdd(item.value.c)"></v-switch>
                    <v-btn class="bg-warning"
                        icon="mdi-delete"
                        @click="removeFollow(item.value.c)"></v-btn>
                </template>
            </v-data-table>
        </ClientOnly>
    </v-card>
</template>

<script lang="ts">
import { MsgArray } from '~/models/stock/twse'

export default {
    data() {
        return {
            toggle_exclusive: 0,
            follow: new Array<string>(),
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
        targetOdd(code: string) {
            var findex = this.follow.findIndex(x => x.indexOf(code) > -1)

            if (!this.follow[findex].endsWith('_odd')) {
                this.follow[findex] += '_odd'
            } else {
                this.follow[findex] = this.follow[findex].substring(0, this.follow[findex].length - '_odd'.length)
            }
        },
        async loadRealTimeData() {
            this.realtimeData.isdatareload = true

            if (this.follow.length > 0) {
                var labels = this.follow
                if (labels.length > 0) {
                    const batchSize = 20
                    var round = labels.length % batchSize == 0 ? labels.length / batchSize : (labels.length / batchSize) + 1;

                    for (let i = 0; i < round; i++) {
                        const offset = i * batchSize
                        const limit = batchSize
                        const _labels = labels.slice(offset, offset + limit)
                        if (_labels.length == 0) {
                            continue
                        }
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

                            var start = new Date(1, 1, 1, 9, 0, 0)
                            var end = new Date(1, 1, 1, 13, 31, 0)
                            var last = new Date(1, 1, 1, this.timer.lastudt.getHours(), this.timer.lastudt.getMinutes(), 0)

                            if (start <= last && last < end) {
                                if (d.z == '-'
                                    || d.z == undefined
                                    || d.z == null
                                    // 價格跳太快從yahoo修正當前價格
                                    || parseFloat(d.z) > parseFloat(trimEnd(d.a ?? '', '_').split('_')[0])
                                    || parseFloat(d.z) < parseFloat(trimEnd(d?.b ?? '', '_').split('_')[0])
                                ) {
                                    if (this.follow.some(x => x.startsWith(d.c) && x.endsWith('_odd')) == false) {
                                        const { data } = await useAsyncData(`yahoo_${d.c}`, () => $fetch(`/api/price?code=${d.c}`))
                                        // @ts-ignore
                                        d.z = data.value?.toString()
                                    }
                                }
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
        async loadInfo() {
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
            var start = new Date(1, 1, 1, 8, 30, 0)
            var end = new Date(1, 1, 1, 13, 31, 0)
            var last = new Date(1, 1, 1, this.timer.lastudt.getHours(), this.timer.lastudt.getMinutes(), 0)

            if (start <= last && last < end) {
                // @ts-ignore
                if (new Date() - this.timer.lastudt > 5_000) {
                    this.timer.lastudt = new Date()
                    await this.loadRealTimeData()
                }
            } else {
                this.timer.lastudt = new Date()
            }

            setTimeout(this.repeat, 1000 / 60);
        },
        async followstock(code: string) {
            if (this.follow.some(x => x == code)) {
                return
            }

            this.follow.push(code)
            this.follow = this.follow.filter(x => x != '')

            await this.loadRealTimeData()
        },
        async removeFollow(c: string) {
            this.follow = this.follow.filter(x => x != c && x != `${c}_odd`)
            this.realtimeData.data = this.realtimeData.data.filter(x => x.c != c)

            await this.loadRealTimeData()
        }
    },
    watch: {
        'follow': {
            handler: function () {
                localStorage.setItem('follow', this.follow.join('|'))
                const urlParams = new URLSearchParams();
                urlParams.set('f', this.follow.join('|'))
                // @ts-ignore
                history.pushState({}, null, this.$route.path + '?' + urlParams.toString())
            },
            deep: true
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