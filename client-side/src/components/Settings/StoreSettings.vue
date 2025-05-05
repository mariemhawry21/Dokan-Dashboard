<script setup>
  import { ref, onMounted, watch, computed } from 'vue'
  import { useToast } from 'vue-toastification'
  import { useI18n } from 'vue-i18n'
  import { useSettingsStore } from '../../store/useSettingsStore'
  import { useCurrencyStore } from '../../store/useCurrencyStore'

  const toast = useToast()
  const { locale, t } = useI18n()
  const settingsStore = useSettingsStore()
  const currencyStore = useCurrencyStore()

  // Initialize with store values
  const storeSettings = ref({
    name: '',
    currency: 'USD',
    language: 'en'
  })

  const currencies = computed(() =>
    settingsStore.currencies.map((c) => ({
      title: `${c.symbol} - ${c.name}`,
      value: c.code
    }))
  )

  const languages = computed(() => [
    { text: t('english'), value: 'en' },
    { text: t('arabic'), value: 'ar' },
    { text: t('french'), value: 'fr' }
  ])

  // Load settings when component mounts
  onMounted(async () => {
    try {
      await settingsStore.fetchStoreSettings()
      await settingsStore.fetchCurrencies()

      // Check if currencies are loaded successfully
      if (settingsStore.currencies.length > 0) {
        console.log("Currencies loaded:", settingsStore.currencies)
      } else {
        console.warn("No currencies found")
      }

      // Check localStorage first, then fall back to store default
      const savedLang = localStorage.getItem('userLanguage') || settingsStore.defaultLanguage

      // Update all references
      storeSettings.value = {
        name: settingsStore.storeName,
        currency: settingsStore.currency,
        language: savedLang
      }

      // Apply the language settings
      applyLanguageSettings(savedLang)

      // Persist currency from localStorage
      currencyStore.persistCurrencyFromStorage()

      // Debug log for checking currency
      console.log("Selected Currency on mount:", currencyStore.selectedCurrency)
    } catch (error) {
      toast.error(t('failedToLoadSettings'))
    }
  })

  // Watch for language changes
  watch(
    () => storeSettings.value.language,
    (newLang) => {
      if (newLang !== locale.value) {
        applyLanguageSettings(newLang)
      }
    }
  )

  watch(
    () => storeSettings.value.currency,
    (newCurrency) => {
      const selectedCurrency = settingsStore.currencies.find(
        (c) => c.code === newCurrency
      )
      if (selectedCurrency) {
        currencyStore.setCurrency(selectedCurrency)
      }
    }
  )

  const applyLanguageSettings = (lang) => {
    locale.value = lang
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }

  const saveSettings = async () => {
    try {
      const settingsToSave = {
        storeName: storeSettings.value.name,
        currency: storeSettings.value.currency,
        defaultLanguage: storeSettings.value.language
      }

      await settingsStore.updateStoreSettings(settingsToSave)
      // Get full currency object (code, symbol, exchange_rate)
      const selectedCurrency = settingsStore.currencies.find(
        (c) => c.code === storeSettings.value.currency
      )

      if (selectedCurrency) {
        currencyStore.setCurrency(selectedCurrency)
      }

      // Persist language preference locally
      localStorage.setItem('userLanguage', storeSettings.value.language)

      toast.success(t('settingsSaved'))
    } catch (error) {
      toast.error(t('failedToSaveSettings'))
    }
  }
</script>

<template>
  <v-card class="mb-6">
    <v-card-title class="primary">
      <div
        class="d-flex"
        :class="{ 'flex-row-reverse': $i18n.locale === 'ar' }"
      >
        <v-icon
          class="mx-2"
          :left="$i18n.locale !== 'ar'"
          :right="$i18n.locale === 'ar'"
        >
          mdi-store
        </v-icon>
        {{ $t('storeSettings') }}
      </div>
    </v-card-title>

    <v-card-text>
      <!-- <v-alert
        v-if="settingsStore.error"
        type="error"
        class="mb-4"
      >
        {{ settingsStore.error }}
      </v-alert> -->

      <v-progress-linear
        v-if="settingsStore.loading"
        indeterminate
        color="primary"
        class="mb-4"
      ></v-progress-linear>

      <v-form
        :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
        @submit.prevent="saveSettings"
      >
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="storeSettings.name"
              :label="$t('storeName')"
              :rules="[(v) => !!v || $t('fieldRequired')]"
              outlined
              required
              :disabled="settingsStore.loading"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              v-model="storeSettings.currency"
              :items="currencies"
              :label="$t('currency')"
              :rules="[(v) => !!v || $t('fieldRequired')]"
              outlined
              required
              :disabled="settingsStore.loading || !currencies.length"
            ></v-select>
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              v-model="storeSettings.language"
              :items="languages"
              item-title="text"
              item-value="value"
              :label="$t('language')"
              :rules="[(v) => !!v || $t('fieldRequired')]"
              outlined
              required
              :disabled="settingsStore.loading"
            ></v-select>
          </v-col>
        </v-row>

        <v-btn
          type="submit"
          style="background-color: transparent;"
          color="secondary"
          :disabled="
            settingsStore.loading ||
            !storeSettings.name ||
            !storeSettings.currency ||
            !storeSettings.language
          "
          :loading="settingsStore.loading"
          class="mt-2"
        >
          {{ $t('saveSettings') }}
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
