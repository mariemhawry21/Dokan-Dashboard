<template>
  <v-app-bar color="background" style="box-shadow: none;position: fixed;">
    <v-app-bar-nav-icon v-if="isMobile" @click="$emit('toggle-drawer')" />
    <v-toolbar-title>{{ pageTitle.toUpperCase() }}</v-toolbar-title>
    <v-btn
      icon
      @click="toggleTheme"
      :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    >
      <v-icon>{{ isDark ? "mdi-weather-sunny" : "mdi-weather-night" }}</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const pageTitle = computed(() => route.meta.title || route.name);
import useThemeToggle from "../composables/useThemeToggle";
const { isDark, toggleTheme } = useThemeToggle();
defineProps(["drawer", "isMobile"]);
defineEmits(["toggle-drawer"]);
</script>
