import cat from 
<template>
  <div>
    <img id="img_" src="./assets/Catcat.png">
  </div>
</template>

<script>
import image from "./assets/Catcat.png"
export default {
  name: 'App',
  data: function() {
    return image
  },
  props: {
    counter: Number,
  }
}
</script>

<style>
body {
  background-color: teal;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color:aliceblue;
  margin-top: 60px;
}

#img_ {
  position: relative;
  margin-top: 12rem;
  width: 285px;
  height: 188px;
}
</style>
