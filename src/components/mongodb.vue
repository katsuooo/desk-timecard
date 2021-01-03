<template>
    <div class='viewCtrl'>
        <p>////////// mongodb ////////////// {{appDate}}</p>
    </div>
</template>
<script>
import io from 'socket.io-client';

/**
 * get url
 */
function getUrl(){
    //return io.request.connection.remoteAddress
    var web_server = window.location.host
    var backend = web_server.split(':')[0] + ':3050'
    return backend
}


export default {
    data: function() {
        return {
            socket: io(getUrl(), {transports: ['websocket']}),
            customer: Array,
            cusSche: Array,
            member: Array,
            memSche: Array,
            mounted: false
        }
    },
    props: {
        appDate: {}
    },
    beforeMount(){

    },
    mounted(){
        /**
         * 配車データ無し時のカレンダデータリード用ハンドラ
         */
        this.socket.on('READ_HAISHA_RESULT', (d) => {
            if(d === null){
                //this.socket.emit('READ_CUSTOMER')       //データ新規作成。カレンダから
            }else{
                this.$emit('read_haisha', d)    //既存データを読み込んだ
            }
        });
        this.socket.emit('READ_STAFF')
        this.socket.on('READ_STAFF_RESULT', (s) => {
            this.member = s;
            this.$emit('READ_MONGO_STAFF', s)
        })
        this.socket.on('READ_ATTENDANCE_RESULT', (d) => {
            console.log('read-attendance-result', d)
            //出退勤データの読み出し d={name:'',in:'',out:''}
            this.$emit('READ_MONGO_ATTENDANCE', d)
        })
        /*
        this.socket.on('READ_SSCHE_RESULT', (s) => {
            this.cusSche = s;
            //this.socket.emit('READ_STAFF')
            this.$emit('READ_MONGO_MS', s)
        })
        */
        this.socket.on('READ_ATTENDANCE_SCHE_DAY_RESULT', (d) => {
            this.$emit('READ_MONGO_MS', d.sche, d.attendance)

        })
        this.mounted = true;
    },
    methods:{
        readHaisha(mainPanelAppDate){
            //this.socket.emit('READ_CUSTOMER', this.appDate)   //カレンダデータ
            //console.log('mdb-read-sche')
            this.socket.emit('REQ_HAISHA', mainPanelAppDate)
            this.socket.emit('READ_SSCHE', mainPanelAppDate)
        },
        test(){
        },
        /*
        readCalendarAll(appDate){
            this.socket.emit('READ_CALENDER_ALL', appDate)
        },
        */
        readAttendance(appDate, name){
            this.socket.emit('READ_ATTENDANCE',{appDate: appDate, name: name})
        },
        writeAttendance(appDate, d){
            // d = {name, inout, time}
            this.socket.emit('WRITE_ATTENDANCE', {appDate: appDate, d: d})
        },
        readAttendanceScheDay(appDate){
            //attendanceとstaff scheのone dayデータ
            this.socket.emit('READ_ATTENDANCE_SCHE_DAY', appDate)
        },
    } 
}
</script>

<style scoped>
.viewCtrl{
    display: none;
}

</style>