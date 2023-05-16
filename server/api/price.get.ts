import * as cheerio from "cheerio";

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const code = query.code
        let controller = new AbortController();
        var symbol = `${code}.TW`

        const url = `https://tw.stock.yahoo.com/quote/${symbol}`
        const headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
        };
        const req = await fetch(url,
            {
                headers: headers,
                cache: "only-if-cached",
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

        var pageSource = await req.text()
        const $ = cheerio.load(pageSource)
        var div = $('#layout-col1 > div > div > div > div')[1]
        var $div = cheerio.load(div)
        var price = $div('div:first-child > div > span:first-child').text()
        return price.replace(',', '')
    } catch (error) {
        console.log(error)
        return { result: [], error: error }
    }
})