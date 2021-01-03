<template>
    <div class='container-fluid'>
        <!--
        <button @click='testOn()' >test</button>
        -->
        <staffList 
            ref='slist'
        />
        <nameView 
            v-bind:register_now='registerNow'
            v-on:REGISTER_VIEW_TIMEOUT='registerViewTimeout'
            ref='nameview'
        />
       
        <assignView  v-bind:xAppDate='appDate' 
                     v-bind:xCarListMukae='carList_mukae'
                     v-bind:xCarListOkuri='carList_okuri'
        />
        <mongodb 
            v-on:READ_MONGO_STAFF='readMongoStaff'
            v-on:READ_MONGO_ATTENDANCE='readMongoAttendance'
            v-on:read_haisha='readHaisha'
            v-on:READ_MONGO_MS='readMongoMs'
            ref='mdb'
        />
        <fr20KeyboardInput 
            v-on:READ_QR='readQr'
        />
        <dateChange
            :appDate='appDate'
            v-on:DATE_CHANGE='dateChangeOn'
            ref='dchange'
        />
    </div>
</template>

<script>
import mongodb from '@/components/mongodb.vue'
import fr20KeyboardInput from '@/components/fr20KeyboardInput.vue'
import staffFilter from '@/components/staffFilter.js'
import checkQr from '@/components/checkQr.js'
import appDate from '@/components/appDate.js'
import nameView from './nameView.vue'
import moment from 'moment'
import assignView from './assignView.vue'
//import checkShutuTaikin from '@/components/checkShutuTaikin.js'
import staffList from './staffList.vue'
import dateChange from '@/components/dateChange.vue'

/**
 * 
["谷川緒弥", "谷朋子", "草間亜希", "木室亜紀", "栗岡さやか", "深田裕美", 
"上坂晴", "岡本典子", "山下可奈子", "松下省子", "湯浅つが", "谷口昌宏", 
"木村さとり", "谷朱美", "安藤", "春本直子", "岡大介", "斎藤", "碓田美保", 
"西川美加", "宇野七生子", "トｩエン", "岩崎智穂美", "内藤康裕", "橘木智子", 
"石田めぐみ", "寺辻良子", "宮脇久代", "井浦陽子", "チャン", "谷健治", "北村あかり", 
"鈴木広美", "小笹嘉奈", "勝浦高之", __ob__: Observer]
 * 
 * 
 */
/**
 * 全表示のプラットフォーム
 * 
 * 
 */
export default {
    components:{
        mongodb,
        fr20KeyboardInput,
        nameView,
        assignView,
        staffList,
        dateChange
    },
    data: () => ({
        staff:[],
        qrcodeString:'',
        savingBusy: false,
        appDate: {},
        registerNow: {name:'', inout:'', time:''},
        carList_mukae:[],
        carList_okuri:[]
    }),
    beforeMount(){
        this.appDate = appDate.initAppDate()
    },
    mounted(){
        this.$refs.mdb.readHaisha(this.appDate);
        this.$refs.mdb.readAttendanceScheDay(this.appDate)
        this.$refs.dchange.checkDateTimerStart()
    },
    methods:{
        readMongoStaff(d){
            this.staff = staffFilter.rejectTaishokusha(d)
        },
        readQr(qr){
            //qrcode 読み取りイベント
            if(this.savingBusy === false){
                if(checkQr.checkDuplicationNoTimeSet(qr)){
                    //同じ名前の連続入力のウエイトタイムにかかっている
                    this.$refs.nameview.errSameNameInhibitTime(qr)  
                }else if(checkQr.checkName(qr, this.staff)){
                    this.savingBusy = true
                    this.qrcodeString = qr
                    this.$refs.mdb.readAttendance(this.appDate, this.qrcodeString)
                }
            }
        },
        readMongoAttendance(d){
            console.log(d)
            if(this.qrcodeString === d.name){
                if(d.in === ''){
                    console.log('din:', this.registerNow)
                    this.registerNow.name = d.name
                    this.registerNow.inoutView = '出勤'   
                    this.registerNow.time = moment().format('HH:mm')
                    this.registerNow.inout = 'in'
                    this.$refs.nameview.registerOn()
                    this.$refs.mdb.writeAttendance(this.appDate, {name:d.name, in:this.registerNow.time, out:''})
                    this.$refs.slist.registerOn({name:d.name, in:this.registerNow.time, out:''})
                }else if(d.out === ''){
                    console.log('dout:', this.registerNow)
                    this.registerNow.name = d.name
                    this.registerNow.inoutView = '退勤'    
                    this.registerNow.time = moment().format('HH:mm')   
                    this.registerNow.inout = 'out' 
                    this.$refs.nameview.registerOn()  
                    this.$refs.mdb.writeAttendance(this.appDate, {name:d.name, in:d.in, out:this.registerNow.time}) 
                    this.$refs.slist.registerOn({name:d.name, in:d.in, out:this.registerNow.time})         
                }else{
                    //データはすでに登録されている
                    this.$refs.nameview.errAlreadyResistered(d)
                }
            }
        },
        registerViewTimeout(){
            //touroku時表示のtimeout, 入力の許可
            console.log('main-panel, view timeout')
            this.savingBusy = false
        },
        readHaisha(x){
            this.carList_mukae = JSON.parse(JSON.stringify(x.carList.mukae));
            this.carList_okuri = JSON.parse(JSON.stringify(x.carList.okuri));
        },
        readMongoMs(sche, atten){
            // scheの初期化をロード、出勤データの入力済み分もロード
            this.$refs.slist.loadMemberSche(sche, atten)
        },
        dateChangeOn(){
            // 日付変更イベント beforeMount, mountedの関数を再度たたく
            this.appDate = appDate.initAppDate()
            this.$refs.mdb.readHaisha(this.appDate);
            this.$refs.mdb.readAttendanceScheDay(this.appDate)
            console.log('date-reload')
        },
        //eslint-disable-next-line
        testOn(){
            this.appDate.date = this.appDate.date - 1;
        }
    },
    watch:{
        registerNow(value, oldValue){
            console.log('main-p/register_now', value, oldValue)
        }
    }

}
</script>

<style>

</style>