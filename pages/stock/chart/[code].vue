<template>
    <div style="height: 20px;width: 100%;">
        <span ref="tooltip"></span>
    </div>
    <div ref="chart"
        style="width: 100%;height:calc(100vh - 80px);"></div>
</template>

<script lang="ts">
import { createChart } from 'lightweight-charts'

export default {
    data: () => ({
        loaded: false,
        chartRawData: null,
        chart: null,
    }),
    methods: {
        async init() {
            try {
                const { data } = await useFetch(`/api/chart?code=${this.code}`)

                this.chartRawData = data.value
                if (this.chartRawData) {
                    if (this.chart) return;

                    var timeOffset = new Date().getTimezoneOffset() * 60 * 1000
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
                            timeFormatter: (timestamp) => {
                                // 鼠标悬浮，时间格式化配置
                                return this.timestampToTime(timestamp + timeOffset)
                            },
                        },
                    })

                    const lineSeries = this.chart.addLineSeries()

                    {
                        // Replace with your own data
                        const data = []
                        for (let i = 1; i < this.chartRawData.chart.timestamp.length; i++) {
                            var r = {
                                time: this.chartRawData.chart.timestamp[i] - timeOffset,
                                // open: this.chartRawData.chart.indicators.quote[0].open[i],
                                // high: this.chartRawData.chart.indicators.quote[0].high[i],
                                // low: this.chartRawData.chart.indicators.quote[0].low[i],
                                // close: this.chartRawData.chart.indicators.quote[0].close[i],
                                value: this.chartRawData.chart.indicators.quote[0].close[i],
                                volume: this.chartRawData.chart.indicators.quote[0].volume[i],
                            }
                            if (r.value == null) {
                                r.value = data[data.length - 1].value
                            }
                            data.push(r)
                        }
                        lineSeries.setData(data)
                    }
                    lineSeries.priceScale().applyOptions({
                        scaleMargins: {
                            // positioning the price scale for the area series
                            top: 0.1,
                            bottom: 0.4,
                        },
                    });

                    const volumeSeries = this.chart.addHistogramSeries({
                        color: '#26a69a',
                        priceFormat: {
                            type: 'volume',
                        },
                        priceScaleId: '', // set as an overlay by setting a blank priceScaleId
                        // set the positioning of the volume series
                        scaleMargins: {
                            top: 0.7, // highest point of the series will be 70% away from the top
                            bottom: 0,
                        },
                    });
                    volumeSeries.priceScale().applyOptions({
                        scaleMargins: {
                            top: 0.7, // highest point of the series will be 70% away from the top
                            bottom: 0,
                        },
                    });
                    {
                        // Replace with your own data
                        const data = []
                        for (let i = 1; i < this.chartRawData.chart.timestamp.length; i++) {
                            var r = {
                                time: this.chartRawData.chart.timestamp[i] - timeOffset,
                                value: this.chartRawData.chart.indicators.quote[0].volume[i],
                            }
                            if (r.value == null) {
                                r.value = 0
                            }
                            data.push(r)
                        }
                        volumeSeries.setData(data)
                    }

                    var container = this.$refs.chart
                    const toolTip = this.$refs.tooltip

                    this.chart.subscribeCrosshairMove((param) => {
                        // 监听十字线移动，自定义展示高开低收
                        if (
                            param.point === undefined ||
                            !param.time ||
                            param.point.x < 0 ||
                            param.point.x > container.clientWidth ||
                            param.point.y < 0 ||
                            param.point.y > container.clientHeight
                        ) {
                            toolTip.textContent = ''
                        } else {
                            const data = param.seriesData.get(lineSeries)
                            const barData = param.seriesData.get(volumeSeries)
                            toolTip.textContent = `${this.timestampToTime(data?.time)} 價 ${data.value} 量 ${barData.value}`
                        }
                    })

                    this.chart.timeScale().fitContent()
                }

                this.loaded = true
            } catch (e) {
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
        }
    },
    mounted() {
        this.init()
    },
    unmounted() {
        if (this.chart) {
            this.chart.remove();
            this.chart = null;
        }
    },
    computed: {
        code() {
            return this.$route.params.code as string
        },
    }
}
</script>