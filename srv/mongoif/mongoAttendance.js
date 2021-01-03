/**
 * attendance interface
 * 
 * 
 * 
 */
var mongodb = require('mongodb');
const MONGOINFO = require('../config/config').MONGOINFO;


/**
 * 本日の出退勤データを探す
 * 
 * @param {*} d = [{date:,attendance:[]},....]
 */
function getTodayAttendance(d, date){
    console.log('get-today-attendance',d)
    if(d.length === 0){
        return false
    }
    var today = {}
    d.forEach( (x) => {
        if(x.date === date){
            today = x.attendance
        }
    })
    return today
}
/**
 * 
 * 出退勤データのパース
 * 
 * attendance:
 *   date:''
 *   attendance:[
 *     {name:'', in:'', out:''}
 *   ]
 * 
 * 
 */
function parseAttendance(att, name){
    console.log('att-', att, typeof(att))
    var d = {name:name, in:'', out:''}
    att.forEach((a) => {
        if(a.name === name){
            console.log(a)
            if(!(a.hasOwnProperty('in'))){
                a.in = ''
            }
            if(!(a.hasOwnProperty('out'))){
                a.out = ''
            }
            d = JSON.parse(JSON.stringify(a))
        }
    })
    return d
}
/**
 * 本日の出退勤データを探す
 * 
 * @param {*} d = [{date:'',attendance:[]},....]
 */
function getTodayAttendance(d, date){
    if(d.length === 0){
        return false
    }
    var today = {}
    d.forEach( (x) => {
        if(x.date === date){
            today = x.attendance
        }
    })
    return today
}
/**
 * 出退勤データのリード
 * 
 * @param {*} dbName 
 * @param {*} colName 
 * @param {*} appDate 
 * @param {*} socket 
 * @param {*} eventName 
 */
var readAttendance = async(dbName, colName, appDate, name, socket, eventName) => {
    console.log('read-attendance')
    var client;
    try{
        client = await mongodb.MongoClient.connect(MONGOINFO.url, {useNewUrlParser:true}, {useUnifiedTopology: true} );
        const db = await client.db(dbName);
        const collection = await db.collection(colName);
        let d = await collection.find({date:appDate.date.toString()}).toArray();
        console.log('attendance',d)
        if(d.length === 0){
            var today = false
        }else{
            var today = getTodayAttendance(d, appDate.date.toString())
        }
        console.log('today', today)
        if(today === false){
            socket.emit(eventName, {name:name, in:'', out:''});
        }else{
            const attendance = parseAttendance(today, name)
            console.log('att-', name, attendance)
            socket.emit(eventName, attendance);
        }
    }catch(err){
        console.log(err);
    }finally{
        try{
            console.log('attendance-read-pass')
            client.close();
        }catch(err){
            console.log(err)
        }
    }
}
/**
 * 
 * 出退勤データのライト
 * 
 * {
 *   date: x,
 *   attendance: {name:'', in:'', out:''}
 * }
 * @param {*} dbName 
 * @param {*} colName
 *            date  
 * @param {*} q {name: inout: time}
 */
/** 
var writeAttendance = async(dbName, colName, date, q) => {
    var client;
    console.log('write-data',q)
    try{
        client = await mongodb.MongoClient.connect(MONGOINFO.url, {useNewUrlParser:true}, {useUnifiedTopology: true} );
        const db = await client.db(dbName);
        const collection = await db.collection(colName);
        const xDate = date
        let setd = {}
        if(q.inout === 'in'){
            setd = {$set:{'attendance.in': q.time}}
        }else{
            setd = {$set:{'attendance.out': q.time}}
        }
        let d = await collection.updateOne(
            {date:parseInt(xDate), 'attendance.name': q.name},
            setd,
            {upsert:true}
        );
        //console.log('update-result', d)
    }catch(err){
        console.log(err);
    }finally{
        try{
            console.log('attendance-read-pass')
            client.close();
        }catch(err){
            console.log(err)
        }
    }
}
*/

/**
 * 勤怠アテンダンスwrite
 * 
 * upsert: trueで初書き込みもこの関数で実行できる
 * 
 * 
 * @param {*} dbName 
 * @param {*} colName 
 * @param {*} date 
 * @param {*} q 
 */
