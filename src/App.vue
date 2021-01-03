<template>
  <div id="app">
    <mainPanel />
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
//import fr20KeyboardInput from './components/fr20KeyboardInput.vue'
import mainPanel from './pages/mainPanel.vue'

export default {
  name: 'App',
  components: {
    //HelloWorld,
    //fr20KeyboardInput
    mainPanel
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
.no-new-line{
  display: inline-block !important;
  white-space: nowrap; 
}
.no-new-line-block{
  display: block !important;
  white-space: nowrap; 
}
.add-btn{
  margin-top: 30px;
}
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
}
.bg-reserve{
    background-color: #faf0e6;
    color: #000;
    border-color: 1px dotted #3a87ad;
}
</style>
