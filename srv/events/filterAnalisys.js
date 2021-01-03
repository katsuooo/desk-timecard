/*
 filter string analisis
*/
import moment from 'moment'
/**
 * check filter string date or not
 * yyyymmdd >>> 8 digit num string is date
 * @param {*} filter 
 */
function checkDate(filter){
    if(filter.length !== 8) return false
    if(isNaN(filter)) return false
    const validtime = moment(filter)
    const mintime = moment('19700101')
    const maxtime = moment() // today
    if (!validtime.isAfter(mintime.format())) return false
    if (!validtime.isSameOrBefore(maxtime.format())) return false
    return true
}

var filterAnalisys = {
    checkDate: (filter) => {
        console.log(filter)
        return checkDate(filter)
    }
}

module.exports = filterAnalisys


/*
const validtime = moment('20190705')
const mintime = moment('19700101')
const maxtime = moment() // today

//console.log(mintime.isAfter('2019-07-05'))    //false
console.log(validtime.isAfter('19070101'))  //true
console.log(validtime.isSameOrBefore(moment().format()))    //true
*/