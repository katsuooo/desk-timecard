<template>
    <div>
        <div class='row'>
            <div class='col-sm-6' style='border-right: groove 3px #fefefe'>
                <h2>お迎え配車</h2>
                <div class='row' v-for='(car) in xCarListMukae' :key='car.no'>
                    <div class='col-sm-2'  style='padding:0px;'>
                        <div class="card" id="col1no0" ref="'col1no'+car.no">
                            <span class='badge bg-primary'>場所</span>
                                <transition-group name="no" class="list-group text-left" tag="ul">
                                <li class="list-group-item no-new-line" v-for="element in car.cs" :key="element.order">
                                    <span class='badge bg-primary'>{{element.mukae_place}}</span>
                                </li>
                                </transition-group>
                        </div>
                    </div>
                <div class='col-sm-2'  style='padding:0px;'>
                    <div class="card">
                        <span class='badge bg-warning'>時間</span>   
                        
                        <input class='form-control form-control-lg  align-items-center' 
                            type='time' min='09:00' max='18:00' step='1800' required 
                            placeholder=".form-control-lg" aria-label=".form-control-lg" v-model='car.mtime' /> 
                        
                    </div>                
                </div>
                <div class='col-sm-3'  style='padding:0px;'>
                    <div class="card" id="col3no0">
                        <span class='badge bg-info'>利用者さんリスト</span>
                            <transition-group name="no" class="list-group text-left" tag="ul">
                                <li class="list-group-item no-new-line" v-for="element in car.cs" :key="element.order">
                                    <span class='badge bg-light text-dark'>{{element.mukae_time}}</span>
                                    <span class='badge' 
                                        v-bind:class='checkPlace(element.place)'
                                        >{{element.name}}
                                    </span>
                                </li>
                            </transition-group>
                    </div>
                </div>
                <div class='col-sm-1' style='padding:0px;'>
                    <div class="card text-center align-items-center" id="col4no0">
                        <div class='card-body' style='margin-top: auto; margin-bottom: auto;'>
                            <h3 class='card-text justify-content-cente' style=''>{{car.driver}}</h3>
                        </div>
                    </div>
                </div>
                <div class='col-sm-4' style='padding:0px;'>
                    <div class="card" id="col5no0">
                        <span class='badge bg-success'>スタッフさんリスト</span>
                            <transition-group name="no" class="list-group text-left" tag="ul">
                                <li class="list-group-item no-new-line" v-for="element in car.ms" :key="element.order">
                                    <span class='badge bg-light text-dark'>{{element.stime}}-{{element.etime}}</span>
                                    <span class='badge' 
                                        v-bind:class='checkPlace(element.place)'
                                        >{{element.name}}
                                    </span>
                                </li>
                            </transition-group>
                    </div>
                </div>
                </div><!--card-group or row-->
            </div><!-- col -->
            <div class='col-sm-6'>
                <h2>お送り配車</h2>
                <div class='row' v-for='car in xCarListOkuri' :key=car.no> 
                <div class='col-sm-1' style='padding:0px;'>
                    <div class="card"></div><!--blank-->
                </div>
                <div class='col-sm-2' style='padding:0px;'>
                    <div class="card">
                        <span class='badge bg-warning'>時間</span>
                        
                        <input class='form-control form-control-lg  align-items-center' 
                            type='time' min='09:00' max='18:00' step='00:30:00' required 
                            placeholder=".form-control-lg" aria-label=".form-control-lg" v-model='car.otime' />                         
                    </div><!--blank-->
                </div>
                <div class='col-sm-4' style='padding:0px;'>
                    <!--moved box-->    
                    <div class="card">
                        <span class='badge bg-info'>利用者さんリスト</span>
                            <transition-group name="no" class="list-group text-left" tag="ul">
                                <li class="list-group-item no-new-line" v-for="element in car.cs" :key="element.order">
                                    <span class='badge bg-light text-dark'>{{element.arrival_time}}</span>
                                    <span class='badge' 
                                        v-bind:class='checkPlace(element.place)'
                                        >{{element.name}}
                                    </span>
                                </li>
                            </transition-group>
                    </div>
                </div>
                <div class='col-sm-1' style='padding:0px;'>
                    <div class="card text-center">
                        <div class='card-body'>
                            <h3 class='card-text justify-content-cente' style='vertical-align:middle'>{{car.driver}}</h3>
                        </div>
                    </div>
                </div>
                <div class='col-sm-4' style='padding:0px;'>
                    <div class="card">
                        <span class='badge bg-success'>スタッフさんリスト</span>
                        <transition-group name="no" class="list-group text-left" tag="ul">
                            <li class="list-group-item no-new-line" v-for="element in car.ms" :key="element.order">
                                <span class='badge bg-light text-dark'>{{element.stime}}-{{element.etime}}</span>
                                <span class='badge' 
                                    v-bind:class='checkPlace(element.place)'
                                    >{{element.name}}
                                </span>
                            </li>
                        </transition-group>
                    </div>   
                </div><!-- card group or col -->   
                </div><!--row-->          
            </div><!--col-->
        </div><!--row-->
    </div><!-- -->
</template>
<script>
import chou2Color from '@/components/chou2Color.js'
//import clockPicker from '@/components/clockPicker.vue'
export default {
    props:{
        xAppDate:{},
        xCarListMukae:Array,
        xCarListOkuri:Array
    },
    components:{
        //clockPicker
    },
    beforeMount(){

    },
    methods:{
        checkPlace: (place) => {
            return chou2Color.checkPlace(place)
        },
        kdOn: () => {
            console.log('kd-on')
            //let height = this.$refs.col1no0.clientHeight
            let height1 = document.getElementById('col1no0').val.toString()
            let height3 = document.getElementById('col3no0').style.height.toString()   
            let height4 = document.getElementById('col4no0').style.height.toString()
            let height5 = document.getElementById('col5no0').style.height.toString()             
            console.log('height1:', typeof(height1), height1)
            console.log('height3:', typeof(height3), height3)
            console.log('height4:', typeof(height4), height4)
            console.log('height5:', typeof(height5), height5)
        }
    },
    watch:{
        /*
        xCarListMukae(val){
            if(document.getElementById('selx0') !== null){
                document.getElementById('selx0').value = '自車';
            }

        }
        */
    }
}
</script>

<style scoped>
.driver{
    margin: 0px;
    padding: 0px;
}
.driver_h{
    display: inline;
    padding-left: 22px;
}
.driver_card{
    width: 100px !important;
}
/*
.bg-chou2{
    background-color: #ff1493;
    border-color: #ff1493;
    color: #fff;   
}
.bg-cache2{
    background-color: #1e90ff;
    border-color: #1e90ff;
    color: #fff;   
}
.bg-lightx{
    background-color: #f8f9fa;
    border-color: #f8f9fa;
    color: #343a40;      
}*/
</style>

