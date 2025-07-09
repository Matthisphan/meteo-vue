<script setup lang="ts">
import WeatherSearch from '../components/WeatherSearch.vue'
import WeatherCard from '../components/WeatherCard.vue'
import { useWeatherStore } from '../stores/weatherStore'

const weatherStore = useWeatherStore()
</script>

<template>
  <div class="min-h-screen p-4 bg-gray-100 space-y-4">
    <WeatherSearch />

    <div v-if="weatherStore.error" class="text-red-500 text-center">
      {{ weatherStore.error }}
    </div>

    <WeatherCard :data="weatherStore.weatherData" />

    <div v-if="weatherStore.weatherData" class="text-center">
      <router-link
          :to="`/detail/${weatherStore.city}`"
          class="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Voir plus de détails
      </router-link>
    </div>
  </div>
</template>
