<template>
    <div style='display:none;'>
        <h4>fr20 input</h4>
        <span>{{keyInput}}</span>
    </div>
</template>

<script>
/**
 * トゥエンさんをローカルで変換(半角ゥのqrでエが文字化けする)
 */
/**
 * FR20 keyboardインプットの読み込み
 * 
 * keyInputはFR20からusb hid keyboardを通して受信したテキストデータ。
 * enter検出で、文字列取得、バッファクリア、親へイベント発行。
 * 
 * 
 */

/**
 * 
 */
export default {
    data: () => ({
        keyInput: '',
        keyInBusy: false,
    }),
    mounted() {
        window.addEventListener("keypress", e => {
            console.log(String.fromCharCode(e.keyCode));
            let inKey = String.fromCharCode(e.keyCode);
            if(e.keyCode === 0x0d){
                this.keyInBusy = false;
                console.log('enter-', this.keyInput)
                if(this.keyInput === 'トゥエン'){
                    this.keyInput = 'トｩエン'
                }
                this.$emit('READ_QR', this.keyInput)
                this.keyInput = ''
            }else{
                if(this.keyInBusy === true){
                    this.keyInput += inKey;
                }else {
                    this.keyInBusy = true;
                    this.keyInput = inKey;
                }
            }
        });
    }
}
</script>

<style>

</style>