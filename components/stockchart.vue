<template>
    <div style="height: 20px;width: 100%;">
        <span ref="tooltip"></span>
    </div>
    <div ref="chart"
        style="width: 100%;height: 100%;padding-left: 4px;"></div>
</template>

<script lang="ts">
import { BaselineData, IChartApi, ISeriesApi, createChart } from 'lightweight-charts'
import { MsgArray } from '~/models/stock/twse'

export default {
    data: () => ({
        chart: null as unknown as IChartApi,
        baselineSeries: null as unknown as ISeriesApi<"Baseline">,
        volumeSeries: null as unknown as ISeriesApi<"Histogram">,
        baselineExtraData: new Map(),
        volumeExtraData: new Map(),
        chartRawData: null,
        timer: {
            lastudt: new Date()
        }
    }),
    props: {
        symbol: {
            type: Object as PropType<MsgArray>,
            required: true
        }
    },
    mounted() {
        var chart = this.chart
        this.observer = new ResizeObserver(function (entries) {
            chart?.timeScale().fitContent()
        });
        this.observer.observe(this.$refs.chart)
        this.init()
        this.repeat()
    },
    unmounted() {
        if (this.chart) {
            this.chart.remove();
            // @ts-ignore
            this.chart = null;
        }
    },
    methods: {
        async init() {
            const { data } = await useFetch(`/api/chart?code=${this.symbol.c}`)

            this.chartRawData = data.value
            if (this.chartRawData) {

                var timeOffset = new Date().getTimezoneOffset() * 60 * 1000

                if (this.chart) {
                    this.chart.remove();
                    // @ts-ignore
                    this.chart = null;
                }

                if (this.chart == null) {
                    // @ts-ignore
                    this.chart = createChart(this.$refs.chart, {
                        autoSize: true,
                        handleScroll: false,
                        handleScale: false,
                        timeScale: {
                            rightOffset: 12,
                            barSpacing: 3,
                            fixLeftEdge: true,
                            lockVisibleTimeRangeOnResize: true,
                            rightBarStaysOnScroll: true,
                            borderVisible: false,
                            borderColor: '#fff000',
                            visible: true,
                            timeVisible: true,
                            secondsVisible: false,
                        },
                        priceScale: {
                            // position: 'right',
                            mode: 1,
                            autoScale: true,
                            invertScale: false,
                            alignLabels: true,
                            borderVisible: false,
                        },
                        localization: {
                            locale: 'zh-tw',
                            // @ts-ignore
                            timeFormatter: (timestamp) => {
                                return this.timestampToTime(timestamp + timeOffset)
                            },
                        },
                    })
                }

                this.baselineSeries = this.chart.addBaselineSeries({
                    baseValue: { type: 'price', price: parseFloat(this.symbol.y) },
                    topLineColor: 'rgba( 239, 83, 80, 1)',
                    topFillColor1: 'rgba( 239, 83, 80, 0.05)',
                    topFillColor2: 'rgba( 239, 83, 80, 0.28)',
                    bottomLineColor: 'rgba( 38, 166, 154, 1)',
                    bottomFillColor1: 'rgba( 38, 166, 154, 0.28)',
                    bottomFillColor2: 'rgba( 38, 166, 154, 0.05)',
                })

                {
                    // Replace with your own data
                    const data = [
                        {
                            time: this.chartRawData.chart.timestamp[0] - timeOffset,
                            value: parseFloat(this.symbol.y)
                        }
                    ]

                    // @ts-ignore
                    for (let i = 1; i < this.chartRawData.chart.timestamp.length; i++) {
                        var r = {
                            // @ts-ignore
                            time: this.chartRawData.chart.timestamp[i] - timeOffset,
                            // open: this.chartRawData.chart.indicators.quote[0].open[i],
                            // high: this.chartRawData.chart.indicators.quote[0].high[i],
                            // low: this.chartRawData.chart.indicators.quote[0].low[i],
                            // close: this.chartRawData.chart.indicators.quote[0].close[i],
                            // @ts-ignore
                            value: this.chartRawData.chart.indicators.quote[0].close[i],
                        }
                        if (r.value) {
                            data.push(r)
                        }
                    }

                    this.baselineExtraData.clear()
                    data.forEach(x => {
                        this.baselineExtraData.set(x.time, x.value)
                    })
                    // @ts-ignore
                    this.baselineSeries.setData(data)
                }
                this.baselineSeries.priceScale().applyOptions({
                    scaleMargins: {
                        // positioning the price scale for the area series
                        top: 0.1,
                        bottom: 0.4,
                    },
                });

                this.volumeSeries = this.chart.addHistogramSeries({
                    color: '#26a69a',
                    priceFormat: {
                        type: 'volume',
                    },
                    priceScaleId: '', // set as an overlay by setting a blank priceScaleId
                    // set the positioning of the volume series
                    // @ts-ignore
                    scaleMargins: {
                        top: 0.7, // highest point of the series will be 70% away from the top
                        bottom: 0,
                    },
                });
                this.volumeSeries.priceScale().applyOptions({
                    scaleMargins: {
                        top: 0.7, // highest point of the series will be 70% away from the top
                        bottom: 0,
                    },
                });
                {
                    // Replace with your own data
                    const data = []
                    // @ts-ignore
                    for (let i = 1; i < this.chartRawData.chart.timestamp.length; i++) {
                        // @ts-ignore
                        var r = {
                            // @ts-ignore
                            time: this.chartRawData.chart.timestamp[i] - timeOffset,
                            // @ts-ignore
                            value: this.chartRawData.chart.indicators.quote[0].volume[i],
                        }
                        if (r.value == null) {
                            r.value = 0
                        }

                        // @ts-ignore
                        if (this.chartRawData.chart.indicators.quote[0].close[i] > parseFloat(this.symbol.y)) {
                            // @ts-ignore
                            r.color = 'red'
                        }

                        data.push(r)
                    }

                    this.volumeExtraData.clear()
                    data.forEach(x => {
                        this.volumeExtraData.set(x.time, x.value)
                    })
                    // @ts-ignore
                    this.volumeSeries.setData(data)
                }

                var container = this.$refs.chart
                const toolTip = this.$refs.tooltip as HTMLElement

                this.chart.subscribeCrosshairMove((param) => {
                    if (!param.point) {
                        // @ts-ignore
                        toolTip.textContent = ''
                        toolTip.style.color = 'black'
                        return;
                    }

                    var price = this.baselineExtraData.get(param.time)
                    var volume = this.volumeExtraData.get(param.time)

                    if (price != null && volume != null) {
                        // @ts-ignore
                        toolTip.textContent = `${this.timestampToTime(param?.time + timeOffset)} 價 ${price} 量 ${volume}`
                        if (parseFloat(price) == parseFloat(this.symbol.y)) {
                            toolTip.style.color = 'black'
                        } else if (parseFloat(price) > parseFloat(this.symbol.y)) {
                            toolTip.style.color = 'red'
                        } else if (parseFloat(price) < parseFloat(this.symbol.y)) {
                            toolTip.style.color = 'green'
                        }
                    } else {
                        // @ts-ignore
                        toolTip.textContent = ''
                        toolTip.style.color = 'black'
                    }
                })

                this.chart.timeScale().fitContent()

                var delay = new Promise((resolve, reject) => {
                    setTimeout(resolve, 5000)
                })
                await delay
            }
        },
        timestampToTime(timestamp: number) {
            var date = new Date(timestamp * 1000);
            // var Y = date.getFullYear() + '-';
            // var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            // var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
            var h = date.getHours().toString().padStart(2, '0')
            var m = date.getMinutes().toString().padStart(2, '0')
            // var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            // return Y + M + D + h + m + s;
            return h + ':' + m;
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
        async repeat() {
            if (this.timer.lastudt.getHours() < 9
                || this.timer.lastudt.getHours() >= 14
                || (this.timer.lastudt.getHours() >= 13 && this.timer.lastudt.getMinutes() > 30)) {
                this.timer.lastudt = new Date()
                setTimeout(this.repeat, 1000);
                return
            }
            // @ts-ignore
            if (new Date() - this.timer.lastudt > 5_000) {
                this.timer.lastudt = new Date()
                await this.init()
            }

            setTimeout(this.repeat, 5000)
        },
    },
};
</script>