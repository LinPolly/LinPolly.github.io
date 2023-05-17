export const formatAsCurrency = (value: number, dec: number) => {
    dec = dec || 0
    if (value === null) {
        return '0'
    }
    return '' + value.toFixed(dec).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
}

export const trim = (str: string, c: string) => {
    if (str) {
        if (str === '0.00')
            return '0'

        const pattern = new RegExp(`^${c}+|${c}+$`, 'g');
        var v = str.replace(pattern, '')

        if (v.endsWith('.')) {
            return v.substring(0, v.length - 1)
        }

        return v
    }
    return str
}

export const trimEnd = (str: string, c: string) => {
    if (str) {
        if (str === '0.00')
            return '0'

        const pattern = new RegExp(`^|${c}+$`, 'g');
        var v = str.replace(pattern, '')

        if (v.endsWith('.')) {
            return v.substring(0, v.length - 1)
        }

        return v
    }
    return str
}

export const trimStart = (str: string, c: string) => {
    if (str) {
        if (str === '0.00')
            return '0'

        const pattern = new RegExp(`^${c}+|$`, 'g');
        var v = str.replace(pattern, '')

        if (v.endsWith('.')) {
            return v.substring(0, v.length - 1)
        }

        return v
    }
    return str
}

export const formatDate = (date: Date | string | number) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

    if (month.length < 2)
        month = '0' + month
    if (day.length < 2)
        day = '0' + day

    return `${year}-${month}-${day}`
}

export const diff = (z: string, y: string) => {
    var v = accSubtr(parseFloat(z), parseFloat(y))
    if (v == 0)
        return 0
    return v
}

export const diffp = (z: string, y: string) => {
    var v = ((accSubtr(parseFloat(z), parseFloat(y)) * 100 /
        parseFloat(y) * 100) / 100)

    if (v == 0)
        return 0

    // @ts-ignore
    return trimEnd(v.toFixed(2), '0') as number
}
//除法
export const accDiv = (arg1: number, arg2: number) => {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    } catch (e) { }
    try {
        t2 = arg2.toString().split(".")[1].length;
    } catch (e) { }

    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    return (r1 / r2) * Math.pow(10, t2 - t1);
}
//乘法
export const accMul = (arg1: number, arg2: number) => {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    } catch (e) { }
    try {
        m += s2.split(".")[1].length;
    } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}
//加法
export const accAdd = (arg1: number, arg2: number) => {
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m;
}
//減法
export const accSubtr = (arg1: number, arg2: number) => {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) { r1 = 0 }
    try {
        r2 = arg2.toString().split(".")[1].length;
    } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    // @ts-ignore
    return ((arg1 * m - arg2 * m) / m).toFixed(n) as number;
}