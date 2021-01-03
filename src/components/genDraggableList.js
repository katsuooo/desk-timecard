/**
 * 
 * ドラッガブルなリストの作成
 * 
 * 
 */
/**
 * 
 * desired_holidayは設定されたことがないと存在しない。
 * 設定後にオフすると
 * desired_holiday = falseになると思われる。
 */
import sortByTime from './sortByTime.js'
/**
 * スタッフにママを追加
 * 
 * 
desired_etime: "14:00"
desired_stime: "09:00"
etime: "17:00"
fixed: false
holiday: false
name: "山下 可奈子"
order: 1
place: "カシュカシュ"
stime: "08:30"
 * 
 * 
 */
function addMama(ms){
    const orderNum = ms.length + 1
    let mama = {
        desired_etime: '',
        desired_stime: '',
        etime:'',
        fixed:false,
        holiday: false,
        name:'ママ',
        order: orderNum,
        place:'',
        stime:''
    }
    ms.push(mama)
    return ms;
}
/**
 * 
 * @param {} ms 
 */
function addPapa(ms){
    const orderNum = ms.length + 1
    let papa = {
        desired_etime: '',
        desired_stime: '',
        etime:'',
        fixed:false,
        holiday: false,
        name:'パパ',
        order: orderNum,
        place:'',
        stime:''
    }
    ms.push(papa)
    return ms;
}
/**
 * csリストからキャンセル設定されている利用者をカットする。
 * 
 * 
 * 
 * @param {} cs 
 */
function cutCsCancel(cs){
    var cutted = []
    if(cs === undefined){
        return cutted
    }
    cs.forEach(s => {
        if(!((s.cancel === 'a')||(s.cancel === 'b') || (s.cancel === 'c'))){
            cutted.push(s)
        }
    })
    return cutted;
}
/**
 * 
 * msリストからホリデー設定されたデータをカットする。
 * desired_holidayはなければOK
 * あれば、trueでなければok
 * desired_horilay あり、trueの場合でもstime != '' の場合は削除しない
 * 
 * @param {*} ms 
 */
function cutMsHoliday(ms){
    var cutted = []
    if (ms === undefined){
        return cutted
    }
    ms.forEach((s) => {
        if(s.holiday === false){
            if('desired_holiday' in s){
                if(s.desired_holiday !== true){
                    cutted.push(s)
                }else if(s.stime !== ""){
                    cutted.push(s)                    
                }
            }else{
                cutted.push(s)
            }
        }
    })
    return cutted
}
/**
 * 比較ロジック
 * 
 * @param {*} a 
 * @param {*} b 
 */
// eslint-disable-next-line no-unused-vars
function compareStime(a, b){
  // Use toUpperCase() to ignore character casing
  const timeA = a.stime.toUpperCase();
  const timeB = b.stime.toUpperCase();

  let comparison = 0;
  if (timeA > timeB) {
    comparison = 1;
  } else if (timeA < timeB) {
    comparison = -1;
  }
  return comparison;
}
/**
 * 比較ロジック
 * 
 * @param {*} a 
 * @param {*} b 
 */
// eslint-disable-next-line no-unused-vars
function compareDesiredStime(a, b){

    const timeA = a.desired_stime.toUpperCase();
    const timeB = b.desired_stime.toUpperCase();
  
    let comparison = 0;
    if (timeA > timeB) {
      comparison = 1;
    } else if (timeA < timeB) {
      comparison = -1;
    }
    return comparison;
  }

/**
 * 
 * 時間ソート cs
 * 
 * 
 */
function timeSortCs(list){
    //list.sort(compareStime)
    return list
}

/**
 * 
 * 時間ソート Ms
 * 
 * @param {*} list 
 */
function timeSortMs(list){
    return list
}
/**
 * 
 * ドラッガブルリスト作成
 * 
 * 送り迎えで内容は同じ
 * 編集されるので、別々にコピーしてつかう
 * 
 * @param {} daysche
 */
function genList(daySche){
    // eslint-disable-next-line no-unused-vars
    var list = []
    let cs = [];
    let ms = [];
    cs = timeSortCs(daySche.cs)
    ms = timeSortMs(daySche.ms)
    if(daySche.cs !== undefined){
        cs = daySche.cs.map((sche, index) => {
            let csx = JSON.parse(JSON.stringify(sche))
            csx.order = index + 1;
            csx.fixed = false;
            return csx;
        })
    }
    if(daySche.ms !== undefined){
        ms = daySche.ms.map((sche, index) => {
            let msx = JSON.parse(JSON.stringify(sche))
            msx.order = index + 1;
            msx.fixed = false;
            return msx;
        })
    }
    if((cs !== null)||(cs !== undefined)){
        cs = cutCsCancel(cs)
    }else{
        cs = {}
    }
    cs = sortByTime.sortByTime(cs)

    if(ms !== null){
        ms = cutMsHoliday(ms)
        ms = addMama(ms);
        ms = addMama(ms);
        ms = addPapa(ms);
        ms = addPapa(ms);
    }else{
        ms = {}
        ms = addMama(ms);
        ms = addMama(ms);
        ms = addPapa(ms);
        ms = addPapa(ms);
    }
    ms = sortByTime.sortByTime(ms)
    let ms2 = []
    let start_index = ms.length
    if(ms !== undefined){
        // eslint-disable-next-line no-unused-vars
        ms2 = ms.map((sche,index) => {
            let msx = JSON.parse(JSON.stringify(sche))
            msx.order = start_index++ + 1;
            msx.fixed = false;
            return msx;
        })
    }

    return {cs: cs, ms: ms, ms2:ms2}
}




export default{
    genList: genList,
    cutMsHoliday: cutMsHoliday
}