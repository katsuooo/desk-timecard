/*
 filter from date
*/
var mongodb = require('mongodb');
const MONGOINFO = require('../config/config').MONGOINFO;
var moment = require('moment')

/**
 * read from mongo/
 * @param {*} dbName 
 * @param {string} colName 
 * @param {*} filter 
 * @param {int} num 
 * @param {obj} socket 
 */
var readLimitDate = async(dbName, colName, filter, num, socket) => {
    let client;
    let d;
    try{
        client = await mongodb.MongoClient.connect(MONGOINFO.url, {useNewUrlParser:true});
        const db = await client.db(dbName);
        const collection = await db.collection(colName);
        //find({ $and: [{lines: {$in: ['a']}}, {lines: {$in: ['b']}}] })
        d = await collection.find(filter).sort({datetime:-1}).limit(num).toArray();
        socket.emit('READLIMIT_RESULT', d);
    }catch(err){
        console.log(err);
    }finally{
        client.close();
        //console.log(d);
    }
}

/**
 * 
 * @param {*} filter 
 * {$and: [{lines: {$regex: /python/, $options: 'i'}}, {lines: {$regex: /windows/, $options: 'i'}}]}
 */
function genFilterDate(filter){
    var str = filter.replace(/\s\s+/g, ' ')     //space reduce to 1
    var words = str.split(' ')
    var checkedWords = []
    words.forEach( (word) => {
        if (word !== ''){
            checkedWords.push(word)
        }
    })
    var andHai = []
    checkedWords.forEach( (word) => {
        let momentstr = moment(word).format()
        let datestr = momentstr.split('T')[0]
        filterJson = {datetime: {$regex: ".*"+datestr+".*", $options: 'i'}}
        andHai.push(filterJson)
    });
    return { $and: andHai }
}
/**
 * exports
 * 
 * @param {*} dbName 
 * @param {*} colName 
 * @param {*} param 
 * @param {*} socket 
 */
function filterFromDate(dbName, colName, param, socket){
    const filter = genFilterDate(param.filter);
    console.log(filter)
    readLimitDate(dbName, colName, filter, param.num, socket)
}

module.exports = filterFromDate;
