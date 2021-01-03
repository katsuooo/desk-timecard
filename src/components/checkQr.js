/**
 * 
 * qrcode文字列のチェック
 * スタッフリスト文字列に含まれるかチェックする
 * 
 * 
 */
import moment from 'moment'
/**
 * 直近データ
 */
let lastVal = {name:'', time:''}

/**
 * 
 * 最新入力データを保存する。
 * 
 * @param {*} name 
 */
function setLastVal(name){
    lastVal.name = name
    lastVal.time = moment()
}
/**
 * 
 * 同じ名前の場合は１分以上のブランクをとる。
 * 
 */
function checkDuplication(name){
    if(lastVal.name === name){
        if(lastVal.time === ''){
            //初期状態 初回データ入力
            setLastVal(name)
            return false
        }
        let diffx = moment().diff(lastVal.time).valueOf()
        console.log('diffx', diffx)
        //if(diffx <= 60000) {
        if(diffx <= 3000) {
            console.log('duplication-error-')
            return true 
        }
    }
    setLastVal(name)
    return false
}
/**
 * 同一名タイムアウトチェック
 * 
 * チェックのみで時間のセットは行わない
 * エラーでない場合(return false)は、再度値設定つきの上の関数が呼ばれる
 * 
 * @param {*} name 
 */
function checkDuplicationNoTimeSet(name){
    if(lastVal.name === name){
        if(lastVal.time === ''){
            //初期状態 初回データ入力
            return false
        }
        let diffx = moment().diff(lastVal.time).valueOf()
        console.log('diffx', diffx)
        //if(diffx <= 60000) {
        if(diffx <= 3000) {
            console.log('duplication-error-')
            return true 
        }
    }
    return false
}
/**
 * nameがリスト内に存在するかチェック
 * リストの名前はスペースを削除している。
 * 
 * @param {*} name 
 * @param {*} list 
 */
function checkName(name, list){
    if(checkDuplication(name)){
        return false
    }
    let match = false
    list.forEach( (l) => {
        if(l === name){
            match = true
        } 
    })
    return match
}

/**
 * 
 */
export default {
    checkName: checkName,
    checkDuplicationNoTimeSet: checkDuplicationNoTimeSet
}