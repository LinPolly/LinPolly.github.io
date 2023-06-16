var cache = {}

interface Cache {
    data: any;
    expired_date: Date;
}

export const get = (key: string) => {
    // @ts-ignore
    if (cache[key]) {
        // @ts-ignore
        var c = cache[key] as Cache

        if (c.expired_date < new Date()) {
            return null
        }

        return c.data
    }

    return null
}

export const set = (key: string, value: any, timeout: number = 600) => {
    var now = new Date()
    now.setSeconds(now.getSeconds() + timeout)

    var c = {} as Cache
    c.data = value
    c.expired_date = now

    // @ts-ignore
    cache[key] = c
}