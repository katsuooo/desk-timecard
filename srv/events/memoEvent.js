/*
*/
const mongoAsync = require('../mongoif/mongoAsync.js');
const MONGOINFO = require('../config/config.js').MONGOINFO;
const filterAnalisys = require('./filterAnalisys.js')
console.log(MONGOINFO)

/**
 * mongo read specific number with socket.emit
 * 
 * @param {*} num 
 * @param {*} socket 
 */
function readLimit(num, socket){
    const db = MONGOINFO.db1.name;
    const col = MONGOINFO.db1.collection.memo;
    mongoAsync.readLimit(db, col, num, socket);
}
/**
 * mongoEvent exports
 * 
 * @param {obj} socket 
 */
function memoEvent(socket){
    /**
     * read limit
     */
    socket.on( 'READLIMIT', (num) => {
        console.log('READ_LIMIT', num)
        readLimit(num, socket)
    });
    /**
     * 
     */
    socket.on('UPSERT_ONE', (memo) => {
        const db = MONGOINFO.db1.name;
        const col = MONGOINFO.db1.collection.memo;
        mongoAsync.upsertOne(db, col, socket, memo);
    });
    /**
     * add new memo
     * 
     * after write, emit _id
     */
    socket.on('ADD_NEW_ONE', (memo) => {
        console.log('add_new_one');
        const db = MONGOINFO.db1.name;
        const col = MONGOINFO.db1.collection.memo;
        mongoAsync.addNewOne(db, col, socket, memo);
    });
    /**
     * detete one memo by id
     */
    socket.on('DELETE_ONE', (id) => {
        console.log('delete_one', id)
        const db = MONGOINFO.db1.name;
        const col = MONGOINFO.db1.collection.memo;
        mongoAsync.deleteOne(db, col, socket, id);
    });
    /**
     * filter string
     * 
     * param : {filter: filter-string, num: read_size}
     */
    socket.on('FILTER_STRING', (param) => {
        console.log('FILTER_STRINT', param);
        const db = MONGOINFO.db1.name;
        const col = MONGOINFO.db1.collection.memo;
        if(param.filter === ''){
            readLimit(param.num, socket)
        }else if(filterAnalisys.checkDate(param.filter)){
            console.log('date string')
            mongoAsync.filterFromDate(db, col, param, socket)
        }else{
            mongoAsync.filteredRead(db, col, param, socket);
        }
    });
};


module.exports = memoEvent;