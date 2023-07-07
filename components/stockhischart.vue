<template>
    <div ref="tooltip"
        style="width: 96px; height: 80px; position: absolute; display: none; padding: 8px; box-sizing: border-box; font-size: 12px; text-align: left; z-index: 1000; top: 12px; left: 12px; pointer-events: none; border: 1px solid; border-radius: 2px;font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
    </div>
    <div ref="chart"
        style="width: 100%;height: 100%;padding-left: 4px;"></div>
</template>

<script lang="ts">
import { IChartApi, ISeriesApi, createChart } from 'lightweight-charts'
import { MsgArray } from '~/models/stock/twse'

export default {
    data: () => ({
        chart: null as unknown as IChartApi,
        candlestickSeries: null as unknown as ISeriesApi<"Candlestick">,
        ma5Series: null as unknown as ISeriesApi<"Line">,
        ma20Series: null as unknown as ISeriesApi<"Line">,
        ma60Series: null as unknown as ISeriesApi<"Line">,
        candlestickExtraData: new Map(),
        ma5ExtraData: new Map(),
        ma20ExtraData: new Map(),
        ma60ExtraData: new Map(),
        chartRawData: null as unknown as Object,
        observer: null as unknown as ResizeObserver,
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
        this.observer.observe(this.$refs.chart as HTMLElement)
        this.init()
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
            var c = this.symbol.c
            const { data } = await useFetch(`/api/charthis?code=${c}`)

            this.chartRawData = data.value
            if (this.chartRawData) {
                var timeOffset = new Date().getTimezoneOffset() * 60 * 1000
                timeOffset = 0
                if (this.chart == null) {
                    // @ts-ignore
                    this.chart = createChart(this.$refs.chart, {
                        autoSize: true,
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

                if (this.candlestickSeries == null) {
                    this.candlestickSeries = this.chart.addCandlestickSeries({
                        wickUpColor: 'rgb(223, 63, 63)',
                        upColor: 'rgb(223, 63, 63)',
                        wickDownColor: 'rgb(51, 139, 72)',
                        downColor: 'rgb(51, 139, 72)',
                        borderVisible: false,
                    })
                }

                // Replace with your own data
                const candlestickData = []
                {

                    // @ts-ignore
                    for (let i = 1; i < this.chartRawData.timestamp.length; i++) {
                        var r = {
                            // @ts-ignore
                            time: this.chartRawData.timestamp[i] - timeOffset,
                            // @ts-ignore
                            open: this.chartRawData.indicators.quote[0].open[i],
                            // @ts-ignore
                            high: this.chartRawData.indicators.quote[0].high[i],
                            // @ts-ignore
                            low: this.chartRawData.indicators.quote[0].low[i],
                            // @ts-ignore
                            close: this.chartRawData.indicators.quote[0].close[i],
                            // @ts-ignore
                            volume: this.chartRawData.indicators.quote[0].volume[i],
                            // @ts-ignore
                            adjclose: this.chartRawData.indicators.adjclose[0].adjclose[i],
                        }

                        if (r.time != null && r.open != null && r.high != null && r.low != null && r.close != null && r.volume != null && r.adjclose != null) {
                            candlestickData.push(r)
                        }
                    }

                    this.candlestickExtraData.clear()
                    candlestickData.forEach(x => {
                        this.candlestickExtraData.set(x.time, x)
                    })
                    // @ts-ignore
                    this.candlestickSeries.setData(candlestickData)
                }

                if (this.ma5Series == null) {
                    this.ma5Series = this.chart.addLineSeries({
                        color: 'rgb(25, 71, 163)',
                        lineWidth: 2,
                    })
                }
                if (this.ma20Series == null) {
                    this.ma20Series = this.chart.addLineSeries({
                        color: 'rgb(245, 111, 10)',
                        lineWidth: 2,
                    })
                }
                if (this.ma60Series == null) {
                    this.ma60Series = this.chart.addLineSeries({
                        color: 'rgb(62, 145, 82)',
                        lineWidth: 2,
                    })
                }
                {
                    var ma5 = this.calculateSMA(candlestickData, 5)
                    var ma20 = this.calculateSMA(candlestickData, 20)
                    var ma60 = this.calculateSMA(candlestickData, 60)

                    ma5.forEach(x => {
                        this.ma5ExtraData.set(x.time, x.value)
                    })

                    ma20.forEach(x => {
                        this.ma20ExtraData.set(x.time, x.value)
                    })

                    ma60.forEach(x => {
                        this.ma60ExtraData.set(x.time, x.value)
                    })

                    this.ma5Series.setData(ma5)
                    this.ma20Series.setData(ma20)
                    this.ma60Series.setData(ma60)
                }

                var container = this.$refs.chart as HTMLElement
                const toolTipWidth = 80;
                const toolTipHeight = 80;
                const toolTipMargin = 15;
                const toolTip = this.$refs.tooltip as HTMLElement
                toolTip.style.background = 'white';
                toolTip.style.color = 'black';
                toolTip.style.borderColor = 'rgba(255, 82, 82, 1)';

                this.chart.subscribeCrosshairMove(param => {
                    if (
                        param.point === undefined ||
                        !param.time ||
                        param.point.x < 0 ||
                        param.point.x > container.clientWidth ||
                        param.point.y < 0 ||
                        param.point.y > container.clientHeight
                    ) {
                        toolTip.style.display = 'none';
                    } else {
                        // time will be in the same format that we supplied to setData.
                        // thus it will be YYYY-MM-DD 
                        const dateStr = param.time;
                        toolTip.style.display = 'block';

                        const data = this.candlestickExtraData.get(param.time)
                        const ma5 = this.ma5ExtraData.get(param.time)
                        const ma20 = this.ma20ExtraData.get(param.time)
                        const ma60 = this.ma60ExtraData.get(param.time)
                        toolTip.innerHTML = `
<div style="color: ${'rgba(255, 82, 82, 1)'}">${this.symbol.n}</div>
<div style="font-size: 24px; margin: 4px 0px; color: ${'black'}">開 ${data.open}</div>
<div style="font-size: 24px; margin: 4px 0px; color: ${'black'}">高 ${data.high}</div>
<div style="font-size: 24px; margin: 4px 0px; color: ${'black'}">低 ${data.low}</div>
<div style="font-size: 24px; margin: 4px 0px; color: ${'black'}">收 ${data.close}</div>
<div style="font-size: 24px; margin: 4px 0px; color: ${'black'}">量 ${data.volume}</div>
<div style="font-size: 24px; margin: 4px 0px; color: ${'black'}">MA5 ${ma5.value}</div>
<div style="font-size: 24px; margin: 4px 0px; color: ${'black'}">MA20 ${ma20.value}</div>
<div style="font-size: 24px; margin: 4px 0px; color: ${'black'}">MA60 ${ma60.value}</div>
<div style="color: ${'black'}">${dateStr}</div>`;

                        const y = param.point.y;
                        let left = param.point.x + toolTipMargin;
                        if (left > container.clientWidth - toolTipWidth) {
                            left = param.point.x - toolTipMargin - toolTipWidth;
                        }

                        let top = y + toolTipMargin;
                        if (top > container.clientHeight - toolTipHeight) {
                            top = y - toolTipHeight - toolTipMargin;
                        }
                        toolTip.style.left = left + 'px';
                        toolTip.style.top = top + 'px';
                    }
                });

                this.chart.timeScale().setVisibleRange({
                    from: new Date(new Date().getFullYear(), new Date().getMonth() - 6, new Date().getDay()).getTime() / 1000,
                    to: new Date().getTime() / 1000,
                })

                var delay = new Promise((resolve, reject) => {
                    setTimeout(resolve, 5000)
                })
                await delay
            }
        },
        timestampToTime(timestamp: number) {
            var date = new Date(timestamp * 1000);
            var Y = date.getFullYear();
            var M = date.getMonth() + 1;
            var D = date.getDate();
            return `${Y}/${M}/${D}`;
        },
        calculateSMA(data: Array<Object>, count: number) {
            var avg = function (data) {
                var sum = 0;
                for (var i = 0; i < data.length; i++) {
                    sum += data[i].close;
                }
                return sum / data.length;
            };
            var result = [];
            for (var i = count - 1, len = data.length; i < len; i++) {
                var val = avg(data.slice(i - count + 1, i));
                result.push({ time: data[i].time, value: val });
            }
            return result;
        }
    },
};
</script>