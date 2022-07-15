export const toCsv = ( data = [] ) => {

    if(!data || !Array.isArray(data)) return ''
    if(!data.length) return ''

    const csvString = [
        Object.keys(data[0]),
        ...data.map(item => Object.values(item))
    ].map(e => e.join(",")).join("\n");

    return csvString

}
