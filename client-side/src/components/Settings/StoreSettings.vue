<script setup>
  import { ref } from 'vue'
  import { useToast } from 'vue-toastification'

  const toast = useToast()

  const storeSettings = ref({
    name: 'My Awesome Store',
    currency: 'USD',
    language: 'en'
  })

  const currencies = ['USD', 'EUR', 'GBP', 'AED']
  const languages = [
    { text: 'English', value: 'en' },
    { text: 'Arabic', value: 'ar' },
    { text: 'French', value: 'fr' }
  ]

  const saveSettings = () => {
    console.log('Settings saved:', storeSettings.value)
    toast.success('Settings saved successfully!')
  }
</script>
<template>
  <v-card class="mb-6">
    <v-card-title class="primary">
      <v-icon left>mdi-store</v-icon>
      Store Settings
    </v-card-title>
    <v-card-text class="secondary">
      <v-form @submit.prevent="saveSettings" class="secondary">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="storeSettings.name"
              label="Store Name"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="storeSettings.currency"
              :items="currencies"
              label="Currency"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="storeSettings.language"
              :items="languages"
              label="Default Language"
              outlined
            ></v-select>
          </v-col>
        </v-row>
        <v-btn
          type="submit"
          :color="$vuetify.theme.current.dark ? 'dark-primary' : 'primary'"
        >
          Save Settings
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>
