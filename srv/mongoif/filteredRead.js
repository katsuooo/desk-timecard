/*
 filtered read
*/
var mongodb = require('mongodb');
const MONGOINFO = require('../config/config').MONGOINFO;


/**
 * read from mongo/
 * @param {*} dbName 
 * @param {string} colName 
 * @param {*} filter 
 * @param {int} num 
 * @param {obj} socket 
 */
var readLimitAnd = async(dbName, colName, filter, num, socket) => {
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
/*
 lines中のandではなく、line内のandになってる
*/

/**
 * read frome mongo/
 * @param {string} colName 
 * @param {int} num 
 * @param {obj} socket 
 */
var readLimitOr = async(dbName, colName, num) => {
    let client;
    let d;
    try{
        client = await mongodb.MongoClient.connect(MONGOINFO.url, {useNewUrlParser:true});
        const db = await client.db(dbName);
        const collection = await db.collection(colName);
        d = await collection.find({lines: {$in: ['a', 'e']}}).sort({datetime:-1}).limit(num).toArray();
    }catch(err){
        console.log(err);
    }finally{
        client.close();
        console.log(d);
        return d;
    }
}



/**
 * 
 * @param {string} filter 
 * 
 * sample
 * { $and: [{lines: {$in: ['a']}}, {lines: {$in: ['d']}}] }
 */
function genFilter(filter){
    var str = filter.replace(/\s\s+/g, ' ')
    var words = str.split(' ')
    var andHai = []
    words.forEach( (word) => {
        if(word === '') return;
        const wordHai = []
        wordHai.push(word)
        filterJson = {lines: {$in: wordHai}}
        andHai.push(filterJson)
    });
    return { $and: andHai }
}
/**
 * 
 * @param {*} filter 
 * {lines: {$in: ['a', 'e']}}
 */
function genFilterOr(filter){
    var str = filter.replace(/\s\s+/g, ' ')
    var words = str.split(' ')
    var orHai = []
    words.forEach( (word) => {
        if(word === '') return;
        orHai.push(word)
    });
    return { lines: {$in: orHai} }
}
/**
 * 
 * @param {*} filter 
 * {$and: [{lines: {$regex: /python/, $options: 'i'}}, {lines: {$regex: /windows/, $options: 'i'}}]}
 */
function genFilterAnd(filter){
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
        filterJson = {lines: {$regex: ".*"+word+".*", $options: 'i'}}
        andHai.push(filterJson)
    });
    return { $and: andHai }
}
/**
 * 
 * @param {*} dbName 
 * @param {*} colName 
 * @param {filter:string, num:int} param 
 * @param {*} socket 
 */
function filteredRead(dbName, colName, param, socket){
    //console.log(param);
    const filter = genFilterAnd(param.filter);
    //console.log(filter.$and[0], filter.$and[1])
    console.log(filter)
    readLimitAnd(dbName, colName, filter, param.num, socket)
}

module.exports = filteredRead;
