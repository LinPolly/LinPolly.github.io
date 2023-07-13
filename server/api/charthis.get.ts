import * as cache from '~~/server/cache/stock';
import * as 上櫃 from '~~/server/static/上櫃'

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const code = query.code
        const interval = query.interval ?? '1d'
        let controller = new AbortController();
        var symbol = `${code}.TW`

        if (上櫃.has(code.toString())) {
            symbol += 'O'
        }

        var ff = cache.get(`chart_his_${symbol}_${interval}`)
        if (ff) {
            return ff
        }

        const url = `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}?symbol=${symbol}&period1=0&period2=9999999999&interval=${interval}`
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

        var r = data.chart.result.find(x => x.meta.symbol == symbol)
        cache.set(`chart_his_${symbol}_1m`, r, 3600)

        return r
    } catch (error) {
        console.log(error)
        return { result: [], error: error }
    }
})