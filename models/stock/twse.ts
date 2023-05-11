export interface GetStockInfo {
    msgArray: MsgArray[];
    referer: string;
    userDelay: number;
}
export interface MsgArray {
    /** 當前盤中盤成交量 */
    tv: string;
    /** */
    ps: string;
    /** 網址 */
    nu?: string;
    /** */
    pz: string;
    /** */
    bp: string;
    /** 揭示賣價(從低到高，以_分隔資料) */
    a: string;
    /** 揭示買價(從高到低，以_分隔資料) */
    b: string;
    /** 股票代號 */
    c: string;
    /** 最近交易日期（YYYYMMDD） */
    d: string;
    /** */
    ch: string;
    /** 資料更新時間（單位：毫秒）*/
    tlong: string;
    /** 揭示賣量(配合a，以_分隔資料) */
    f: string;
    /** */
    ip: string;
    /** 揭示買量(配合b，以_分隔資料) */
    g: string;
    /** */
    mt: string;
    /** 最高價格 */
    h: string;
    /** */
    it: string;
    /** 最低價格 */
    l: string;
    /** 公司簡稱 */
    n: string;
    /** 開盤價格 */
    o: string;
    /** */
    p: string;
    /** 上市別(上市:tse，上櫃:otc，空白:已下市或下櫃) */
    ex: string;
    /** */
    s: string;
    /** 最近成交時刻（HH:MI:SS） */
    t: string;
    /** 漲停價 */
    u: string;
    /** 累積成交量 */
    v: string;
    /** 跌停價 */
    w: string;
    /** 公司全名 */
    nf: string;
    /** 昨日收盤價格 */
    y: string;
    /** 當前盤中成交價 */
    z: string;
    /** */
    ts: string;
    /** */
    i?: string;
}