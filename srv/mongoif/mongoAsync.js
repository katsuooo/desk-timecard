/*
 mongo async
*/
var mongodb = require('mongodb');
const MONGOINFO = require('../config/config').MONGOINFO;
const filteredRead = require('./filteredRead');
const filterFromDate = require('./filterFromDate')
const cutLeaver = require('./cutLeaver')


/**
 * read frome mongo/
 * @param {string} colName 
 * @param {int} num 
 * @param {obj} socket 
 */
var readLimit = async(dbName, colName, num, socket) => {
    var client;
    try{
        client = await mongodb.MongoClient.connect(MONGOINFO.url, {useNewUrlParser:true});
        const db = await client.db(dbName);
        const collection = await db.collection(colName);
        let d = await collection.find({}).sort({datetime:-1}).limit(num).toArray();
        socket.emit('READ_LIMIT_RESULT', d);
        console.log(dbName, colName, d);
    }catch(err){
        console.log(err);
    }finally{
        try{
            console.log('pass')
            client.close();
        }catch(err){
            console.log(err)
        }
    }

}
/**
 * 
 * @param {String} db 
 * @param {String} col 
 * @param {Object} socket 
 * @param {Object} memo 
 * memo = {_id:'',datetime:YYYY-MM-DDThh:mm:ss,text:''}
 * memo.text convto lines by split('\n')
 */
async function upsertOne(dbName, colName, socket, memo){ 
    //const shapedMemo = shapeMemo(memo);
    const objectid = new mongodb.ObjectID(memo._id);
    delete memo._id;
    memo._id = objectid;
    let client;
    try{
        client = await mongodb.MongoClient.connect(MONGOINFO.url, {useNewUrlParser:true},{ useUnifiedTopology: true } );
        const db = client.db(dbName);
        const collection = db.collection(colName);
        const d = await collection.updateOne({_id:memo._id}, {$set: {lines: memo.lines, datetime: memo.datetime}});
    }catch(err){
        console.log(err);
    }finally{
        client.close();
    }
}
/**
 * 
 * 
 * 
 * @param {*} dbName 
 * @param {*} colName 
 * @param {*} socket 
 * @param {*} memo 
 */
async function addNewOne(dbName, colName, socket, memo){
    let client;
    delete memo._id;
    try{
        client = await mongodb.MongoClient.connect(MONGOINFO.url, {useNewUrlParser:true},{ useUnifiedTopology: true } );
        const db = client.db(dbName);
        const collection = db.collection(colName);
        const d = await collection.insertOne(memo);
        //console.log(d.insertedId);
        socket.emit('NEW_ID', d.insertedId);
    }catch(err){
        console.log(err);
    }finally{
        client.close();
    }
}
/**
 * 
 * @param {String} dbName 
 * @param {String} colName 
 * @param {object} socket 
 * @param {String} id 
 */
async function deleteOne(dbName, colName, socket, id){
    const idjson = {_id: new mongodb.ObjectID(id)};
    let client;
    try{
        client = await mongodb.MongoClient.connect(MONGOINFO.url, {useNewUrlParser:true},{ useUnifiedTopology: true } );
        const db = client.db(dbName);
        const collection = db.collection(colName);
        const d = await collection.deleteOne(idjson);
    }catch(err){
        console.log(err);
    }finally{
        client.close();
    }
}
/**
 * 
 * @param {*} dbName 
 * @param {*} colName 
 * @param {*} num 
 * @param {*} socket 
 */
var readALL = async(dbName, colName, socket, eventName) => {
    var client;
    //var readData;
    try{
        client = await mongodb.MongoClient.connect(MONGOINFO.url, {useNewUrlParser:true},{ useUnifiedTopology: true } );
        const db = await client.db(dbName);
        const collection = await db.collection(colName);
        let d = await collection.find({}).toArray();
        socket.emit(eventName, d);
    }catch(err){
        console.log(err);
    }finally{
        try{
            console.log('pass')
            client.close();
        }catch(err){
            console.log(err)
        }
    }
}

/**
 * リードカスタマーのち、退所者データをカット
 * 
 * @param {*} dbName 
 * @param {*} colName 
 * @param {*} num 
 * @param {*} socket 
 */
var readCustomerAndCutLeaver = async(dbName, colName, io, eventName) => {
    var client;
    //var readData;
    try{
        client = await mongodb.MongoClient.connect(MONGOINFO.url, {useNewUrlParser:true},{ useUnifiedTopology: true } );
        const db = await client.db(dbName);
        const collection = await db.collection(colName);
        let d = await collection.find({}).toArray();
        let reduced = cutLeaver(d);
        socket.emit(eventName, reduced)
    }catch(err){
        console.log(err);
    }finally{
        try{
            client.close();
        }catch(err){
            console.log(err)
        }
    }
}
/**
 * 
 */
