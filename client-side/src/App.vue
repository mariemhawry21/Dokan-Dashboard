<script setup>

  import { RouterView } from 'vue-router'
  import AppLayout from './layouts/AppLayout.vue'
  import { watch, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { locale } = useI18n()

  // Watch language changes and update the document direction
  watch(locale, (newLocale) => {
    if (newLocale === 'ar') {
      console.log(newLocale) // Log the newLocale value
      document.documentElement.setAttribute('dir', 'rtl')
    } else {
      document.documentElement.setAttribute('dir', 'ltr')
    }
  })

  // Set initial direction based on the default language
  onMounted(() => {
    if (locale.value === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl')
    } else {
      document.documentElement.setAttribute('dir', 'ltr')
    }
  })
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
  /* Styles for RTL */
  html[dir='rtl'] .v-btn {
    text-align: right;
  }

  /* Styles for LTR */
  html[dir='ltr'] .v-btn {
    text-align: left;
  }
</style>
