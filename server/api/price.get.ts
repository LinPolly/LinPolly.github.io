import * as cache from '~~/server/cache/stock';
import * as 上櫃 from '~~/lib/上櫃'

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const code = query.code as string
        let controller = new AbortController();
        var symbol = `${code}.TW`

        if (上櫃.has(code.toString())) {
            symbol += 'O'
        }

        if (cache.get(`price_${code}`)) {
            return cache.get(`price_${code}`)
        }

        const url = `https://tw.stock.yahoo.com/_td-stock/api/resource/StockServices.stockList;fields=avgPrice%2Corderbook;symbols=${symbol}?bkt=&device=desktop&ecma=modern&feature=useNewQuoteTabColor%2CenableNewPk&intl=tw&lang=zh-Hant-TW&partner=none&prid=68d0tvpiac9ar&region=TW&site=finance&tz=Asia%2FTaipei&returnMeta=true`
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

        var result = await req.json()
        // @ts-ignore
        var stock = result.data.find(x => x.symbol == symbol)
        var p = stock.price
        cache.set(`price_${code}`, p, 5)

        return p
    } catch (error) {
        console.log(error)
        return { result: [], error: error }
    }
})