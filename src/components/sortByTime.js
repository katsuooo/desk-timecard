/**
 * 
 * 時間でソート
 * 
 * 
 * 
 */
/**
 * 
 * print list
 * 
 */
// eslint-disable-next-line no-unused-vars
function plist(list){
    // eslint-disable-next-line no-unused-vars
    list.forEach((x) => {

    })
}
/**
 * check time value
 * 
 * 
 * @param {*} mojiretsu 
 */
function checkval(mojiretsu){
    if((mojiretsu === undefined) ||
       (mojiretsu === '-') ||
       (mojiretsu === null) ||
       (mojiretsu === '')){
          return '20:00' 
    }else{
        return mojiretsu;
    }
}
/**
 * 昇順ならべかえ
 * 
 */
function ascendingOrder(a, b){
    const aDate = new Date()
    var x = a.stime;
    if((x === undefined) || (x === null) || (x == '')){
        x = a.desired_stime
    }else if(x !== undefined){
        if(x.includes('-')){
            x = a.desired_stime
        } 
    }
    x = checkval(x)
    aDate.setHours(x.split(':')[0])
    aDate.setMinutes(x.split(':')[1])
    const bDate = new Date()
    x = b.stime
    if((x === undefined) || (x === null) || (x == '')){
        x = b.desired_stime
    }else if(x !== undefined){
        if(x.includes('-')){
            x = b.desired_stime
        } 
    }
    x = checkval(x)
    bDate.setHours(x.split(':')[0])
    bDate.setMinutes(x.split(':')[1])
    return aDate.getTime() - bDate.getTime();    
}
/**
 * 昇順ならべかえ
 * 
 */
function ascendingOrderEtime(a, b){
    const aDate = new Date()
    var x = a.etime;
    if((x === undefined) || (x === null) || (x == '')){
        x = a.desired_etime
    }else if(x !== undefined){
        if(x.includes('-')){
            x = a.desired_stime
        } 
    }
    x = checkval(x)
    aDate.setHours(x.split(':')[0])
    aDate.setMinutes(x.split(':')[1])
    const bDate = new Date()
    x = b.etime;
    if((x === undefined) || (x === null) || (x == '')){
        x = b.desired_etime
    }else if(x !== undefined){
        if(x.includes('-')){
            x = b.desired_stime
        } 
    }
    x = checkval(x)
    bDate.setHours(x.split(':')[0])
    bDate.setMinutes(x.split(':')[1])
    return aDate.getTime() - bDate.getTime();    
}
/**
 * オブジェクトリストを時間でソート
 * 
 * null, undefinedならそのまま帰す。
 * 
 * 
 * @param {*} objList 
 */
function sortByTime(objList){
    if((objList === undefined) || (objList === null) || (objList == '')){
        return x;        
    }
    var x = objList.sort(ascendingOrder)
    return x
}
/**
 * 
 * @param {*} objList 
 */
function sortByTimeEtime(objList){
    var x = objList.sort(ascendingOrderEtime)    
    return x
}

/**
 * 昇順ならべかえ
 * 
 */
function ascendingOrderMukaeTime(a, b){
    const aDate = new Date()
    a.mukae_time = checkval(a.mukae_time)
    aDate.setHours(a.mukae_time.split(':')[0])
    aDate.setMinutes(a.mukae_time.split(':')[1])
    const bDate = new Date()
    b.mukae_time = checkval(b.mukae_time)
    bDate.setHours(b.mukae_time.split(':')[0])
    bDate.setMinutes(b.mukae_time.split(':')[1])
    return aDate.getTime() - bDate.getTime();    
}
/**
 * 
 * @param {*} objList 
 */
function sortByMukaeTime(objList){
    if((objList === undefined) || (objList === null) || (objList == '')){
        return x;        
    }
    var x = objList.sort(ascendingOrderMukaeTime)    
    return x
}
/**
 * mongoに保存した配車データのソード
 * mukae_time でソート
 * 
 * x = {cs:[], ms:[], ms2[]}
 * 
 */
function sortHaishaMukae(x){
    var cs = sortByMukaeTime(x.cs)
    var ms = sortByTime(x.ms)
    var ms2 = sortByTime(x.ms2)
    return {cs:cs, ms:ms, ms2:ms2}
}



/**
 * 昇順ならべかえ
 * 
 */
function ascendingOrderArraivalTime(a, b){
    const aDate = new Date()
    a.arrival_time = checkval(a.arrival_time)
    //if(a.arraibal_time === )
    aDate.setHours(a.arrival_time.split(':')[0])
    aDate.setMinutes(a.arrival_time.split(':')[1])
    const bDate = new Date()
    b.arrival_time = checkval(b.arrival_time)
    bDate.setHours(b.arrival_time.split(':')[0])
    bDate.setMinutes(b.arrival_time.split(':')[1])
    return aDate.getTime() - bDate.getTime();    
}
/**
 * 
 * @param {*} objList 
 */
function sortByArraibalTime(objList){
    var x = objList.sort(ascendingOrderArraivalTime)    
    return x
}
/**
 * mongoに保存した配車データのソード
 * arrival_time でソート
 * 
 * msはstimeでソート
 * 
 * x = {cs:[], ms:[], ms2[]}
 * 
 */
function sortHaishaOkuri(x){
    var cs = sortByArraibalTime(x.cs)
    var ms = sortByTimeEtime(x.ms)
    var ms2 = sortByTimeEtime(x.ms2)
    return {cs:cs, ms:ms, ms2:ms2}
}
/**
 * 
 */
export default{
    sortByTime: sortByTime,
    sortByTimeEtime: sortByTimeEtime,
    sortHaishaMukae: sortHaishaMukae,
    sortHaishaOkuri: sortHaishaOkuri
}