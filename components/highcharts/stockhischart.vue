<template>
    <client-only>
        <v-btn-toggle v-model="showMode">
            <v-btn :class="{ 'bg-primary': showMode == 0 }">成交量</v-btn>
            <v-btn :class="{ 'bg-primary': showMode == 1 }">KD,J</v-btn>
        </v-btn-toggle>
        <hr>
        <highcharts :constructor-type="'stockChart'"
            :options="chartOptions"
            style="height: 750px;width: 100%;" />
    </client-only>
</template>

<script lang="ts">
import {
    sma
} from 'moving-averages'

import {
    sub,
    div,
    mul
} from 'math-array'

import {
    hhv,
    llv
} from 'hhv-llv'
import { MsgArray } from '~/models/stock/twse'
import { trimEnd, formatAsCurrency, diff, diffp, isNumeric } from '~/lib/string'
import 'highcharts/css/stocktools/gui.css'
import 'highcharts/css/annotations/popup.css'

import Highcharts from 'highcharts'
import { Chart } from 'highcharts-vue'

import indicators from "highcharts/indicators/indicators"
import kdj_indicators from "~/indicators/kdj-indicator"
import stochastic from "highcharts/indicators/stochastic"
import dragpanes from 'highcharts/modules/drag-panes'

import annotationsadvanced from 'highcharts/modules/annotations-advanced'
import priceindicator from 'highcharts/modules/price-indicator'
import fullscreen from 'highcharts/modules/full-screen'

import StockModule from "highcharts/modules/stock"

import AccessibilityModule from "highcharts/modules/accessibility"
import StockToolsModule from "highcharts/modules/stock-tools"
import exporting from 'highcharts/modules/exporting'

Highcharts.setOptions({
    lang: {
        loading: '載入中...',
        months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        shortMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        exportButtonTitle: '匯出',
        printButtonTitle: '列印',
        rangeSelectorFrom: '從',
        rangeSelectorTo: '到',
        rangeSelectorZoom: "縮放",
        downloadPNG: '下載 PNG',
        downloadJPEG: '下載 JPEG',
        downloadPDF: '下載 PDF',
        downloadSVG: '下載 SVG'
    }
});

indicators(Highcharts)
stochastic(Highcharts)
dragpanes(Highcharts)
kdj_indicators(Highcharts)

annotationsadvanced(Highcharts)
priceindicator(Highcharts)
fullscreen(Highcharts)

StockToolsModule(Highcharts)

// heikinashi(Highcharts)
// hollowcandlestick(Highcharts)
AccessibilityModule(Highcharts)
StockModule(Highcharts)
exporting(Highcharts)

