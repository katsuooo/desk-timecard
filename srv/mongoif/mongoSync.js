/**
 * mongo sync
 */
const MONGOINFO = require('../config/config.js').MONGOINFO;

var MONGO_URL="mongodb://localhost:27017/";
var mongodb = require('mongodb'), MongoClient = mongodb.MongoClient;

/**
 * read custoemr
 */
function readCustomer(){
    MongoClient.connect(MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}, function(err) {
        if(err){
            return console.error(err);
        }
        const db = client.db('shushu')
        const collection = db.collection('customer');
        collection.find({}).toArray(function(err, docs) {
            if (err) {
                return console.error(err);
            };
            docs.forEach(function(doc) {
                console.log('found document: ', doc);
            });
            db.close();
        //io.emit('set_customers', docs);
        });
    });
}
/**
 * 
 */
var mongoSync = {
    readCustomer: readCustomer
}
module.exports = mongoSync