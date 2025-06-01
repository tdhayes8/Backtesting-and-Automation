export default function convertCandleData(rows) {
    delete rows[0] // Remove headers obj, we dont need it with the current structure
    // Process each row and convert it into an array of values
    const rowData = rows.map(row => {
        return {
            time: Math.floor(new Date(row.date).getTime() / 1000),
            open: parseFloat(row.open),
            high: parseFloat(row.high),
            low: parseFloat(row.low),
            close: parseFloat(row.close)
        }
    });
  
    return Object.values(rowData);
}


export function convertBackTestData(rows) {
    delete rows[0]
    const rowData = rows.signals.map(row => {
        return{
            time: Math.floor(new Date(row.time).getTime() / 1000),
            signal: row.signal,
            price: parseFloat(row.price),
            profit: parseFloat(row.profit)
        }
    });
    rows.signals = rowData
    return rows;
}
