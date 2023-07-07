<template>
    <client-only>
        <v-card elevation="5">
            <v-card-title>
                <v-row>
                    <v-col v-if="cardStyle != 'mini'">{{ symbol.n }} {{ symbol.c }}</v-col>
                    <v-list-item v-if="cardStyle == 'mini'">
                        <v-list-item-title>
                            {{ symbol.n }} {{ symbol.c }}
                        </v-list-item-title>
                        <hr style="margin-bottom: 8px;">
                        <v-list-item-subtitle>
                            <span
                                :style="{ fontSize: '16px', marginRight: '8px', color: diff(symbol?.z, symbol?.y) == 0 || !isNumeric(symbol.z) ? null : (diff(symbol?.z, symbol?.y) > 0 ? 'red' : 'green') }">
                                {{
                                    isNumeric(symbol.z) ? trimEnd(formatAsCurrency(parseFloat(symbol.z), 2), '0') : symbol.z
                                }}
                            </span>
                            <svg v-if="diff(symbol?.z, symbol?.y) < 0"
                                width="10"
                                height="10"
                                viewBox="0 0 10 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M4.12046 8.42605C4.5011 9.11206 5.48741 9.11259 5.86878 8.42698L9.17336 2.4861C9.54412 1.81956 9.06218 1 8.29946 1L1.69849 0.999999C0.936239 0.999999 0.454246 1.81866 0.824077 2.48518L4.12046 8.42605Z"
                                    fill="#30B566"></path>
                            </svg>
                            <svg v-if="diff(symbol?.z, symbol?.y) > 0"
                                width="10"
                                height="10"
                                viewBox="0 0 10 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M4.12046 1.57395C4.5011 0.887937 5.48741 0.887414 5.86878 1.57302L9.17336 7.5139C9.54412 8.18044 9.06218 9 8.29946 9L1.69849 9C0.936239 9 0.454246 8.18134 0.824077 7.51482L4.12046 1.57395Z"
                                    fill="#D3321C"></path>
                            </svg>
                            <span
                                :style="{ fontSize: '10px', color: diff(symbol?.z, symbol?.y) == 0 || !isNumeric(symbol.z) ? null : (diff(symbol?.z, symbol?.y) > 0 ? 'red' : 'green') }">
                                {{ isNumeric(symbol.z) ? Math.abs(diff(symbol?.z, symbol?.y)) : symbol.z }}
                            </span>
                            <span
                                :style="{ fontSize: '10px', color: diff(symbol?.z, symbol?.y) == 0 || !isNumeric(symbol.z) ? null : (diff(symbol?.z, symbol?.y) > 0 ? 'red' : 'green') }">
                                ({{ isNumeric(symbol.z) ? Math.abs(diffp(symbol?.z, symbol?.y)) : symbol.z }}%)
                            </span>
                        </v-list-item-subtitle>
                        <v-list-item-subtitle>
                            總量 {{ trimEnd(formatAsCurrency(parseFloat(symbol?.v), 2), '0') }}張
                        </v-list-item-subtitle>
                    </v-list-item>
                    <v-col cols="5"
                        v-if="cardStyle != 'mini'">
                        <v-switch :label="`切換至${isOdd ? '整股' : '零股'}`"
                            color="indigo"
                            :model-value="isOdd"
                            inset
                            hide-details
                            @change="target_Odd(symbol.c)"></v-switch>
                    </v-col>
                </v-row>
            </v-card-title>
            <hr v-if="cardStyle != 'mini'">
            <v-card-title v-if="cardStyle != 'mini'">
                <span
                    :style="{ fontSize: '32px', marginRight: '8px', color: diff(symbol?.z, symbol?.y) == 0 || !isNumeric(symbol.z) ? null : (diff(symbol?.z, symbol?.y) > 0 ? 'red' : 'green') }">
                    {{
                        isNumeric(symbol.z) ? trimEnd(formatAsCurrency(parseFloat(symbol.z), 2), '0') : symbol.z
                    }}
                </span>
                <svg v-if="diff(symbol?.z, symbol?.y) < 0"
                    width="15"
                    height="15"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M4.12046 8.42605C4.5011 9.11206 5.48741 9.11259 5.86878 8.42698L9.17336 2.4861C9.54412 1.81956 9.06218 1 8.29946 1L1.69849 0.999999C0.936239 0.999999 0.454246 1.81866 0.824077 2.48518L4.12046 8.42605Z"
                        fill="#30B566"></path>
                </svg>
                <svg v-if="diff(symbol?.z, symbol?.y) > 0"
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
                    :style="{ fontSize: '20px', color: diff(symbol?.z, symbol?.y) == 0 || !isNumeric(symbol.z) ? null : (diff(symbol?.z, symbol?.y) > 0 ? 'red' : 'green') }">
                    {{ isNumeric(symbol.z) ? Math.abs(diff(symbol?.z, symbol?.y)) : symbol.z }}
                </span>
                <span
                    :style="{ fontSize: '20px', color: diff(symbol?.z, symbol?.y) == 0 || !isNumeric(symbol.z) ? null : (diff(symbol?.z, symbol?.y) > 0 ? 'red' : 'green') }">
                    ({{ isNumeric(symbol.z) ? Math.abs(diffp(symbol?.z, symbol?.y)) : symbol.z }}%)
                </span>
            </v-card-title>
            <v-row style="height: 350px;padding: 0;margin: 0;"
                v-if="!isOdd && cardStyle != 'nochart' && cardStyle != 'mini'">
                <stockchart v-if="symbol?.c"
                    :symbol="symbol"
                    style="width: 100%;"></stockchart>
            </v-row>
            <v-row v-if="cardStyle != 'mini'">
                <v-col cols="6">
                    <v-list class="v-col-12">
                        <v-list-item title="成交"
                            :subtitle="trimEnd(symbol?.z, '0')"></v-list-item>
                        <v-list-item title="開盤"
                            :subtitle="trimEnd(symbol?.o, '0')"></v-list-item>
                        <v-list-item title="最高"
                            :subtitle="trimEnd(symbol?.h, '0')"></v-list-item>
                        <v-list-item title="最低"
                            :subtitle="trimEnd(symbol?.l, '0')"></v-list-item>
                    </v-list>
                </v-col>
                <v-col cols="6">
                    <v-list class="v-col-12">
                        <v-list-item title="昨收"
                            :subtitle="trimEnd(symbol?.y, '0')"></v-list-item>
                        <v-list-item title="漲跌"
                            :subtitle="(isNumeric(symbol.z) ? `${diff(symbol?.z, symbol?.y)}` : symbol.z)"></v-list-item>
                        <v-list-item title="漲跌幅(%)"
                            :subtitle="(isNumeric(symbol.z) ? `${diffp(symbol?.z, symbol?.y)}%` : symbol.z)"></v-list-item>
                        <v-list-item title="總量"
                            :subtitle="trimEnd(formatAsCurrency(parseFloat(symbol?.v), 2), '0')"></v-list-item>
                    </v-list>
                </v-col>
            </v-row>
            <v-row v-if="cardStyle != 'mini'">
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
                                <v-list-item
                                    v-for="(item, i) in trimEnd(symbol?.g ?? '', '_').split('_').filter(x => x != '').slice(0, 5)"
                                    :key="i">
                                    <v-list-item-title v-text="formatAsCurrency(parseInt(item), 0)">
                                    </v-list-item-title>
                                    <v-list-item-action>
                                        <v-progress-linear :model-value="parseInt(item)"
                                            :max="trimEnd(symbol?.g ?? '', '_').split('_').filter(x => x != '').slice(0, 5).map(x => parseInt(x)).sort((a, b) => b - a)[0]"
                                            reverse>
                                        </v-progress-linear>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-list>
                        </v-col>
                        <v-col>
                            <v-list>
                                <v-list-item
                                    v-for="(item, i) in trimEnd(symbol?.b ?? '', '_').split('_').filter(x => x != '').slice(0, 5)"
                                    :key="i">
                                    <v-list-item-title
                                        :style="{ color: symbol?.y == item ? null : (parseFloat(item) > parseFloat(symbol?.y) ? 'red' : 'green') }"
                                        v-text="trimEnd(item, '0')"></v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-col>
                    </v-row>
                    <hr style="margin-left: 8px;margin-right: 8px;">
                    <v-row>
                        <v-col>
                            <v-list-item
                                :title="symbol?.g ? formatAsCurrency(trimEnd(symbol?.g ?? '', '_').split('_').filter(x => x != '').slice(0, 5).map(x => parseInt(x)).reduce((a, b) => a + b), 0) : 0">
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
                                <v-list-item
                                    v-for="(item, i) in trimEnd(symbol?.a ?? '', '_').split('_').filter(x => x != '').slice(0, 5)"
                                    :key="i">
                                    <v-list-item-title
                                        :style="{ color: symbol?.y == item ? null : (parseFloat(item) > parseFloat(symbol?.y) ? 'red' : 'green') }"
                                        v-text="trimEnd(item, '0')"></v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-col>
                        <v-col>
                            <v-list>
                                <v-list-item
                                    v-for="(item, i) in trimEnd(symbol?.f ?? '', '_').split('_').filter(x => x != '').slice(0, 5)"
                                    :key="i">
                                    <v-list-item-title v-text="formatAsCurrency(parseInt(item), 0)">
                                    </v-list-item-title>
                                    <v-list-item-action>
                                        <v-progress-linear :model-value="parseInt(item)"
                                            :max="trimEnd(symbol?.f ?? '', '_').split('_').filter(x => x != '').slice(0, 5).map(x => parseInt(x)).sort((a, b) => b - a)[0]">
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
                                :title="symbol?.f ? formatAsCurrency(trimEnd(symbol?.f ?? '', '_').split('_').filter(x => x != '').slice(0, 5).map(x => parseInt(x)).reduce((a, b) => a + b), 0) : 0">
                            </v-list-item>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card>
    </client-only>
</template>

<script setup lang="ts">
import { trimEnd, formatAsCurrency, diff, diffp, isNumeric } from '~/lib/string'
</script>

<script lang="ts">
import { MsgArray } from '~/models/stock/twse'

export default {
    props: {
        symbol: {
            type: Object as PropType<MsgArray>,
            required: true
        },
        isOdd: {
            type: Boolean,
            required: true
        },
        cardStyle: 'default' | 'nochart' | 'mini',
        targetOdd: Function,
    },
    methods: {
        target_Odd(code: string) {
            this.$emit('targetOdd', code)
        }
    },
};
</script>