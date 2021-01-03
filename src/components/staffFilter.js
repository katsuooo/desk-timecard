/**
 * 
 * スタッフリストの整形
 * 
 * 
 * 
 */
import moment from 'moment'

/**
 * hasOwnProperty ESLINT版
 * 
 * 
 * @param {*} obj 
 * @param {*} key 
 */
function hasOwnProperty(obj, key){
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
        return true
    }
    return false
}
/**
 * 
 * 名前のスペースを削除
 * 
 * @param {*} name 
 */
function formattingName(name){
    while(name.includes(' ')){
        name = name.replace(' ', '')
    }
    while(name.includes('　')){
        name = name.replace('　', '')
    }
    return name
}
/**
 * 退職者をリストから取り除く
 * 
 * s.taishobi = ?
 * 
 * スタッフの退職日データは、まだ作成されていない。
 * 名前のスペースを削除し、名前のみのリストを返す。
 * 
 * @param {*} mems
 */
function rejectTaishokusha(mems){
    var newh = []
    mems.forEach((m) => {
        if(hasOwnProperty(m, 'taishoku_date')){
            var taishokubi = moment(m.taishoku_date)
            var today = moment(new Date())
            if(taishokubi.isBefore(today)){
                //退職済み
            }else{
                newh.push(m)
            }
        }else{
            newh.push(m)
        }
    })
    var newh2 = []
    newh.forEach( (n) => {
        newh2.push(formattingName(n.name))
    })
    return JSON.parse(JSON.stringify(newh2))
}

/**
 * 
 */
export default{
    rejectTaishokusha: rejectTaishokusha,
    formattingName: formattingName
}