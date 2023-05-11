export default defineEventHandler(async (event) => {
    try {
        const code = event.context.params?.code as string;
        const { data } = await useAsyncData(code, () => $fetch(`https://mis.twse.com.tw/stock/api/getStock.jsp?ch=${code}.tw&json=1`))
        return data.value
    } catch (error) {
        return { result: [], error: error }
    }
})