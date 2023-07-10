import Highcharts from 'highcharts';

function getJ(xData: any, yData: any) {
    return {
        xData,
        yData,
        values: yData.map((stochasticValues: [number, number]) => {
            const [k, d] = stochasticValues;
            const j = 3 * d - 2 * k;
            return j;
        }),
    };
}

export default function (highcharts: typeof Highcharts) {
    highcharts.seriesType(
        'kdj', // Calculates %J from %K and %D
        'stochastic', // Calculates %K & %D
        {
            name: 'KDJ'
        },
        {
            getValues: function (series: any): any {
                return this.getKDJ(series.xData, series.yData);
            },
            getKDJ: getJ
        }
    );
}