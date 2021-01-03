/**
 * アプリケーション共用日付データ 
 * 
 * {year: 2020, month: 8, date: 25}
 * 
 * 数値はint
 * 
 */
import moment from 'moment'
/**
 * app dateの初期化
 */
function initAppDate(){   
    var m = moment(new Date())
    //m.subtract(10,'d');      // for debug, 2days ago
    var year = m.year()
    var month = m.month()+1
    var date = m.date()
    var day = m.day()
    return {year: year, month: month, date: date, day: day}
    //return {year: 2020, month: 8, date: 3}
}
/**
 * 日本語曜日の取得
 * 
 */
function getDayJp(day){
    const dayjp = ['日','月','火','水','木','金','土'];
    return dayjp[day]
}


/**
 * 曜日の取得
 * 
 * 
 */
function getDay(appDate){
    const date_str = appDate.year.toString() + '-' + appDate.month.toString().padStart(2,'0') + '-' + appDate.date.toString().padStart(2,'0') + 'T00:00:00'
    var youbi = moment(date_str)
    var day = getDayJp(youbi.day())
    return day
}
/**
 * xdateはストリング
 * 
 * yyyy-MM-dd フォーマットのストリング
 * 変数名 momentxxxだが、momentではなく、通常の日付数値
 * 月もそのままの値
 * 
 * momentDateはモーメントではない。
 */
function setAppDateFromDate(xdate){
    if(xdate === ''){
        return
    }
    var momentDate = {}
    var times = xdate.split('-')
    momentDate.year = parseInt(times[0])
    momentDate.month = parseInt(times[1])
    momentDate.date = parseInt(times[2])
    const day = getDay(momentDate)
    momentDate.day(day)
    return momentDate;
}

/**
 * yyyy-mm-ddデータをappDateに
 * 
 * 
 */
function setAppDateFromString(s){
    var appDate = {}
    const times = s.split('-')
    appDate = {year: parseInt(times[0]), month: parseInt(times[1]), date: parseInt(times[2])}
    var day = getDay(appDate)
    appDate.day = day
    return appDate
}

/**
 * 
 */
export default {
    initAppDate: initAppDate,
    setAppDateFromDate: setAppDateFromDate,
    setAppDateFromString: setAppDateFromString,
    getDay: getDay
}