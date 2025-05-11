<template>
  <v-container
    class="fill-height d-flex flex-column justify-center align-center text-center"
    style="background-color: #fff"
  >
    <h1
      class="display-1 font-weight-bold mb-6"
      style="opacity: 0.05; font-size: 10rem"
    >
      404
    </h1>

    <v-img
      :src="chairImage"
      alt="Broken Chair"
      contain
      height="200"
      width="200"
      class="mb-6"
    ></v-img>

    <h2 class="font-weight-bold">PAGE NOT FOUND</h2>
    <p>Sorry, but the page that you requested doesn't exist.</p>

    <v-btn
      color="white"
      class="mb-2 bg-secondary text-white mt-4"
      @click="$router.push('/')"
    >
      Back to Home
      <v-icon right>mdi-arrow-right</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
  import brokenChair from '../assets/broken-chair.png'

  export default {
    name: 'NotFound',
    data() {
      return {
        chairImage: brokenChair
      }
    }
  }
</script>