export default {
    data: () => ({
        showMode: 0,
        chartOptions: {
            chart: {
                events: {
                    load() {
                        const chart = this,
                            startDate = Date.UTC(2020, 2, 26),
                            endDate = Date.UTC(2020, 8, 26)

                        chart.xAxis[0].setExtremes(startDate, endDate)
                    }
                }
            },
            rangeSelector: {
                inputEnabled: false
            },
            stockTools: {
                gui: {
                    enabled: true
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    showInLegend: true
                }
            },
            xAxis: { // 
                labels: {
                    format: "",
                }
            },
            yAxis: [
                {
                    labels: {
                        align: 'right',
                        x: -3
                    },
                    height: '75%',
                    lineWidth: 2,
                    resize: {
                        enabled: true
                    }
                },
                {
                    labels: {
                        align: 'right',
                        x: -3
                    },
                    top: '77%',
                    height: '23%',
                    lineWidth: 2
                },
            ],
            tooltip: {
                shape: 'square',
                headerShape: 'callout',
                borderWidth: 0,
                shadow: false,
                positioner: function (width, height, point) {
                    const chart = this.chart;
                    let position;

                    if (point.isHeader) {
                        position = {
                            x: Math.max(
                                // Left side limit
                                chart.plotLeft,
                                Math.min(
                                    point.plotX + chart.plotLeft - width / 2,
                                    // Right side limit
                                    chart.chartWidth - width - chart.marginRight
                                )
                            ),
                            y: point.plotY
                        };
                    } else {
                        position = {
                            x: point.series.chart.plotLeft,
                            y: point.series.yAxis.top - chart.plotTop
                        };
                    }

                    return position;
                },
            },
            // exporting: {
            //     enabled: true
            // },
            series: [
                {
                    type: 'candlestick',
                    id: 'main-series',
                    name: 'K線',
                    data: [],
                    yAxis: 0,
                    upColor: 'rgb(223, 63, 63)',
                    upLineColor: 'rgb(223, 63, 63)',
                    color: 'rgb(51, 139, 72)',
                    lineColor: 'rgb(51, 139, 72)',
                },
                {
                    yAxis: 1,
                    name: 'KD',
                    type: 'stochastic',
                    linkedTo: 'main-series',
                    color: "#F56F0A",
                    lineColor: "#1947A3",
                    visible: false
                },
                {
                    yAxis: 1,
                    name: 'J',
                    type: 'stochastic-j',
                    linkedTo: 'main-series',
                    color: "green",
                    visible: false,
                    dashStyle: 'Dash',
                },
                {
                    type: 'column',
                    name: '成交量',
                    data: [],
                    yAxis: 1,
                },
                {
                    name: 'MA5',
                    data: [],
                    marker: {
                        enabled: false
                    },
                    color: 'rgb(25, 71, 163)',
                    yAxis: 0,
                },
                {
                    name: 'MA20',
                    data: [],
                    marker: {
                        enabled: false
                    },
                    color: 'rgb(245, 111, 10)',
                    yAxis: 0,
                },
                {
                    name: 'MA60',
                    data: [],
                    marker: {
                        enabled: false
                    },
                    color: 'rgb(62, 145, 82)',
                    yAxis: 0,
                }
            ],
        },
        loaded: false,
        chartRawData: null,
    }),
    props: {
        symbol: {
            type: Object as PropType<MsgArray>,
            required: true
        }
    },
    methods: {
        async init() {
            const { data } = await useFetch(`/api/charthis?code=${this.symbol.c}`)
            const me = this

            this.chartRawData = data.value
            if (this.chartRawData) {
                var timeOffset = new Date().getTimezoneOffset() * 60 * 1000

                {
                    // Replace with your own data
                    const data = []
                    const volumeData = []
                    for (let i = 1; i < this.chartRawData.timestamp.length; i++) {
                        var r = []
                        var v = []

                        r.push(this.chartRawData.timestamp[i] * 1000)
                        r.push(parseFloat(this.chartRawData.indicators.quote[0].open[i]?.toFixed(2)))
                        r.push(parseFloat(this.chartRawData.indicators.quote[0].high[i]?.toFixed(2)))
                        r.push(parseFloat(this.chartRawData.indicators.quote[0].low[i]?.toFixed(2)))
                        r.push(parseFloat(this.chartRawData.indicators.quote[0].close[i]?.toFixed(2)))

                        v.push(this.chartRawData.timestamp[i] * 1000)
                        v.push(this.chartRawData.indicators.quote[0].volume[i] / 1000)

                        data.push(r)
                        volumeData.push(v)
                    }

                    this.chartOptions.series[me.chartOptions.series.findIndex(x => x.name == 'K線')].data = data
                    this.chartOptions.series[me.chartOptions.series.findIndex(x => x.name == '成交量')].data = volumeData
                    this.chartOptions.series[me.chartOptions.series.findIndex(x => x.name == 'MA5')].data = this.calculateSMA(data, 5)
                    this.chartOptions.series[me.chartOptions.series.findIndex(x => x.name == 'MA20')].data = this.calculateSMA(data, 20)
                    this.chartOptions.series[me.chartOptions.series.findIndex(x => x.name == 'MA60')].data = this.calculateSMA(data, 60)

                    // var kdj = this.calculateKDJ(data)                    
                    // this.chartOptions.series[me.chartOptions.series.findIndex(x => x.name == 'K')].data = kdj.time.map((x, i) => [x, kdj.k[i]])
                    // this.chartOptions.series[me.chartOptions.series.findIndex(x => x.name == 'D')].data = kdj.time.map((x, i) => [x, kdj.d[i]])
                    // this.chartOptions.series[me.chartOptions.series.findIndex(x => x.name == 'J')].data = kdj.time.map((x, i) => [x, kdj.j[i]])

                    // lineSeries.setData(data)
                }
            }

            this.chartOptions.xAxis.labels.formatter = function () {
                return me.timestampToTime(this.value / 1000)
            }
            this.chartOptions.tooltip.formatter = function () {
                var dateStr = me.timestampToTime(this.point.x / 1000)

                const volume = this.points[this.points.findIndex(x => x.series.name == '成交量')]?.y ?? ''

                const ma5 = this.points[this.points.findIndex(x => x.series.name == 'MA5')]?.y ?? ''
                const ma20 = this.points[this.points.findIndex(x => x.series.name == 'MA20')]?.y ?? ''
                const ma60 = this.points[this.points.findIndex(x => x.series.name == 'MA60')]?.y ?? ''

                // const k = this.points[this.points.findIndex(x => x.series.name == 'K')]?.y ?? ''
                // const d = this.points[this.points.findIndex(x => x.series.name == 'D')]?.y ?? ''
                // const j = this.points[this.points.findIndex(x => x.series.name == 'J')]?.y ?? ''

                if (this.point?.open == null
                    || this.point?.high == null
                    || this.point?.low == null
                    || this.point?.close == null) {
                    return ''
                }

                var str = `${dateStr} 開${parseFloat(this.point.open.toString()).toFixed(2)} 高${parseFloat(this.point.high.toString()).toFixed(2)} 低${parseFloat(this.point.low.toString()).toFixed(2)} 收${parseFloat(this.point.close.toString()).toFixed(2)}`

                if (volume) {
                    str += ` 量${trimEnd(formatAsCurrency(parseInt(volume.toString()), 2), '0')}張`
                }

                if (ma5 || ma20 || ma60) {
                    str += '<br>'

                    if (ma5) {
                        str += `MA5 ${parseFloat(ma5.toString()).toFixed(2)}`
                    }
                    if (ma20) {
                        if (ma5) str += ' '
                        str += `MA20 ${parseFloat(ma20.toString()).toFixed(2)}`
                    }
                    if (ma60) {
                        if (ma20) str += ' '
                        str += `MA60 ${parseFloat(ma60.toString()).toFixed(2)}`
                    }
                }

                // if (k || d || j) {
                //     str += '<br>'

                //     if (k) {
                //         str += `K ${parseFloat(k.toString()).toFixed(2)}`
                //     }
                //     if (d) {
                //         if (k) str += ' '
                //         str += `J ${parseFloat(d.toString()).toFixed(2)}`
                //     }
                //     if (j) {
                //         if (d) str += ' '
                //         str += `J ${parseFloat(j.toString()).toFixed(2)}`
                //     }
                // }

                return str
            }

            this.loaded = true
        },
        timestampToTime(timestamp: number) {
            var date = new Date(timestamp * 1000);
            var Y = date.getFullYear();
            var M = date.getMonth() + 1;
            var D = date.getDate();
            return `${Y}/${M}/${D}`;
        },
        sequenceGenerator(minVal: number, maxVal: number, step = 1) {
            let currVal = minVal;

            var list = []
            list.push(minVal)

            while (currVal < maxVal)
                list.push(currVal += step)

            list.push(maxVal)
            return list
        },
        calculateSMA(data: Array<Array<number>>, count: number): Array<Array<number>> {
            var avg = function (data: Array<Array<number>>) {
                var sum = 0;
                for (var i = 0; i < data.length; i++) {
                    sum += data[i][4];
                }
                return sum / data.length;
            };
            var result = [];
            for (var i = count - 1, len = data.length; i < len; i++) {
                var val = avg(data.slice(i - count + 1, i));
                result.push([data[i][0], val]);
            }
            return result;
        },
        calculateKDJ(data: number[][], period = 14): { time: number[], k: number[], d: number[], j: number[] } {
            const high: number[] = [];
            const low: number[] = [];
            const close: number[] = [];
            const timestamps: number[] = [];

            for (let i = 0; i < data.length; i++) {
                const [timestamp, _, highPrice, lowPrice, closePrice] = data[i];
                timestamps.push(timestamp);
                high.push(highPrice);
                low.push(lowPrice);
                close.push(closePrice);
            }

            const kValues: number[] = [];
            const dValues: number[] = [];
            const jValues: number[] = [];

            let k = 50; // 初始 K 值
            let d = 50; // 初始 D 值

            for (let i = period; i < high.length; i++) {
                const highestHigh = Math.max(...high.slice(i - period, i));
                const lowestLow = Math.min(...low.slice(i - period, i));
                const r = highestHigh - lowestLow;

                const rsv = (close[i] - lowestLow) / r * 100;

                k = (2 / 3) * k + (1 / 3) * rsv;
                d = (2 / 3) * d + (1 / 3) * k;

                const j = 3 * k - 2 * d;

                kValues.push(k);
                dValues.push(d);
                jValues.push(j);
            }

            return {
                k: kValues,
                d: dValues,
                j: jValues,
                time: timestamps.slice(period),
            };
        }
    },
    mounted() {
        this.init()
    },
    // beforeMount() {
    //     this.init()
    // },
    watch: {
        'showMode': function (newValue) {
            var y2 = this.chartOptions.series.filter(x => x.yAxis == 1)
            y2.forEach(x => x.visible = false)

            switch (newValue) {
                case 0:
                    y2.find(x => x.name == '成交量').visible = true
                    return;
                case 1:
                    y2.find(x => x.name == 'KD').visible = true
                    // y2.find(x => x.name == 'D').visible = true
                    y2.find(x => x.name == 'J').visible = true
                    return;
            }
        }
    },
    components: {
        highcharts: Chart
    }
}
</script>