var writeAttendance = async(dbName, colName, date, q) => {
    var client;
    console.log('write-data',q)
    try{
        client = await mongodb.MongoClient.connect(MONGOINFO.url, {useNewUrlParser:true}, {useUnifiedTopology: true} );
        const db = await client.db(dbName);
        const collection = await db.collection(colName);
        const xDate = date
        let dd = await collection.find({date:date}).toArray();
        console.log('dd', dd, typeof(dd))
        if(dd.length === 0){
            var today = false
        }else{
            var today = getTodayAttendance(dd, date)
        }
        console.log('today-', today)// attendance配列
        let match = false
        if(today !== false){
            today.forEach((x) => {
                console.log('hikaku-', x.name)
                if(x.name === q.name){
                    match = true
                }
            })
        }

        if(match === false){
            console.log('new',match)
            //新規
            let d = await collection.updateOne(
                {date:xDate},
                //{$set:{'attendance':q}},
                //{$push:{'attendance':q}},
                {$addToSet:{'attendance':{name:q.name,in:q.in,out:q.out}}},
                {upsert:true}
            );
        }else{
            //既存にupsert
            console.log('upsert', match)
            let d = await collection.updateOne(
                {date:xDate, 'attendance.name': q.name },
                {$set:{'attendance.$.in': q.in, 'attendance.$.out': q.out}},
            );
        }

        


    }catch(err){
        console.log(err);
    }finally{
        try{
            console.log('attendance-read-pass')
            client.close();
        }catch(err){
            console.log(err)
        }
    }
}

/**
 * 本日の出退勤データを探す
 * 
 * @param {*} d = [{day:'',sches:[]},....]
 */
function getTodayMsche(d, date){
    if(d.length === 0){
        return false
    }
    var today = {}
    d.forEach( (x) => {
        if(x.day === date){
            today = x.sches
        }
    })
    return today
}
/**
 * day atenndance, day msche both read
 * 
 * 
 * @param {*} dbName 
 * @param {*} col_atten 
 * @param {*} col_msche 
 * @param {*} xdate      string
 * @param {*} socket 
 * @param {*} eventName 
 */
var readAttendanceScheDay = async(dbName, col_atten, col_msche, xdate, socket, eventName) => {
    var client;
    try{
        client = await mongodb.MongoClient.connect(MONGOINFO.url, {useNewUrlParser:true}, {useUnifiedTopology: true} );
        const db = await client.db(dbName);
        let collection = await db.collection(col_atten);
        let d = await collection.find({date: xdate}).toArray();

        if(d.length === 0){
            var today = []
        }else{
            var today = getTodayAttendance(d, xdate)
        }
        console.log('attendance-today', today)
        collection = await db.collection(col_msche);
        d = await collection.find({day: xdate}).toArray();
        if(d.length === 0){
            var todayMs = []
        }else{
            var todayMs = getTodayMsche(d, xdate)
        }
        console.log('staffSche-today', todayMs)
        socket.emit(eventName, {sche: todayMs, attendance: today})
    }catch(err){
        console.log(err);
    }finally{
        try{
            console.log('attendance-read-pass')
            client.close();
        }catch(err){
            console.log(err)
        }
    }
}


/**
 * attendance interface
 */
var mongoAttendance = {
    readAttendance: (appDate, name, socket) => {
        const colName = 'attend_' + appDate.year.toString() + appDate.month.toString().padStart(2,'0');
        readAttendance('shushu', colName, appDate, name, socket, 'READ_ATTENDANCE_RESULT')
    },
    writeAttendance: (obj, socket) => {
        const colName = 'attend_' + obj.appDate.year.toString() + obj.appDate.month.toString().padStart(2,'0');
        console.log('obj.q', obj)
        writeAttendance('shushu', colName, obj.appDate.date.toString(), obj.d)
    },
    readAttendanceScheDay: (appDate, socket) => {
        console.log(appDate)
        const col_attend = 'attend_' + appDate.year.toString() + appDate.month.toString().padStart(2,'0');
        const col_msche = 'ms_' + appDate.year.toString() + appDate.month.toString().padStart(2,'0');
        readAttendanceScheDay('shushu', col_attend, col_msche, appDate.date.toString(), socket, 'READ_ATTENDANCE_SCHE_DAY_RESULT')        
    }
}



module.exports = mongoAttendance;