import {
    db, middleware, __res, datesInterval, getChartData, getStatMonth
} from "$lib/bw/api";
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler = async ({ url, locals }) => {
    await middleware(locals, db.admin)

    const months = datesInterval('months', -6)
    
    const labels = months.map(d => d.value.format('MMM - YY'))

    const datasets = [
        {
            name: 'Users', 
            chartType: 'bar',
            values: await getChartData(db.user, months)
        }
    ]

    const stats = [
        await getStatMonth(db.user, 'users', 'Users'),
    ]

    return __res.success({ labels, datasets, stats })
}
