<script setup lang="ts">
import * as 上市 from '~~/lib/上市'
import * as 上櫃 from '~~/lib/上櫃'
import * as ETF from '~~/lib/ETF'
</script>

<template>
    <v-text-field label="股票代碼"
        v-model="inputfollow">
        <template v-slot:append-inner>
            <v-icon v-if="followstock"
                icon="mdi-plus"
                @click="selectedstock"></v-icon>
            <nuxt-link v-else
                :to="(inputfollow.length > 0 && (上市.has(inputfollow) || 上櫃.has(inputfollow) || ETF.has(inputfollow))) ? `/stock/${inputfollow}` : null">
                <v-icon icon="mdi-plus"></v-icon>
            </nuxt-link>
        </template>
    </v-text-field>
    <v-card v-if="inputfollow.length > 0">
        <v-card-title v-if="has上市">
            上市股
        </v-card-title>
        <v-row v-if="has上市">
            <v-col v-for="(s, i) in filter_上市"
                :key="i">
                <v-btn @click="inputfollow = s.公司代號.toString()">
                    <v-card-title>
                        {{ s.公司簡稱 }} {{ s.公司代號 }}
                    </v-card-title>
                </v-btn>
            </v-col>
        </v-row>
        <div style="height: 8px;"
            v-if="has上市"></div>
        <hr v-if="has上市">
        <v-card-title v-if="has上櫃">
            上櫃
        </v-card-title>
        <v-row v-if="has上櫃">
            <v-col v-for="(s, i) in filter_上櫃"
                :key="i">
                <v-btn @click="inputfollow = s.公司代號.toString()">
                    <v-card-title>
                        {{ s.公司簡稱 }} {{ s.公司代號 }}
                    </v-card-title>
                </v-btn>
            </v-col>
        </v-row>
        <div style="height: 8px;"
            v-if="has上櫃"></div>
        <hr v-if="has上櫃">
        <v-card-title v-if="hasETF">
            ETF
        </v-card-title>
        <v-row v-if="hasETF">
            <v-col v-for="(s, i) in filter_ETF"
                :key="i">
                <v-btn @click="inputfollow = s.證券代號">
                    <v-card-title>
                        {{ s.證券簡稱 }} {{ s.證券代號 }}
                    </v-card-title>
                </v-btn>
            </v-col>
        </v-row>
    </v-card>
</template>

<script lang="ts">
export default {
    data() {
        return {
            inputfollow: '',
        }
    },
    props: {
        followstock: Function,
    },
    methods: {
        selectedstock: function () {
            if (上市.has(this.inputfollow)
                || 上櫃.has(this.inputfollow)
                || ETF.has(this.inputfollow)) {
                this.$emit('followstock', this.inputfollow)
                this.inputfollow = ''
            }
        }
    },
    computed: {
        has上市: function () {
            return 上市.list.some(x => x.公司代號.toString().indexOf(this.inputfollow) > -1 || x.公司簡稱.toString().indexOf(this.inputfollow) > -1 || x.公司名稱.toString().indexOf(this.inputfollow) > -1)
        },
        filter_上市: function () {
            return 上市.list.filter(x => x.公司代號.toString().indexOf(this.inputfollow) > -1 || x.公司簡稱.toString().indexOf(this.inputfollow) > -1 || x.公司名稱.toString().indexOf(this.inputfollow) > -1)
        },
        has上櫃: function () {
            return 上櫃.list.some(x => x.公司代號.toString().indexOf(this.inputfollow) > -1 || x.公司簡稱.toString().indexOf(this.inputfollow) > -1)
        },
        filter_上櫃: function () {
            return 上櫃.list.filter(x => x.公司代號.toString().indexOf(this.inputfollow) > -1 || x.公司簡稱.toString().indexOf(this.inputfollow) > -1)
        },
        hasETF: function () {
            return ETF.list.some(x => x.證券代號.toString().indexOf(this.inputfollow) > -1 || x.證券簡稱.toString().indexOf(this.inputfollow) > -1)
        },
        filter_ETF: function () {
            return ETF.list.filter(x => x.證券代號.toString().indexOf(this.inputfollow) > -1 || x.證券簡稱.toString().indexOf(this.inputfollow) > -1)
        },
    }
}
</script>