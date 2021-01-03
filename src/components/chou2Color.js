/**
 * 
 * シュシュカラーの制御
 * 
 badge type property

 .bg-chou2{
    background-color: #ff1493;
    border-color: #ff1493;
    color: #fff;  
}
.bg_chache2{
    background-color: #1e90ff;
    border-color: #1e90ff;
    color: #fff;   
}
呼び出し元で定義しておく。
 * 
 * 
 */
/**
 * 
 * 
 * 
 * 
 */
function checkPlace(place){
    if(place === 'シュシュ'){
        return 'bg-chou2'
    }else if(place === 'カシュカシュ'){
        return 'bg-cache2'
    }else if(place === 'noplace'){
        return 'bg-noplace'
    }
    return 'bg-lightx text-dark'
}

function checkPlaceBeforeWork(place){
    if(place === 'シュシュ'){
        return 'bg-chou2-light'
    }else if(place === 'カシュカシュ'){
        return 'bg-cache2-light'
    }
    return 'bg-lightx text-dark'
}
/**
 * 
 */
export default{
    checkPlace: checkPlace,
    checkPlaceBeforeWork: checkPlaceBeforeWork
}