import { GetStockInfo, MsgArray } from "~/models/stock/twse";
import * as 上市 from '~~/server/static/上市';
import * as 上櫃 from '~~/server/static/上櫃';
import * as ETF from '~~/server/static/ETF';
import * as cache from '~~/server/cache/stock';

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
        var ex_chodd = ''
        if (Array.isArray(code)) {
            ex_ch = code.map(x => `${x}`).filter(x => cache.get(x) == null).filter(x => !x.endsWith('_odd')).map(x => {
                if (ETF.has(x)) {
                    return `tse_${x}.tw`
                } else if (上櫃.has(x)) {
                    return `otc_${x}.tw`
                } else {
                    return `tse_${x}.tw`
                }
            }).join('|')
            ex_chodd = code.map(x => `${x}`).filter(x => cache.get(x) == null).filter(x => x.endsWith('_odd')).map(x => x.substring(0, x.length - '_odd'.length)).map(x => {
                if (ETF.has(x)) {
                    return `tse_${x}.tw`
                } else if (上櫃.has(x)) {
                    return `otc_${x}.tw`
                } else {
                    return `tse_${x}.tw`
                }
            }).join('|')
        } else {
            if (code?.toString().endsWith('_odd')) {
                var c = code.toString().substring(0, code.toString().length - '_odd'.length)

                if (ETF.has(c)) {
                    ex_chodd = `tse_${c}.tw`
                } else if (上櫃.has(c)) {
                    ex_chodd = `otc_${c}.tw`
                } else {
                    ex_chodd = `tse_${c}.tw`
                }
            } else {
                if (ETF.has(code)) {
                    ex_ch = `tse_${code}.tw`
                } else if (上櫃.has(code)) {
                    ex_ch = `otc_${code}.tw`
                } else {
                    ex_ch = `tse_${code}.tw`
                }
            }
            if (cache.get(code?.toString() ?? '') != null) {
                ex_chodd = ''
                ex_ch = ''
            }
        }

        var result = new Array<MsgArray>()

        if (ex_ch != '') {
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

            result.push(...data.msgArray)
        }
        if (ex_chodd != '') {
            const url = `https://mis.twse.com.tw/stock/api/getOddInfo.jsp?ex_ch=${ex_chodd}&json=1&delay=0`
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

            result.push(...data.msgArray)
        }

        if (Array.isArray(code)) {
            code.map(x => `${x}`)
                .filter(x => cache.get(x) != null && result.some(y => y.c == x) == false)
                .forEach(e => {
                    result.push(cache.get(e))
                })

            code.map(x => `${x}`)
                .filter(x => cache.get(x) != null && result.some(y => y.c == x) == false)
                .forEach(e => {
                    result.push(cache.get(e))
                })
        } else {
            if (cache.get(code?.toString() ?? '') != null) {
                result.push(cache.get(code?.toString() ?? ''))
            }
        }

        if (Array.isArray(code)) {
            var s = code.map(x => x.toString() as string).map(x => {
                if (x.endsWith('_odd')) {
                    var c = x.substring(0, x.length - '_odd'.length)
                    cache.set(x, result.find(e => e.c == c), 5)
                    return c
                } else {
                    cache.set(x, result.find(e => e.c == x), 5)
                    return x
                }
            })

            result = result.sort((a, b) => s.indexOf(a.c) - s.indexOf(b.c))
        }
        return result
    } catch (error) {
        console.log(error)
        return { result: [], error: error }
    }
})