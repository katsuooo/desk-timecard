/**
 * 
 * 退会利用者データのカット
 * 
 * 
 * 
 */

const moment = require('moment');
/**
 * 
 * taisho-bi が当月の場合、表示オフしない
 * return true
 * 
 * 今月1日より前なら、表示しない。
 * 今月1日以降なら、表示する
 *
 * taisho_bi : 登録された退所日(date) 
 */
function checkTougetu(taisho_bi){
    var moment_taisho_bi = moment(taisho_bi);
    var moment_thisMonth_start = moment().startOf('month');
    if(moment_taisho_bi.isAfter(moment_thisMonth_start)){
        return true;
    }
    return false;
}
/**
 * ng-if function
 * 
 * view_check : 退所者を表示するcheck-boxのcheck状態
 * taisho_bi  : カスタマ個人データの退所日データ 
 */
function judge_taisho_view(view_check, taisho_bi){
    if(view_check){
        return true;
    }else{
        if(typeof(taisho_bi) !== 'string'){
            return true
        }else if(taisho_bi === ''){
            return true
        }else if(checkTougetu(taisho_bi)){
            return true
        }
    }
    return false;
}
/**
 * 退所者データをカット
 * 
 * @param {*} customers 
 */
function cutLeaver(customers){
    var reduced = [];
    customers.forEach( (customer) => {
        if(judge_taisho_view(false, customer.taishobi)){
            reduced.push(customer);
        }
    });
    return reduced;
}

module.exports = cutLeaver;
