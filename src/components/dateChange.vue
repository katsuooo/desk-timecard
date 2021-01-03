
<template>
    <div style='display:none;'>
        
    </div>
</template>

<script>
/**
 * 
 * 日付変更時、データ読み直し
 * 
 * 
 */
import moment from 'moment'

//eslint-disable-next-line
const checkInterval = 60000     // 60s


/**
 * 
 */
export default {
    props:{
        appDate: {}
    },
    methods:{
        checkDate(){
            var nowx = moment()
            var nowDate = nowx.date()
            if(this.appDate.date !== nowDate){
                this.$emit('DATE_CHANGE')
            }
        },
        checkDateTimerStart(){           
            setInterval(this.checkDate.bind(), checkInterval)           
        },
    }
}
</script>

<style>

</style>