import { GetStockInfo } from "~/models/stock/twse";

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const code = query.code

        if (code == '') {
            return []
        }
        if (Array.isArray(code) && code.length == 0) {
            return []
        }

        let controller = new AbortController();
        var ex_ch = ''
        if (Array.isArray(code)) {
            ex_ch = code.map(x => `tse_${x}.tw|otc_${x}.tw`).join('|')
        } else {
            ex_ch = `tse_${code}.tw|otc_${code}.tw`
        }
        const url = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=${ex_ch}&json=1&delay=0`
        const data = await fetch(url,
            {
                cache: "only-if-cached",
                signal: controller.signal,
            })
            .then((res) => {
                if (res.status === 504) {
                    controller.abort();
                    controller = new AbortController();
                    return fetch(url, {
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
                        cache: "reload",
                        signal: controller.signal,
                    });
                }
                return res.json();
            }) as GetStockInfo;
        return data.msgArray
    } catch (error) {
        console.log(error)
        return { result: [], error: error }
    }
})