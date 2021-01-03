<template>
    <div style='margin-bottom: 18px;'>
        <!-- <h6>本日のスタッフさん</h6> -->
        <!-- table
        <div style='display:inline;'>
            <table class='table table-bordered table-sm table-striped table-hover' style='display:inline; margin-left:15px; border-color:#101010' v-for='(xx, index) in scheList' :key="index" >
                <tr v-for='(x,index) in xx' :key="`x.name-${index}`" >
                    <td class='ttext'>
                        {{x.name}}
                    </td>
                    <td class='ttext'>
                        {{x.time}}
                    </td>
                </tr>
            </table>
        </div>
        -->
        <div style='display:inline;'>
            <div style='display:inline;' v-for='(x, index) in scheList' :key="index" >

                    <span class='badge rounded-pill' style='font-size: 0.8rem;bo'
                        v-bind:class='checkPlace(x.place, x.state)'
                    >
                        {{x.name}} {{x.time}}
                    </span>
            </div>
        </div>
        <hr />
    </div>
</template>

<script>
/**
 * スタッフリストをTOP部に表示する。
 * 
 * データは保存せず、都度カレンダーから読み込む
 * 
 */
import genDraggableList from '@/components/genDraggableList.js'
import chou2Color from '@/components/chou2Color.js'
import staffFilter from '@/components/staffFilter.js'

/*
function getToday(sche, appDate){
    var today;
    sche.forEach( (s) => {
        if(s.day === appDate.date.toString()){
            today = JSON.parse(JSON.stringify(s.sches))
        }
    })
    return today;
}
*/
/**
 * 
 * staff listに存在するかチェック
 * 
 * 
 */
function checkName(name, ssche){
    let match = false
    ssche.forEach((s) => {
        if(staffFilter.formattingName(s.name) === name){
            match = s
        }
    })
    return match
}
/**
 * 
 */
export default {
    data: () => ({
        scheList:[]
    }),
    props:{
    },
    beforeMount(){
        /*
        for(let i=0; i<10; i++){     //6
            var x = []
            for(let j=0; j<2; j++){     //4
                var d = {}
                d.time = ''
                d.name = ''
                x.push(JSON.parse(JSON.stringify(d)))
            }
            this.scheList.push(JSON.parse(JSON.stringify(x)))
        }
        */
    },
    methods:{
        /* 10*2
        loadMemberSche(sche, appDate){
            //this.scheList.length = 0
            var daySche = getToday(sche, appDate)
            daySche = genDraggableList.cutMsHoliday(daySche)
            var xxx = []
            let loop = 1;
            const yoko = 10
            const tate = 2
            for(let i=0; i<yoko; i++){
                var x = []
                for(let j=0; j<tate; j++){
                    const s = daySche[tate*i+j]
                    var d = {}
                    d.time = s.stime + '-' + s.etime
                    d.name = s.name
                    x.push(JSON.parse(JSON.stringify(d)))
                    if((daySche.length-1) === (tate*i+j)){
                        loop = 0
                        break;
                    }
                }
                xxx.push(JSON.parse(JSON.stringify(x)))
                if(loop === 0){
                    break;
                }
            }
            this.scheList.length = 0
            for(let i=0; i<xxx.length; i++){
                this.scheList.push(xxx[i])
            }

        }
        */
        loadMemberSche(sche, atten){
            // sche, attenは当日のデータ
            //var daySche = getToday(sche, appDate)
            //daySche = genDraggableList.cutMsHoliday(daySche)
            var daySche = genDraggableList.cutMsHoliday(sche)
            this.scheList.length = 0
            daySche.forEach((d) => {
                this.scheList.push({name: d.name, time: d.stime + '-' + d.etime, place: d.place, state: 'beforeWork'})
            })
            atten.forEach( (a) => {
                this.registerOn(a)
            })
        },
        checkPlace: (place, state) => {
            let color = ''
            if(state === 'startWork'){
                color = chou2Color.checkPlace(place)
            }else if(state === 'beforeWork'){
                color = chou2Color.checkPlaceBeforeWork(place)
            }else{
                color = 'bg-gray'
            }

            return color
        },
        registerOn(r){
            //登録されたときのデータ更新
            let x = checkName(r.name, this.scheList)
            if(x === false){
                //scheduleにない名前の登録、場所情報がないので、noplaceにするか
                if(r.out === ''){
                    this.scheList.push({name: r.name, time: r.in + '-' + 'xx:xx', place: 'noplace', state: 'startWork'})
                }else{
                    this.scheList.push({name: r.name, time: r.in + '-' + r.out, place: 'noplace', state: 'endWork'})                    
                }
            }else{
                if(r.out === ''){
                    x.state = 'startWork'
                    x.time = r.in + '-' + x.time.split('-')[1]
                }else{
                    x.state = 'endWork'
                    x.time = r.in + '-' + r.out
                }
            }
        }
    },
    watch:{
        // eslint-disable-next-line no-unused-vars
        scheList(value, oldValue){
            //this.$forceUpdate()
        }
    }
}
</script>

<style scoped>
.ttext{
    text-align: left;
    font-size: 0.76rem !important;
    color:darkslategrey;
}
.bg-chou2-light{
    /*background-color: #ff1493;*//* 255, 20, 147 */ 
    /*border-color: #ff1493;*/
    /*color: #fff;*/   
    color: #696969;
    /*background-color: rgba(255, 20, 147, 0.2);*/
        background-color: #faf0e6;
    /*border-color: rgba(255, 20, 147, 0.2);*/
    border: solid 1px rgba(255, 20, 147, 0.2);
}
.bg-cache2-light{
    /*background-color: #1e90ff;*/ /* 30, 144, 255*/
    /*border-color: #1e90ff;*/
    /*color: #fff;*/
    color: #696969;
    /*background-color: rgba(30, 144, 255, 0.2);*/
        background-color: #faf0e6;
    /*border-color: rgba(30, 144, 255, 0.2);*/    
    border: solid 1px rgba(30, 144, 255, 0.2); 
}
.bg-lightx-light{
    background-color: #f8f9fa;
    border-color: #f8f9fa;
    color: #343a40;      
}
.bg-gray{
    background-color: #c0c0c0;
    /*border-color: #c0c0c0;*/
    border: solid 1px #c0c0c0; 
    color: #fff;   
}
.bg-noplace{
    /*
    background-color: #7cfc00;
    border-color: #7cfc00;
    color: #a9a9a9;   
    */
    background-color: rgba(0,100,0,0.8);
    border-color: rgba(0,100,0,0.8);
    color: #fff;   
}
</style>
