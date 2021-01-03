/*
 config if
*/
var fs = require('fs');
var yaml = require('js-yaml');
var CONFIG = '';
try {
    //CONFIG = yaml.safeLoad(fs.readFileSync('./srv/config/memoConfig.yaml'));
    CONFIG = yaml.safeLoad(fs.readFileSync('./srv/config/scheConfig.yaml'));    
}catch (e){
    console.log(e);
}
//console.log(CONFIG.mongodb);

module.exports = {
    MONGOINFO: CONFIG.mongodb,
    CONFIG: CONFIG
}