<template>
  <v-app>
    <v-layout style="overflow: hidden">
      <v-navigation-drawer
        color="primary"
        v-model="drawer"
        :permanent="!isMobile"
        :temporary="isMobile"
        style="
          height: 100vh;
          position: fixed;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        "
      >
        <div class="d-flex pa-2">
          <h2>DUKAN</h2>
        </div>
        <v-list style="padding: 0">
          <v-list-item
            v-for="item in items"
            :key="item.value"
            :to="item.to"
            link
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>

        <!-- Logout Button (fixed at bottom) -->
        <div
          style="
            position: fixed;
            bottom: 0;
            width: 100%;
            padding: 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.12);
          "
        >
          <v-btn block color="error" prepend-icon="mdi-logout" @click="logout">
            Logout
          </v-btn>
        </div>
      </v-navigation-drawer>

      <!-- Page content -->
      <v-main>
        <!-- header -->
        <Header
          :drawer="drawer"
          @toggle-drawer="drawer = !drawer"
          :isMobile="isMobile"
        />

        <router-view />
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup>
  import { ref, computed, watchEffect } from 'vue'
  import { useDisplay } from 'vuetify'
  import Header from '../components/Header.vue'

  const display = useDisplay()
  const isMobile = computed(() => display.smAndDown.value)
  const drawer = ref(true)

  const items = [
    { title: 'Dashboard', to: '/dashboard' },
    { title: 'Products', to: '/products' },
    { title: 'Orders', to: '/orders' },
  { title: "Customers", to: "/CustomerManagement" },
    { title: 'Requests', to: '/requests' },
    { title: 'Store Settings', to: '/config' }
  ]
  // Add this logout method
  const logout = () => {
    // Your logout logic here
    console.log('Logging out...')
    // router.push('/login') // Redirect to login page
    // Add any other logout cleanup (clearing tokens, etc.)
  }

  watchEffect(() => {
    drawer.value = !isMobile.value
  })
</script>
<style>
  .v-application {
    transition:
      background-color 0.3s ease-in-out,
      color 0.5s ease-in;
  }
</style>
