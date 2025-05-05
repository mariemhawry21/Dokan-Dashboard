<template>
  <v-navigation-drawer
    v-model="model"
    :location="isRTL ? 'left' : 'right'"
    :temporary="true"
    width="300"
    class="settings-drawer"
    style="height: 100vh"
  >
    <div >
      <div class="pa-4 mb-4" style="border-bottom: 1px solid gainsboro;">
        <h3 class="">Customize</h3>
      </div>

      <!-- Theme -->
      <div class="pa-4">
        <h4 class="mb-4">Theme</h4>
        <v-btn-toggle v-model="theme" mandatory>
          <v-btn
            @click="setTheme('light')"
            :class="{ 'selected-theme': theme === 'light' }"
          >
            ☀
          </v-btn>
          <v-btn
            @click="setTheme('dark')"
            :class="{ 'selected-theme': theme === 'dark' }"
          >
            🌙
          </v-btn>
        </v-btn-toggle>
      </div>

      <!-- Color -->
      <div class="mt-4 pa-4">
        <div class="d-flex justify-space-between align-center mb-4">
          <h4>Text Color</h4>
          <v-btn variant="text" color="error" size="small" @click="resetColors">
            Reset
          </v-btn>
        </div>
        <v-row>
          <v-col v-for="(color, index) in colors" :key="index">
            <v-btn
              :style="{
                backgroundColor: color,
                width: '50px !important',
                height: '50px !important'
              }"
              @click="setColor(color)"
              icon
              :class="{ 'selected-color': selectedColor === color }"
            ></v-btn>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { useTheme } from 'vuetify'
  import { useI18n } from 'vue-i18n'

  const { locale } = useI18n()
  const themeManager = useTheme()

  const props = defineProps({
    modelValue: Boolean
  })

  const emit = defineEmits(['update:modelValue'])

  const model = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })

  const isRTL = computed(() => locale.value === 'ar')

  // Default colors for reset functionality
  const defaultColors = {
    light: {
      text: '#000000',
      secondary: '#2196F3'
    },
    dark: {
      text: '#F5F5F5',
      secondary: '#2196F3'
    }
  }

  const theme = ref('light')
  const selectedColor = ref('#000000')

  const colors = [
    '#000000',
    '#2196F3',
    '#4CAF50',
    '#FF5722',
    '#9C27B0',
    '#E91E63',
    '#607D8B'
  ]

  const setTheme = (selectedTheme) => {
    theme.value = selectedTheme
    themeManager.global.name.value = selectedTheme
  }

  const setColor = (color) => {
    selectedColor.value = color
    themeManager.themes.value.light.colors.text = color
    themeManager.themes.value.light.colors.secondary = color
    themeManager.themes.value.dark.colors.text = color
    themeManager.themes.value.dark.colors.secondary = color

    localStorage.setItem('textColor', color)
  }

  const resetColors = () => {
    themeManager.themes.value.light.colors.text = defaultColors.light.text
    themeManager.themes.value.light.colors.secondary =
      defaultColors.light.secondary
    themeManager.themes.value.dark.colors.text = defaultColors.dark.text
    themeManager.themes.value.dark.colors.secondary =
      defaultColors.dark.secondary

    selectedColor.value =
      theme.value === 'light'
        ? defaultColors.light.text
        : defaultColors.dark.text

    localStorage.removeItem('textColor')
  }

  // Initialize from localStorage
  const initialize = () => {
    const savedTheme = localStorage.getItem('theme')
    const savedColor = localStorage.getItem('textColor')

    if (savedTheme) {
      theme.value = savedTheme
      themeManager.global.name.value = savedTheme
    }

    if (savedColor) {
      selectedColor.value = savedColor
      setColor(savedColor)
    } else {
      selectedColor.value =
        theme.value === 'light'
          ? defaultColors.light.text
          : defaultColors.dark.text
    }
  }

  initialize()
</script>

<style scoped>
  .selected-theme {
    border: 2px solid #2196f3 !important;
    box-shadow: 0 0 0 1px white inset !important;
  }

  .selected-color {
    border: 3px solid #2196f3 !important;
    box-shadow: 0 0 0 2px white inset !important;
    transform: scale(1.05);
    transition: all 0.2s ease;
  }

  .settings-drawer {
    transition:
      transform 0.3s ease,
      opacity 0.3s ease,
      right 0.3s ease,
      left 0.3s ease;
    will-change: transform, opacity;
  }

  .settings-drawer.v-navigation-drawer--active {
    opacity: 1;
  }

  .settings-drawer:not(.v-navigation-drawer--active) {
    opacity: 0;
  }
</style>
