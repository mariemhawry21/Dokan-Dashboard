<template>
  <v-app-bar color="background" style="box-shadow: none; position: fixed">
    <template v-if="$i18n.locale === 'ar'">
      <!-- RTL Layout (Arabic) -->
      <div class="d-flex align-center" style="width: 100%">
        <!-- Controls on left in RTL -->
        <div class="d-flex">
          <v-btn icon @click="$emit('toggle-settings')">
            <v-icon>mdi-cog</v-icon>
          </v-btn>
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn icon v-bind="props" class="mx-2">
                <v-icon>mdi-translate</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="lang in availableLanguages"
                :key="lang.code"
                @click="changeLanguage(lang.code)"
                style="padding: 20px"
                :class="{ 'v-list-item--active': locale === lang.code }"
              >
                <v-list-item-title>{{ lang.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn
            icon
            @click="toggleTheme"
            :title="isDark ? $t('switchToLight') : $t('switchToDark')"
          >
            <v-icon>{{
              isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'
            }}</v-icon>
          </v-btn>
        </div>

        <v-spacer></v-spacer>

        <!-- Breadcrumbs on right in RTL -->
        <v-breadcrumbs
          class="px-4 py-2 breadcrumbs"
          style="width: auto"
          :divider="breadcrumbDivider"
          dir="rtl"
        >
          <v-breadcrumbs-item
            v-for="(crumb, index) in formattedBreadcrumbs"
            :key="index"
            :to="crumb.to"
            :disabled="crumb.disabled"
            exact
            class="breadcrumb-item"
            :class="{
              'active-crumb': index === formattedBreadcrumbs.length - 1
            }"
            style="align-items: center"
          >
            <template v-if="index === 0">
              <v-icon class="ms-1" color="secondary" style="font-size: 25px">
                mdi-home
              </v-icon>
              <span style="font-weight: bold">{{ crumb.text }}</span>
            </template>
            <template v-else> / {{ crumb.text }} </template>
          </v-breadcrumbs-item>
        </v-breadcrumbs>

        <v-app-bar-nav-icon v-if="isMobile" @click="$emit('toggle-drawer')" />
      </div>
    </template>

    <template v-else>
      <!-- LTR Layout (English/French) -->
      <v-app-bar-nav-icon v-if="isMobile" @click="$emit('toggle-drawer')" />

      <!-- Breadcrumbs on left in LTR -->
      <v-breadcrumbs
        class="px-4 py-2 breadcrumbs"
        style="width: auto"
        dir="ltr"
      >
        <v-breadcrumbs-item
          v-for="(crumb, index) in formattedBreadcrumbs"
          :key="index"
          :to="crumb.to"
          :disabled="crumb.disabled"
          exact
          class="breadcrumb-item"
          :class="{ 'active-crumb': index === formattedBreadcrumbs.length - 1 }"
          style="align-items: center"
        >
          <template v-if="index === 0">
            <v-icon class="ms-1" color="secondary" style="font-size: 25px">
              mdi-home
            </v-icon>
            <span style="font-weight: bold">{{ crumb.text }}</span>
          </template>
          <template v-else>
            <span class="divider-wrapper"></span>
            <span>/ {{ crumb.text }} </span>
          </template>
        </v-breadcrumbs-item>
      </v-breadcrumbs>
      <v-spacer></v-spacer>

      <!-- Controls on right in LTR -->
      <div class="d-flex">
        <v-btn icon @click="$emit('toggle-settings')">
          <v-icon>mdi-cog</v-icon>
        </v-btn>
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" class="mx-2">
              <v-icon>mdi-translate</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="lang in availableLanguages"
              :key="lang.code"
              @click="changeLanguage(lang.code)"
              style="padding: 20px"
              :class="{ 'v-list-item--active': locale === lang.code }"
            >
              <v-list-item-title>{{ lang.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn
          icon
          @click="toggleTheme"
          :title="isDark ? $t('switchToLight') : $t('switchToDark')"
        >
          <v-icon>{{
            isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'
          }}</v-icon>
        </v-btn>
      </div>
    </template>
  </v-app-bar>
</template>

<script setup>
  import { useRoute } from 'vue-router'
  import { computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import useThemeToggle from '../composables/useThemeToggle'

  const { locale, t } = useI18n()
  const route = useRoute()
  const { isDark, toggleTheme } = useThemeToggle()

  defineProps(['drawer', 'isMobile'])
  defineEmits(['toggle-drawer'])

  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
    { code: 'fr', name: 'French' }
  ]

  const formattedBreadcrumbs = computed(() => {
    const matchedRoutes = route.matched
      .filter((r) => r.name && r.meta?.breadcrumb !== false)
      .map((r) => ({
        text: r.meta?.breadcrumb
          ? t(r.meta.breadcrumb)
          : t(formatRouteName(r.name)),
        to: r.path.includes(':') ? undefined : r.path,
        disabled: false
      }))

    // Add Home as first item
    const homeCrumb = {
      text: t('Home'),
      to: '/',
      disabled: false
    }

    // For RTL, reverse the order (current page first)
    return locale.value === 'ar'
      ? [...matchedRoutes, homeCrumb].reverse()
      : [homeCrumb, ...matchedRoutes]
  })

  function formatRouteName(name) {
    if (typeof name !== 'string') return ''
    return name
      .replace(/(super-|admin-)/g, '') // Remove role prefixes
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  const currentLanguageName = computed(() => {
    const lang = availableLanguages.find((l) => l.code === locale.value)
    return lang ? lang.name : ''
  })

  const changeLanguage = (langCode) => {
    locale.value = langCode
    localStorage.setItem('userLanguage', langCode)
  }
  onMounted(() => {
    const savedLanguage = localStorage.getItem('userLanguage')
    if (savedLanguage) {
      locale.value = savedLanguage
    }
  })
</script>

<style scoped>
  [dir='rtl'] .v-breadcrumbs {
    direction: rtl;
  }

  [dir='rtl'] .v-breadcrumbs-item {
    flex-direction: row-reverse;
  }

  .divider-wrapper {
    padding: 0 4px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  .breadcrumb-item {
    display: inline-flex;
    align-items: center;
    flex-direction: row;
  }

  [dir='rtl'] .breadcrumb-item {
    flex-direction: row-reverse;
  }

  .active-crumb {
    color: var(--v-primary-base);
    font-weight: bold;
  }
</style>