//var readSource = require('../pointCalc/readSource.js');


/**
 * カスタマデータの削除と書き込み
 * 
 * drop & insert many
 * 
 * 
 * 
 * @param {*} dbName 
 * @param {*} colName 
 * @param {*} io 
 * @param {*} eventName 
 */
var writeCusSche = async(d, dbName, colName) => {
    var client;
    //var readData;
    try{
        client = await mongodb.MongoClient.connect(MONGOINFO.url, {useNewUrlParser:true},{ useUnifiedTopology: true } );
        const db = await client.db(dbName);
        const collection = await db.collection(colName);
        await collection.drop()
        await collection.insertMany(d)
        //readData = d
        //console.log(dbName, colName, d);
    }catch(err){
        console.log(err);
    }finally{
        try{
            console.log('pass')
            client.close();
        }catch(err){
            console.log(err)
        }
    }
}
/**
 * 配車データのリード
 * 
 *  {appDate:{$elemMatch:{date:parseInt(appDate.date)}}};
 * @param {*} appDate {year:'2020', month:'9', date:'4', day:'金'}
 * @param {*} socket 
 */
var readReqHaisha = async(dbName, colName, appDate, socket, eventName) => {
    var client;
    try{
        client = await mongodb.MongoClient.connect(MONGOINFO.url, {useNewUrlParser:true},{useUnifiedTopology: true} );
        const db = await client.db(dbName);
        const collection = await db.collection(colName);
        let d = await collection.find({date:appDate.date}).toArray();
        socket.emit(eventName, d[0]);
        console.log(d[0])
    }catch(err){
        console.log(err);
    }finally{
        try{
            console.log('haisha-read-pass')
            client.close();
        }catch(err){
            console.log(err)
        }
    }
}
/**
 * 配車　新規作成
 */

var writeHaishaNew = async(dbName, colName, xHaisha, socket, eventName) => {
    var client;
    try{
        client = await mongodb.MongoClient.connect(MONGOINFO.url, {useNewUrlParser:true},{useUnifiedTopology: true} );
        const db = await client.db(dbName);
        const collection = await db.collection(colName);
        await collection.insertOne(xHaisha);
        console.log('writing-date', xHaisha.appDate.date)
        let d = await collection.find({appDate:{$elemMatch:{date:parseInt(xHaisha.appDate.date)}}}).toArray();
        socket.emit(eventName, d[0]);
    }catch(err){
        console.log(err);
    }finally{
        try{
            console.log('haisha-write-new')
            client.close();
        }catch(err){
            console.log(err)
        }
    }
}
/**
 * 配車　更新 (update)
 * 
 */

var writeHaisha = async(dbName, colName, xHaisha, socket, eventName) => {
    var client;
    try{
        client = await mongodb.MongoClient.connect(MONGOINFO.url, {useNewUrlParser:true},{useUnifiedTopology: true} );
        const db = await client.db(dbName);
        const collection = await db.collection(colName);
        const xDate = xHaisha.appDate.date;
        let d = await collection.updateOne(
            {date:parseInt(xDate)},
            {$set:xHaisha},
            {upsert:true});
        socket.emit(eventName, d[0]);
    }catch(err){
        console.log(err);
    }finally{
        try{
            console.log('haisha-write')
            client.close();
        }catch(err){
            console.log(err)
        }
    }
}
/**
 * 
 * カレンダーデータ４セットをリード
 * ms, cs, 
 * 
 * @param {*} dbName 
 * @param {*} colNames 
 * @param {*} socket 
 * @param {*} eventName 
 */
var readCalendarAll = async(dbName, colNames, socket, eventName) => {
    var client;
    var db;
    var col = {}
    try{
        client = await mongodb.MongoClient.connect(MONGOINFO.url, {useNewUrlParser:true},{useUnifiedTopology: true} );
        db = client.db(dbName);
        const collection = db.collection(colNames.colMemSche);
        let d = await collection.find({}).toArray();
        col.ms = d;
        //console.log('readCalendarAll-msche', d);
    }catch(err){
        console.log(err);
    }
    try{
        const collection = await db.collection(colNames.colCusSche);
        let d = await collection.find({}).toArray();
        col.cs = d;
    }catch(err){
        console.log(err);
    }
    try{
        const collection = await db.collection(colNames.colMember);
        let d = await collection.find({}).toArray();
        col.member = d;
        //console.log('readCalendarAll-member', d);
    }catch(err){
        console.log(err);
    }
    try{
        const collection = await db.collection(colNames.colCustomer);
        let d = await collection.find({}).toArray();
        col.customer = d
        //console.log('readCalendarAll-customer', col.msche[0]);
        socket.emit(eventName, col);
    }catch(err){
        console.log(err);
    }finally{
        try{
            console.log('calendar-all-4col-read-pass')
            client.close();
        }catch(err){
            console.log(err)
        }
    }
}
/**
 *  exports
 */
