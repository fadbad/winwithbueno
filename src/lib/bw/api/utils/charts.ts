import { thisMonth, lastMonth } from "$lib/bw/api"

export const percentage_relative = (a, b) => {
    if (isNaN(+a) || isNaN(+b)) return ''
    return a-b === 0 ? 0 : 100 * Math.abs( ( a - b ) / b  ) || '';
}

export const percentage_diff = (a, b) => {
    a = +a 
    b = +b
    if (isNaN(a) || isNaN(b)) return null
    if(a === b) {
        return {
            value: (0).toFixed(2),
            dir: 'equal',
            text: 'same as'
        }
    } else if( a < b) {
        return {
            value: (a === 0 ? (b * 100) : ((b - a) * 100) / a).toFixed(2),
            dir: 'down',
            text: 'less than'
        }
    } else {
        return {
            value: (b === 0 ? (a * 100) : ((a - b) * 100) / b).toFixed(2),
            dir: 'up',
            text: 'more than'
        }
    }
    // return ( a<b ? "-" + ((b - a) * 100) / a : ((a - b) * 100) / b ) + "%";
}

export const getChartData = async (q, months, where = {}) => {
    const values = []
    for( const month of months ) {
        const v = await q.count({
            where: {
                createdAt: {
                    gte: month['start'], 
                    lt: month['end']
                },
                ...where
            }
        })

        values.push(v || 0)
        // values.push( Math.floor(Math.random() * 10) )
    }
    return values
}

export const getStatMonth = async (query, icon, title, where = {}) => {
    const value = await query.count({ where })

    const thisMonthCount = await query.count({
        where: {
            createdAt: {
                gte: thisMonth.start, 
                lt: thisMonth.end
            },
            ...where
        }
    })

    const lastMonthCount = await query.count({
        where: {
            createdAt: {
                gte: lastMonth.start, 
                lt: lastMonth.end
            },
            ...where
        }
    })

    const perc = percentage_diff(thisMonthCount, lastMonthCount)
    // const perc = percentage_diff(10, 0)

    const desc = `${perc.value}% ${perc.text} last month`

    return {
        icon,
        title,
        value: value.toString(),
        desc,
    }
}
