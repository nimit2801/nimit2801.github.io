<!-- <script setup lang="ts">
    type TDevToApiData = {
        id: string;
        title: string;
        description: string;
        url: string;
    }
    import { ref } from 'vue';

    console.log('+++++++++blogs++++++++: ', blogsData);
</script> -->
<script setup>
import { ref } from 'vue';

const blogs = ref(null);
fetch('https://dev.to/api/articles?username=nimit2801')
    .then(response => response.json())
    .then(data => blogs.value = data);
// fetch('https://testapi.jasonwatmore.com/products')
//     .then(response => response.json())
//     .then(data => products.value = data);
</script>

<template>
    <div>
        <h1>Blogs</h1>

        <h1>{{ data }}</h1>

        <div class="card-board">
            <div v-for="blog in blogs" :key="blog.id" class="card">
              <a :href="blog.url" target="_blank">
                <img :src="blog.cover_image" alt="Avatar" style="width:100%">
                <div class="container">
                    <h4><b>{{ blog.title }}</b></h4> 
                    <p>{{ blog.description }}</p> 
                </div>
              </a>
            </div>
        </div>
    </div>
</template>

<style>
.card-board {
  width: 100%;
  display: inline-flex;
  justify-content: space-evenly;
}
.card {
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  order: 3;
  width: 30vw;
  border-radius: 5px;
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

img {
  border-radius: 5px 5px 0 0;
}

.container {
  padding: 2px 16px;
}
</style>