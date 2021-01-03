/*
 socket manager
*/
//var memoEvent = require('./events/memoEvent.js');
var scheEvent = require('./events/scheEvent.js')
console.log('socket-manager')


function socketManager(server){
    io = require('socket.io')(server);
    io.on('connection', function(socket){
        scheEvent(socket)
    });
};



module.exports = socketManager;