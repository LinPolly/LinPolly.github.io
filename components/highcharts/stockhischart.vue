<template>
    <client-only>
        <div style="width: 100%;margin-left: 32px;margin-top: 8px;padding-right: 40px;">
            <v-row>
                <v-select v-model="dataMode"
                    :items="['1分線', '2分線', '5分線', '15分線', '30分線', '60分線', '90分線', '時線', '日線', '5日線', '周線', '月線', '3月線']"></v-select>
                <div style="width: 8px;"></div>
                <v-select v-model="showMode"
                    :items="['成交量', 'KD,J']"></v-select>
            </v-row>
            <v-row>
                <v-col>
                    <v-checkbox label="MA5"
                        color="blue"
                        v-model="chartOptions.series[chartOptions.series.findIndex(x => x.name == 'MA5')].visible"
                        hide-details></v-checkbox>
                </v-col>
                <v-col>
                    <v-checkbox label="MA10"
                        color="red"
                        v-model="chartOptions.series[chartOptions.series.findIndex(x => x.name == 'MA10')].visible"
                        hide-details></v-checkbox>
                </v-col>
                <v-col>
                    <v-checkbox label="MA20"
                        color="orange"
                        v-model="chartOptions.series[chartOptions.series.findIndex(x => x.name == 'MA20')].visible"
                        hide-details></v-checkbox>
                </v-col>
                <v-col>
                    <v-checkbox label="MA60"
                        color="green"
                        v-model="chartOptions.series[chartOptions.series.findIndex(x => x.name == 'MA60')].visible"
                        hide-details></v-checkbox>
                </v-col>
                <v-col>
                    <v-checkbox label="MA120"
                        color="purple"
                        v-model="chartOptions.series[chartOptions.series.findIndex(x => x.name == 'MA120')].visible"
                        hide-details></v-checkbox>
                </v-col>
                <v-col>
                    <v-checkbox label="MA240"
                        color="brown"
                        v-model="chartOptions.series[chartOptions.series.findIndex(x => x.name == 'MA240')].visible"
                        hide-details></v-checkbox>
                </v-col>
            </v-row>
            <v-row>
                <highcharts :constructor-type="'stockChart'"
                    :options="chartOptions"
                    style="height: 750px;width: 100%;" />
            </v-row>
        </div>
    </client-only>
</template>

<script lang="ts">
import { MsgArray } from '~/models/stock/twse'
import { trimEnd, formatAsCurrency, diff, diffp, isNumeric } from '~/lib/string'
import 'highcharts/css/stocktools/gui.css'
import 'highcharts/css/annotations/popup.css'

// @ts-ignore
import Highcharts from 'highcharts'
import { Chart } from 'highcharts-vue'

import indicators from "highcharts/indicators/indicators"
import slowstochastic from "highcharts/indicators/slow-stochastic"
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
slowstochastic(Highcharts)
dragpanes(Highcharts)

annotationsadvanced(Highcharts)
priceindicator(Highcharts)
fullscreen(Highcharts)

StockToolsModule(Highcharts)

// heikinashi(Highcharts)
// hollowcandlestick(Highcharts)
AccessibilityModule(Highcharts)
StockModule(Highcharts)
exporting(Highcharts)

Highcharts.seriesTypes.column.prototype.pointAttribs = (function (func) {
    return function (point, state) {
        var attribs = func.apply(this, arguments);

        var candleSeries = this.chart.series[0]; // Probably you'll need to change the index
        var candlePoint = candleSeries.points.filter(function (p) {
            return p.index === point.index;
        })[0];

        var color = candlePoint.open < candlePoint.close ? "rgb(223, 63, 63)" : "rgb(51, 139, 72)"; // Replace with your colors
        attribs.fill = color;

        return attribs;
    };
})(Highcharts.seriesTypes.column.prototype.pointAttribs);

