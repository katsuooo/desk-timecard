<template>
    <div>
        <h5 style='display:none;'>name-panel</h5>
        <transition-group tag='p' name='myForm'>
            <div v-if='isRegister' key='registerName'>
                <span class='namex'>{{register_now.time}}</span>
                <span class='namex'>{{register_now.name}}</span>
                <span class='namex'>{{register_now.inoutView}}</span>
            </div>
            <div v-if='isErrAlreadyRegistered' key='errAlreadyRegistered'>
                <span class='errAR'>エラー:</span>
                <span class='errAR'>データ入力済み</span>
                <span class='errAR'>{{errAlreadyRegisteredData.name}}</span>
                <span class='errAR'>出勤</span>
                <span class='errAR'>{{errAlreadyRegisteredData.in}}</span>
                <span class='errAR'>退勤</span>
                <span class='errAR'>{{errAlreadyRegisteredData.out}}</span>
            </div>
            <div v-if='isErrSameNameInhibitTime' key='errSameNameWait'>
                <span class='errAR'>エラー:</span>
                <span class='errAR'>同じ名前の登録は１分以上開けてください</span>
                <span class='errAR'>{{errSameNameWait.name}}</span>
            </div>
        </transition-group>
    </div>
</template>

<script>
/**
 * name view
 * 
 * qrコード検出で一時的の名前を表示、少しでもとに戻る。
 * 
 * 
 * 
 */
/**
 * レジスタービュータイムアウト
 * 
 * 
 * 
 */

//const viewEnaTime = 2500
const viewEnaTime = 5000

/**
 * 
 * 
 */
export default {
    props:{
        register_now:{}
    },
    data: () => ({
        isRegister: false,
        errAlreadyRegisteredData: {},
        isErrAlreadyRegistered: false,
        isErrSameNameInhibitTime: false,
        errSameNameWait: {}
    }),
    methods:{
        registerOn(){
            this.isRegister = true
            //setTimeout(registerViewOff(this.isRegister), 3000)
            
            setTimeout(() => {
                this.isRegister = false
                console.log('timeout')
                this.$emit('REGISTER_VIEW_TIMEOUT')
            }, viewEnaTime)
            
            //setTimeout(() => registerViewOff(this.isRegister), 2500)

        },
        errAlreadyResistered(d){
            //出退勤共に登録されている
            this.errAlreadyRegisteredData = {name:d.name, in:d.in, out:d.out}
            this.isErrAlreadyRegistered = true
            setTimeout(() => {
                this.isErrAlreadyRegistered = false
                console.log('err-timeout')
                this.$emit('REGISTER_VIEW_TIMEOUT')
            }, viewEnaTime)
        },
        errSameNameInhibitTime(name){
            //同一名の場合、ウエイト１分が必要
            this.errSameNameWait = {name:name}
            this.isErrSameNameInhibitTime = true
            setTimeout(() => {
                this.isErrSameNameInhibitTime = false
                console.log('err-same-name-inhibit-time')
                this.$emit('REGISTER_VIEW_TIMEOUT')
            }, viewEnaTime)
        }
    },
    watch:{
        /*
        isRegister(value, oldValue){
            console.log('name-view-watch/register_now', value, oldValue)
        }
        */
    }
}
</script>

<style>
          .myForm-enter-active {
            /*transition: all .8s ease;*/
            transition: all 1.4s ease;
          }
          
          .myForm-leave-active {
            /*transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);*/
            transition: all .4s cubic-bezier(1.0, 0.5, 0.8, 1.0);
          }
          
          .myForm-enter, .myForm-leave-to {
            transform: translateY(-10px);
            opacity: 0;
          }
.namex{
    font-size: 5rem;
    margin-right: 40px;
}
.errAR{
    font-size: 2rem;
    color: red;
    margin-right: 40px;    
}
</style>