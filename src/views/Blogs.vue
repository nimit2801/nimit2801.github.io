<script setup>
import { ref } from 'vue';

const blogs = ref(null);
fetch('https://dev.to/api/articles?username=nimit2801')
    .then(response => response.json())
    .then(data => blogs.value = data);
</script>

<template>
    <div>
        <h1>Blogs</h1>

        <h1>{{ data }}</h1>

        <div class="card-board">
            <div v-for="blog in blogs" :key="blog.id" class="card">
              <a :href="blog.url" target="_blank">
                <img :src="blog.cover_image" alt="Avatar" class="card-image">
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  width: 90%;
  max-width: 500px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

.card-image {
  width: 100%;
  height: auto;
  border-radius: 5px 5px 0 0;
}

.container {
  padding: 15px;
}

@media (min-width: 768px) {
  .card-board {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }

  .card {
    width: 45%;
  }
}

@media (min-width: 1024px) {
  .card {
    width: 30%;
  }
}
</style>