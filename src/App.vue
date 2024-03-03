<template>
  <nav>
    <router-link to="/">Home</router-link> | 
    <router-link to="/blogs">Blogs</router-link>
  </nav>
  <router-view />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

html, body {
    height: 100vh;
    margin: 0;
    padding: 0;
}

#app {
  font-family: 'VT323', monospace;
  font-weight: 200;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #F0EBCE;
  margin-top: 3%;
}


body {
  background-color: #4E6C50;
}

nav{
    text-align: center;
    margin: 0 0 2em 0;
}
nav > a{
    margin: 0 1em;
    text-decoration: none;
    font-size: 20px;
    color: #F0EBCE;
}

a {
    text-decoration: none;
    color: #F0EBCE;
}
</style>
