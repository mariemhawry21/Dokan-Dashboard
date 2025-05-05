<script>
  import StoreSettings from '../components/Settings/StoreSettings.vue'
  import ShippingConfig from '../components/Settings/ShippingConfig.vue'
  import AdminRoleConfig from '../components/Settings/AdminRoleConfig.vue'
  import Currencies from '../components/Settings/Currencies.vue'
  export default {
    components: { StoreSettings, ShippingConfig, AdminRoleConfig, Currencies }
  }
</script>

<template>
  <v-container fluid>
    <!-- Store Settings Section -->
    <StoreSettings></StoreSettings>
    <!-- Shipping Methods Section -->
    <ShippingConfig />
    <!-- User Roles Section -->
    <AdminRoleConfig />
    <Currencies />
  </v-container>
</template>

<style scoped>
  /* Custom card header colors matching your theme */
  .v-card-title.primary {
    background-color: rgb(var(--v-theme-primary));
    color: white;
  }

  .v-card-title.secondary {
    background-color: rgb(var(--v-theme-secondary));
    color: white;
  }

  /* Add some spacing between sections */
  .v-card {
    margin-bottom: 24px;
  }
</style>
