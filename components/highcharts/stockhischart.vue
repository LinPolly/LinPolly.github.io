<template>
    <client-only>
        <v-btn-toggle v-model="showMode">
            <v-btn :class="{ 'bg-primary': showMode == 0 }">成交量</v-btn>
            <v-btn :class="{ 'bg-primary': showMode == 1 }">KD</v-btn>
        </v-btn-toggle>
        <hr>
        <highcharts :constructor-type="'stockChart'"
            :options="chartOptions"
            style="height: 750px;width: 100%;" />
    </client-only>
</template>

<script lang="ts">
import { MsgArray } from '~/models/stock/twse'
import { trimEnd, formatAsCurrency, diff, diffp, isNumeric } from '~/lib/string'
import 'highcharts/css/stocktools/gui.css'
import 'highcharts/css/annotations/popup.css'

import Highcharts from 'highcharts'
import { Chart } from 'highcharts-vue'

import indicators from "highcharts/indicators/indicators"
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
                enabled: true
            },
            plotOptions: {
                series: {
                    showInLegend: true
                }
            },
            xAxis: { // Y軸亦同
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
            exporting: {
                enabled: true
            },
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
                    type: 'column',
                    name: '成交量',
                    data: [],
                    yAxis: 1,
                },
                {
                    type: 'sma',
                    name: 'MA5',
                    linkedTo: 'main-series',
                    params: {
                        period: 5
                    },
                    marker: {
                        enabled: false
                    },
                    color: 'rgb(25, 71, 163)',
                },
                {
                    type: 'sma',
                    name: 'MA20',
                    linkedTo: 'main-series',
                    params: {
                        period: 20
                    },
                    marker: {
                        enabled: false
                    },
                    color: 'rgb(245, 111, 10)',
                },
                {
                    type: 'sma',
                    name: 'MA60',
                    linkedTo: 'main-series',
                    params: {
                        period: 60
                    },
                    marker: {
                        enabled: false
                    },
                    color: 'rgb(62, 145, 82)',
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
            try {
                console.log(this.symbol.c)
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
                            r.push(parseFloat(this.chartRawData.indicators.quote[0].open[i].toFixed(2)))
                            r.push(parseFloat(this.chartRawData.indicators.quote[0].high[i].toFixed(2)))
                            r.push(parseFloat(this.chartRawData.indicators.quote[0].low[i].toFixed(2)))
                            r.push(parseFloat(this.chartRawData.indicators.quote[0].close[i].toFixed(2)))

                            v.push(this.chartRawData.timestamp[i] * 1000)
                            v.push(this.chartRawData.indicators.quote[0].volume[i] / 1000)
                            data.push(r)
                            volumeData.push(v)
                        }

                        this.chartOptions.series[0].data = data
                        this.chartOptions.series[2].data = volumeData
                        // lineSeries.setData(data)
                    }
                }

                this.chartOptions.xAxis.labels.formatter = function () {
                    return me.timestampToTime(this.value / 1000)
                }
                this.chartOptions.tooltip.formatter = function () {
                    var dateStr = me.timestampToTime(this.point.x / 1000)

                    const volume = this.points[2].y
                    const ma5 = this.points[3]?.y ?? ''
                    const ma20 = this.points[4]?.y ?? ''
                    const ma60 = this.points[5]?.y ?? ''
                    var str = `${dateStr} 開${parseFloat(this.point.open.toString()).toFixed(2)} 高${parseFloat(this.point.high.toString()).toFixed(2)} 低${parseFloat(this.point.low.toString()).toFixed(2)} 收${parseFloat(this.point.close.toString()).toFixed(2)} 量${trimEnd(formatAsCurrency(parseInt(volume.toString()), 2), '0')}張`
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

                    return str
                }

                this.loaded = true
            } catch (e) {
            }
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
                case 0:
                    y2.find(x => x.name == '成交量').visible = true
                    return;
                case 1:
                    y2.find(x => x.name == 'KD').visible = true
                    return;
            }
        }
    },
    components: {
        highcharts: Chart
    }
}
</script>