var mongoAsync = {
    /**
     * 
     */
    readLimit: (dbName, colName, num, socket) => {
        readLimit(dbName, colName, num, socket);  
    },
    /**
     * 
     */
    upsertOne: (db, col, socket, memo) => {
        upsertOne(db, col, socket, memo);
    },
    /**
     * 
     */
    addNewOne: (db, col, socket, memo) => {
        addNewOne(db, col, socket, memo);
    },
    /**
     * 
     */
    deleteOne: (db, col, socket, id) => {
        deleteOne(db, col, socket, id);
    },
    /**
     * read by filter
     */
    filteredRead:(dbName, colName, param, socket) => {
        filteredRead(dbName, colName, param, socket);
    },
    /**
     * read by date filter
     */
    filterFromDate:(dbName, colName, param, socket) => {
        filterFromDate(dbName, colName, param, socket);
    },
    /**
     * 
     */
    readCustomer: (socket) => {
        readCustomerAndCutLeaver('shushu', 'customer', socket, 'READ_CUSTOMER_RESULT');
    },
    /**
     * 
     */
    readCusSche: (yearMonth, socket) => {
        if((yearMonth === null) || (yearMonth.year === null) || (yearMonth.month === null)){
            console.log(yearMonth)
            return
        }
        var colName = 'cs_' + yearMonth.year.toString() + yearMonth.month.toString().padStart(2, '0')
        console.log(colName)
        readALL('shushu', colName, socket, 'READ_CSCHE_RESULT')
    },
    /**
     * 
     */
    writeCusSche: (x) => {
        var colName = 'cs_' + String(x.appDate.year) + ('0' + String(x.appDate.month)).slice(-2)
        //console.log(colName)
        writeCusSche(x.d, 'shushu', colName)
    },
    /**
     * 
     */
    readStaff: (socket) => {
        readALL('shushu', 'member', socket, 'READ_STAFF_RESULT');
    },
    /**
     * 
     * 
     * yearMonth
     * .year = xxxx (int) 西暦４桁
     * .Month = x   (int) int月ナンバー
     */
    readStaffSche: (yearMonth, socket) => {
        if((yearMonth.year === null) || (yearMonth.month === null)){
            console.log(yearMonth)
            return
        }
        var colName = 'ms_' + yearMonth.year.toString() + yearMonth.month.toString().padStart(2, '0')
        console.log(colName)
        readALL('shushu', colName, socket, 'READ_SSCHE_RESULT')
    },
    /**
     * 配車データのリード
     */
    readReqHaisha: (appDate, socket) => {
        const colName = 'haisha_' + appDate.year.toString() + appDate.month.toString().padStart(2,'0');
        console.log('read--------------',colName)
        readReqHaisha('shushu', colName, appDate, socket, 'READ_HAISHA_RESULT');
    },
    /**
     * 新規配車データ
     * 
     *  x = {appDate: appDate, lists...
     */
    writeHaishaNew: (x, socket) => {
        const colName = 'haisha_' + x.appDate.year.toString() + x.appDate.month.toString().padStart(2,'0');
        console.log('new-----------------', colName)
        var xHaisha = JSON.parse(JSON.stringify(x))
        writeHaishaNew('shushu', colName, xHaisha, socket, 'NEW_HAISHA_WRITED');  
    },
    /**
     * 配車データ更新
     * 
     * {date: int} をkeyとする。
     * 
     */
    writeHaisha: (x, socket) => {
        const colName = 'haisha_' + x.appDate.year + x.appDate.month.toString().padStart(2,'0');
        console.log('update----------------', colName)
        const xHaisha = JSON.parse(JSON.stringify(x))
        const xDate = x.appDate.date;
        //var find_key = {x:{appDate:{$elemMatch:{date:parseInt(xDate)}}}};
        writeHaisha('shushu', colName, xHaisha, socket, 'HAISHA_WRITED');  
    },
    /**
     * 
     */
    readCalendarAll: (appDate, socket) => {
        console.log('read-calendar-all-on');
        var colNames = {};
        colNames.colMemSche = 'ms_' + appDate.year.toString() + appDate.month.toString().padStart(2,'0');
        colNames.colCusSche = 'cs_' + appDate.year.toString() + appDate.month.toString().padStart(2,'0');
        colNames.colMember = 'member';
        colNames.colCustomer = 'customer';
        readCalendarAll('shushu', colNames, socket, 'READ_CALENDAR_ALL_COMPLETE');        
    }
}



module.exports = mongoAsync;