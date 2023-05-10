export interface Stock {
    date: string;
    stock: StockList[];
}

export interface StockList {
    code: string;
    volumn: number;
    weights: number;
}