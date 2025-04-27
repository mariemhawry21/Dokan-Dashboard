<script setup>
  import { RouterView } from 'vue-router'
  import AppLayout from './layouts/AppLayout.vue'
</script>

<template>
  <RouterView />
</template>

<style scoped>
  /* Toast Styles */
  .custom-toast {
    border-radius: 12px !important;
    padding: 16px 24px !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    font-family: 'Roboto', sans-serif;
  }

  .custom-toast.Vue-Toastification__toast--success {
    background: linear-gradient(135deg, #4caf50, #8bc34a);
    color: white;
  }

  .custom-toast.Vue-Toastification__toast--error {
    background: linear-gradient(135deg, #f44336, #e57373);
    color: white;
  }

  .toast-body {
    display: flex;
    align-items: center;
  }
</style>
