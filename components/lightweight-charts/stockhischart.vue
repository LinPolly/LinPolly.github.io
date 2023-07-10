<template>
    <div style="height: 60px;width: 100%;">
        <span ref="tooltip"></span>
    </div>
    <div ref="chartDiv"
        style="width: 100%;height: 100%;padding-left: 4px;"></div>
</template>

<script setup lang="ts">
import { trimEnd, formatAsCurrency, diff, diffp, isNumeric } from '~/lib/string'
</script>

<script lang="ts">
import { IChartApi, ISeriesApi, createChart } from 'lightweight-charts'
import { MsgArray } from '~/models/stock/twse'

export default {
    data: () => ({
        chart: shallowRef(null as unknown as IChartApi),
        candlestickSeries: null as unknown as ISeriesApi<"Candlestick">,
        ma5Series: null as unknown as ISeriesApi<"Line">,
        ma20Series: null as unknown as ISeriesApi<"Line">,
        ma60Series: null as unknown as ISeriesApi<"Line">,
        candlestickExtraData: new Map(),
        ma5ExtraData: new Map(),
        ma20ExtraData: new Map(),
        ma60ExtraData: new Map(),
        chartRawData: null as unknown as Object,
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
                    this.chart = createChart(this.$refs.chartDiv as HTMLElement, {
                        autoSize: true,
                        layout: {
                            background: {
                                type: 'solid',
                                color: '#2B2B43',
                            },
                            lineColor: '#2B2B43',
                            textColor: '#D9D9D9',
                        },
                        watermark: {
                            color: 'rgba(0, 0, 0, 0)',
                        },
                        crosshair: {
                            color: '#758696',
                        },
                        grid: {
                            vertLines: {
                                color: '#2B2B43',
                            },
                            horzLines: {
                                color: '#363C4E',
                            },
                        },
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

                var container = this.$refs.chartDiv as HTMLElement
                const toolTipWidth = 80;
                const toolTipHeight = 80;
                const toolTipMargin = 15;
                const toolTip = this.$refs.tooltip as HTMLElement

                this.chart.subscribeCrosshairMove(param => {
                    if (
                        param.point === undefined ||
                        !param.time ||
                        param.point.x < 0 ||
                        param.point.x > container.clientWidth ||
                        param.point.y < 0 ||
                        param.point.y > container.clientHeight
                    ) {
                    } else {
                        // time will be in the same format that we supplied to setData.
                        // thus it will be YYYY-MM-DD 
                        const dateStr = this.timestampToTime(parseInt(`${param.time}`));
                        toolTip.style.display = 'block';

                        const data = this.candlestickExtraData.get(param.time)
                        const ma5 = this.ma5ExtraData.get(param.time)
                        const ma20 = this.ma20ExtraData.get(param.time)
                        const ma60 = this.ma60ExtraData.get(param.time)
                        toolTip.innerHTML = `${dateStr} 開${parseFloat(data.open).toFixed(2)} 高${parseFloat(data.high).toFixed(2)} 低${parseFloat(data.low).toFixed(2)} 收${parseFloat(data.close).toFixed(2)} 量${trimEnd(formatAsCurrency(parseInt(data.volume), 2), '0')}股
                        <br>
                        MA5 ${parseFloat(ma5).toFixed(2)} MA20 ${parseFloat(ma20).toFixed(2)} MA60 ${parseFloat(ma60).toFixed(2)}`;

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