export default {
    data: () => ({
        dataMode: '日線',
        showMode: '成交量',
        chartOptions: {
            chart: {
                events: {
                    load() {
                        const chart = this,
                            startDate = Date.UTC(2020, 2, 26),
                            endDate = Date.UTC(2020, 8, 26)
                        // @ts-ignore
                        chart.xAxis[0].setExtremes(startDate, endDate)
                    }
                },
                marginRight: 50,
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
                    showInLegend: false
                }
            },
            xAxis: { // 
                labels: {
                    format: "",
                    formatter: null as unknown as Function,
                },
                crosshair: true,
            },
            yAxis: [
                {
                    labels: {
                        align: 'right',
                        x: 30
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
                        x: 30
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
                formatter: null as unknown as Function,
                // @ts-ignore
                positioner: function (width, height, point) {
                    // @ts-ignore
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
            exporting: {
                enabled: true
            },
            series: [
                {
                    type: 'candlestick',
                    id: 'main-series',
                    name: 'K線',
                    data: [] as number[][],
                    yAxis: 0,
                    upColor: 'rgb(223, 63, 63)',
                    upLineColor: 'rgb(223, 63, 63)',
                    color: 'rgb(51, 139, 72)',
                    lineColor: 'rgb(51, 139, 72)',
                },
                {
                    yAxis: 1,
                    name: 'K',
                    linkedTo: 'main-series',
                    data: [] as number[][],
                    color: "#1947A3",
                    visible: true
                },
                {
                    yAxis: 1,
                    name: 'D',
                    linkedTo: 'main-series',
                    data: [] as number[][],
                    color: "#F56F0A",
                    visible: true,
                },
                {
                    yAxis: 1,
                    name: 'J',
                    linkedTo: 'main-series',
                    data: [] as number[][],
                    color: "green",
                    visible: true,
                    dashStyle: 'Dash',
                },
                {
                    yAxis: 1,
                    name: 'RSV',
                    linkedTo: 'main-series',
                    data: [] as number[][],
                    color: "green",
                    visible: true,
                },
                {
                    type: 'column',
                    name: '成交量',
                    data: [] as number[][],
                    yAxis: 1,
                },
                {
                    name: 'MA5',
                    data: [] as number[][],
                    marker: {
                        enabled: false
                    },
                    color: 'blue',
                    yAxis: 0,
                    visible: true,
                },
                {
                    name: 'MA10',
                    data: [] as number[][],
                    marker: {
                        enabled: false
                    },
                    color: 'red',
                    yAxis: 0,
                    visible: true,
                },
                {
                    name: 'MA20',
                    data: [] as number[][],
                    marker: {
                        enabled: false
                    },
                    color: 'orange',
                    yAxis: 0,
                    visible: true,
                },
                {
                    name: 'MA60',
                    data: [] as number[][],
                    marker: {
                        enabled: false
                    },
                    color: 'green',
                    yAxis: 0,
                    visible: false,
                },
                {
                    name: 'MA120',
                    data: [] as number[][],
                    marker: {
                        enabled: false
                    },
                    color: 'purple',
                    yAxis: 0,
                    visible: false,
                },
                {
                    name: 'MA240',
                    data: [] as number[][],
                    marker: {
                        enabled: false
                    },
                    color: 'brown',
                    yAxis: 0,
                    visible: false,
                }
            ],
        },
        loaded: false,
        chartRawData: null as any,
    }),
    props: {
        symbol: {
            type: Object as PropType<MsgArray>,
            required: true
        }
    },
    methods: {
        async init() {
            var interval = '1d'
            switch (this.dataMode) {
                //1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo
                case '1分線':
                    interval = '1m'
                    break;
                case '2分線':
                    interval = '2m'
                    break;
                case '5分線':
                    interval = '5m'
                    break;
                case '15分線':
                    interval = '15m'
                    break;
                case '30分線':
                    interval = '30m'
                    break;
                case '60分線':
                    interval = '60m'
                    break;
                case '90分線':
                    interval = '90m'
                    break;
                case '時線':
                    interval = '1h'
                    break;
                case '日線':
                    interval = '1d'
                    break;
                case '5日線':
                    interval = '5d'
                    break;
                case '周線':
                    interval = '1wk'
                    break;
                case '月線':
                    interval = '1mo'
                    break;
                case '3月線':
                    interval = '3mo'
                    break;
            }

            const { data } = await useFetch(`/api/charthis?code=${this.symbol.c}&interval=${interval}`)
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
                    this.chartOptions.series[me.chartOptions.series.findIndex(x => x.name == 'MA10')].data = this.calculateSMA(data, 10)
                    this.chartOptions.series[me.chartOptions.series.findIndex(x => x.name == 'MA20')].data = this.calculateSMA(data, 20)
                    this.chartOptions.series[me.chartOptions.series.findIndex(x => x.name == 'MA60')].data = this.calculateSMA(data, 60)
                    this.chartOptions.series[me.chartOptions.series.findIndex(x => x.name == 'MA120')].data = this.calculateSMA(data, 120)
                    this.chartOptions.series[me.chartOptions.series.findIndex(x => x.name == 'MA240')].data = this.calculateSMA(data, 240)

                    var kdj = this.calculateKD(data)

                    this.chartOptions.series[me.chartOptions.series.findIndex(x => x.name == 'K')].data = kdj.time.map((x, i) => [x, kdj.k[i]])
                    this.chartOptions.series[me.chartOptions.series.findIndex(x => x.name == 'D')].data = kdj.time.map((x, i) => [x, kdj.d[i]])
                    this.chartOptions.series[me.chartOptions.series.findIndex(x => x.name == 'J')].data = kdj.time.map((x, i) => [x, kdj.j[i]])
                    this.chartOptions.series[me.chartOptions.series.findIndex(x => x.name == 'RSV')].data = kdj.time.map((x, i) => [x, kdj.rsv[i]])
                }
            }

            this.chartOptions.xAxis.labels.formatter = function () {
                // @ts-ignore
                return me.timestampToTime(this.value / 1000)
            }

            this.chartOptions.tooltip.formatter = function () {
                // @ts-ignore
                var dateStr = me.timestampToTime(this.point.x / 1000)

                // @ts-ignore
                const volume = this.points[this.points.findIndex(x => x.series.name == '成交量')]?.y ?? ''

                // @ts-ignore
                const ma5 = this.points[this.points.findIndex(x => x.series.name == 'MA5')]?.y ?? ''
                // @ts-ignore
                const ma10 = this.points[this.points.findIndex(x => x.series.name == 'MA10')]?.y ?? ''
                // @ts-ignore
                const ma20 = this.points[this.points.findIndex(x => x.series.name == 'MA20')]?.y ?? ''
                // @ts-ignore
                const ma60 = this.points[this.points.findIndex(x => x.series.name == 'MA60')]?.y ?? ''
                // @ts-ignore
                const ma120 = this.points[this.points.findIndex(x => x.series.name == 'MA120')]?.y ?? ''
                // @ts-ignore
                const ma240 = this.points[this.points.findIndex(x => x.series.name == 'MA240')]?.y ?? ''

                // @ts-ignore
                const k = this.points[this.points.findIndex(x => x.series.name == 'K')]?.y ?? ''
                // @ts-ignore
                const d = this.points[this.points.findIndex(x => x.series.name == 'D')]?.y ?? ''
                // @ts-ignore
                const j = this.points[this.points.findIndex(x => x.series.name == 'J')]?.y ?? ''

                // @ts-ignore
                if (this.point?.open == null || this.point?.high == null || this.point?.low == null || this.point?.close == null) {
                    return ''
                }

                // @ts-ignore
                var str = `${dateStr} 開${parseFloat(this.point.open.toString()).toFixed(2)} 高${parseFloat(this.point.high.toString()).toFixed(2)} 低${parseFloat(this.point.low.toString()).toFixed(2)} 收${parseFloat(this.point.close.toString()).toFixed(2)}`

                if (volume) {
                    str += ` 量${trimEnd(formatAsCurrency(parseInt(volume.toString()), 2), '0')}張`
                }

                if (ma5 || ma20 || ma60) {
                    str += '<br>'

                    if (ma5) {
                        str += `MA5 ${parseFloat(ma5.toString()).toFixed(2)}`
                    }
                    if (ma10) {
                        if (ma5) str += ' '
                        str += `MA10 ${parseFloat(ma10.toString()).toFixed(2)}`
                    }
                    if (ma20) {
                        if (ma10) str += ' '
                        str += `MA20 ${parseFloat(ma20.toString()).toFixed(2)}`
                    }
                    if (ma60) {
                        if (ma20) str += ' '
                        str += `MA60 ${parseFloat(ma60.toString()).toFixed(2)}`
                    }
                    if (ma120) {
                        if (ma60) str += ' '
                        str += `MA120 ${parseFloat(ma120.toString()).toFixed(2)}`
                    }
                    if (ma240) {
                        if (ma120) str += ' '
                        str += `MA240 ${parseFloat(ma240.toString()).toFixed(2)}`
                    }
                }

                if (k || d || j) {
                    str += '<br>'

                    if (k) {
                        str += `K ${parseFloat(k.toString()).toFixed(2)}`
                    }
                    if (d) {
                        if (k) str += ' '
                        str += `D ${parseFloat(d.toString()).toFixed(2)}`
                    }
                    if (j) {
                        if (d) str += ' '
                        str += `J ${parseFloat(j.toString()).toFixed(2)}`
                    }
                }

                return str
            }

            this.loaded = true
        },
        timestampToTime(timestamp: number) {
            var date = new Date(timestamp * 1000);
            var Y = date.getFullYear();
            var M = date.getMonth() + 1;
            var D = date.getDate();
            var H = date.getHours()
            var m = date.getMinutes()

            switch (this.dataMode) {
                //1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo
                case '1分線':
                    return `${Y}/${M}/${D} ${H}:${m}`;
                    break;
                case '2分線':
                    return `${Y}/${M}/${D} ${H}:${m}`;
                    break;
                case '5分線':
                    return `${Y}/${M}/${D} ${H}:${m}`;
                    break;
                case '15分線':
                    return `${Y}/${M}/${D} ${H}:${m}`;
                    break;
                case '30分線':
                    return `${Y}/${M}/${D} ${H}:${m}`;
                    break;
                case '60分線':
                    return `${Y}/${M}/${D} ${H}`;
                    break;
                case '90分線':
                    return `${Y}/${M}/${D} ${H}`;
                    break;
                case '時線':
                    return `${Y}/${M}/${D} ${H}`;
                    break;
                case '日線':
                    return `${Y}/${M}/${D}`;
                    break;
                case '5日線':
                    return `${Y}/${M}/${D}`;
                    break;
                case '周線':
                    return `${Y}/${M}/${D}`;
                    break;
                case '月線':
                    return `${Y}/${M}/${D}`;
                    break;
                case '3月線':
                    return `${Y}/${M}/${D}`;
                    break;
            }
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
        calculateKD: function (data: number[][], period = 9): { time: number[], k: number[], d: number[], j: number[], k3d2: number[], rsv: number[] } {
            var time, o, rsv, highest, lowest, j9, k3d2
            var timeValues: number[] = []
            var kValues: number[] = []
            var dValues: number[] = []
            var jValues: number[] = []
            var k3d2Values: number[] = []
            var rsvValues: number[] = []

            var k9 = .5
            var d9 = .5

            for (let i = 0; i < data.length; i++) {
                time = data[i][0]

                if (i > period) {
                    highest = data[i][2]
                    lowest = data[i][3]
                    var close = data[i][4]
                    for (o = 1; o < period; o++) {
                        highest = Math.max(highest, data[i - o][2])
                        lowest = Math.min(lowest, data[i - o][3])
                    }

                    rsv = (close - lowest) / (highest - lowest) || 0
                    k9 = (2 * k9 / 3) + (rsv / 3)
                    d9 = (2 * d9 / 3) + (k9 / 3)
                    j9 = (3 * d9) - (2 * k9)
                    k3d2 = (3 * k9) - (2 * d9)

                    kValues.push(100 * k9)
                    dValues.push(100 * d9)
                    jValues.push(100 * j9)
                    k3d2Values.push(100 * k3d2)
                    rsvValues.push(100 * rsv)
                    timeValues.push(time)
                }
            }

            return {
                time: timeValues,
                k: kValues,
                d: dValues,
                j: jValues,
                k3d2: k3d2Values,
                rsv: rsvValues,
            }
        }
    },
    mounted() {
        this.init()
    },
    watch: {
        'showMode': function (newValue) {
            var y2 = this.chartOptions.series.filter(x => x.yAxis == 1)
            y2.forEach(x => x.visible = false)

            switch (newValue) {
                case '成交量':
                    // @ts-ignore
                    y2.find(x => x.name == '成交量').visible = true
                    return;
                case 'KD,J':
                    // @ts-ignore
                    y2.find(x => x.name == 'K').visible = true
                    // @ts-ignore
                    y2.find(x => x.name == 'D').visible = true
                    // @ts-ignore
                    y2.find(x => x.name == 'J').visible = true
                    return;
            }
        },
        'dataMode': function () {
            this.init()
        },
    },
    components: {
        highcharts: Chart
    }
}
</script>