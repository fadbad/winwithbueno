
import Moment from 'moment';
import momentRange from 'moment-range';

export const moment = momentRange.extendMoment(Moment);

export const thisMonth = {
    start: moment().startOf('month').format(), 
    end: moment().endOf('month').format()
}

export const lastMonth = {
    start: moment().add(-1, 'months').startOf('month').format(), 
    end: moment().add(-1, 'months').endOf('month').format()
}

export const thisYear = {
    start: moment().startOf('year').format(), 
    end: moment().endOf('year').format()
}

export const lastYear = {
    start: moment().add(-1, 'years').startOf('year').format(), 
    end: moment().add(-1, 'years').endOf('year').format()
}

export const datesRange = (interval, from, to) => {
    let range = moment().range(from, to)

    return Array.from(range.by(interval)).map(d => {
        return {
            start: moment(d).startOf(interval).format(),
            end: moment(d).endOf(interval).format(),
            value: moment(d)
        }
    })
}

export const datesInterval = (interval, count = 1, date = moment()) => {
    if (!moment.isMoment(date)) date = moment(date);

    let range = moment.rangeFromInterval(interval, count, date)
    return Array.from(range.by(interval)).map(d => {
        return {
            start: moment(d).startOf(interval).format(),
            end: moment(d).endOf(interval).format(),
            value: moment(d)
        }
    })
}
