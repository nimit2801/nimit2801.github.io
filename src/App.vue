<template>
  <nav>
    <router-link to="/">Home</router-link> | 
    <router-link to="/blogs">Blogs</router-link>
  </nav>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  metaInfo: {
    title: 'Nimit Savant - Developer Advocate',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: 'Personal website of Nimit Savant, a backend developer and Project Manager passionate about communities, startups, and open source projects.' },
      { name: 'keywords', content: 'Nimit Savant, Backend Developer, Project Manager, Open Source, DevAdvocacy' },
      { property: 'og:title', content: 'Nimit Savant - Backend Developer & Project Manager' },
      { property: 'og:description', content: 'Personal website of Nimit Savant, a backend developer and Project Manager passionate about communities, startups, and open source projects.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://nimitsavant.me' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:creator', content: '@SavantNimit' },
      { name: 'twitter:title', content: 'Nimit Savant - Backend Developer & Project Manager' },
      { name: 'twitter:description', content: 'Personal website of Nimit Savant, a backend developer and Project Manager passionate about communities, startups, and open source projects.' }
    ]
  }
}
</script>

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
