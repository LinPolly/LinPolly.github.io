import * as cache from '~~/server/cache/stock';

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const code = query.code
        let controller = new AbortController();
        var symbol = `${code}.TW`

        var ff = cache.get(`chart_${symbol}_1m`)
        if (ff) {
            return ff
        }

        var yahooSymbol = encodeURIComponent(`["${symbol}"]`)

        const url = `https://tw.stock.yahoo.com/_td-stock/api/resource/FinanceChartService.ApacLibraCharts;autoRefresh=${Math.round(new Date().getTime() / 1000)};symbols=${yahooSymbol};type=tick?bkt=&device=desktop&ecma=modern&feature=useNewQuoteTabColor%2CenableNewPk&intl=tw&lang=zh-Hant-TW&partner=none&prid=08iveohia9l4c&region=TW&site=finance&tz=Asia%2FTaipei&returnMeta=true`
        const headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
        };
        const req = await fetch(url,
            {
                headers: headers,
                // cache: "only-if-cached",
                signal: controller.signal,
            })
            .then((res) => {
                if (res.status === 504) {
                    controller.abort();
                    controller = new AbortController();
                    return fetch(url, {
                        headers: headers,
                        cache: "force-cache",
                        signal: controller.signal,
                    });
                }
                const date = res.headers.get("date"),
                    dt = date ? new Date(date).getTime() : 0;
                if (dt < Date.now() - 5_000) {
                    controller.abort();
                    controller = new AbortController();
                    return fetch(url, {
                        headers: headers,
                        cache: "reload",
                        signal: controller.signal,
                    });
                }
                return res;
            });

        var data = await req.json()

        // @ts-ignore
        var r = data.data.find(x => x.symbol == symbol)
        cache.set(`chart_${symbol}_1m`, r, 30)

        return r
    } catch (error) {
        console.log(error)
        return { result: [], error: error }
    }
})