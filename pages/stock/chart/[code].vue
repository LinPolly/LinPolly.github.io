<template>
    <HighchartsStockhischart :symbol="symbol"></HighchartsStockhischart>
</template>

<script lang="ts">
import { MsgArray } from '~/models/stock/twse'

export default {
    computed: {
        symbol() {
            var symbol = {} as MsgArray
            symbol.c = this.$route.params.code as string
            return symbol
        },
    },
}
</script>