/**
 * 
 * @param {*} socket 
 */
const mongoAsync = require('../mongoif/mongoAsync.js');
const MONGOINFO = require('../config/config.js').MONGOINFO;
const mongoSync = require('../mongoif/mongoSync.js');
const mongoAttendance = require('../mongoif/mongoAttendance.js')
//const readSource = require('../pointCalc/readSource.js');


console.log(MONGOINFO)




/**
 * 
 * @param {*} num 
 * @param {*} socket 
 */
function readLimit(num, socket){
    const db = MONGOINFO.db.name;
    const col = MONGOINFO.db.collection.customer;
    console.log(db, col, num)
    mongoAsync.readLimit(db, col, num, socket);
}
/**
 * 
 * @param {*} socket 
 */
function scheEvent(socket){
    /**
     * 
     */
    socket.on('TEST', (s) => {
        console.log(s)
        socket.emit('TEST-RETURN', 'test message recieved!!!')
    })
    /**
     * 
     */
    socket.on('READ_LIMIT', (num) => {
        //console.log('READ_LIMIT', num)
        readLimit(num, socket)
    });
    /**
     * 
     */
    socket.on('READ_SCHE_RESERVE', (yearMonth) => {
        //console.log(yearMonth)
    });
    /**
     * 
     */
    socket.on('READ_CUSTOMER', () => {
        mongoAsync.readCustomer(socket)
    });
    socket.on('READ_CSCHE', (yearMonth) => {
        mongoAsync.readCusSche(yearMonth, socket)
    });
    /**
     * mongo csche re-write
     * 
     * x = {d: d, appDate: {year:num, month: num, date: mum}}
     */
    socket.on('WRITE_SCHE', (x) => {
        mongoAsync.writeCusSche(x);
    });
    /**
     * 
     */
    socket.on('READ_STAFF', () => {
        mongoAsync.readStaff(socket)
    });
    socket.on('READ_SSCHE', (yearMonth) => {
        mongoAsync.readStaffSche(yearMonth, socket)
    });
    /**
     * 配車データイベント
     */
    /**
     * 配車データ保存
     */
    socket.on('WRITE_HAISHA', (x) => {
        console.log(x)
    });
    /**
     * 配車データ読み出し
     */
    socket.on('REQ_HAISHA', (x) => {
        console.log('req-haisha')
        mongoAsync.readReqHaisha(x, socket)
    });
    /**
     * 配車データ新規作成
     */
    socket.on('HAISHA_NEW', (x) => {
        console.log('haisha-new', x)
        mongoAsync.writeHaishaNew(x, socket)
    }),
    /**
     * 配車データアップデート
     */
    socket.on('WRITE_HAISHA', (x) => {
        console.log('write-haisha', x)
        mongoAsync.writeHaisha(x, socket)
    }),
    /**
     * カレンダデータセット読み込み
     * メンバ、メンバスケジュール、
     */
    socket.on('READ_CALENDER_ALL', (appDate) => {
        console.log('read-calendar-all----------------------'. appDate)
        mongoAsync.readCalendarAll(appDate, socket)
    });
    /**
     * 出退勤データの読み込み
     * 
     * obj = {appDate:'', name:''}
     */
    socket.on('READ_ATTENDANCE', (obj) => {
        let appDate = obj.appDate
        let name = obj.name
        mongoAttendance.readAttendance(appDate, name, socket)
    });
    /**
     * 出退勤データの書き込み
     * 
     * obj = {appDate: , q:{name:'', inout:'', time:''}}
     * 
     */
    socket.on('WRITE_ATTENDANCE', (obj) => {
        mongoAttendance.writeAttendance(obj, socket)
    }),
    /**
     * attendance & staff-sche one day
     */
    socket.on('READ_ATTENDANCE_SCHE_DAY', (appDate) => {
        mongoAttendance.readAttendanceScheDay(appDate, socket)
    })
}

module.exports = scheEvent;