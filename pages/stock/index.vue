<script setup lang="ts">
import { trimEnd, formatAsCurrency, diff, diffp } from '~/lib/string'
</script>

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
        async loadRealTimeData() {
            this.realtimeData.isdatareload = true

            if (this.infos) {
                var labels = this.infos.map(x => x.公司代號).sort((a, b) => a.toString().localeCompare(b.toString()))
                if (labels.length > 0) {
                    const batchSize = 20
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