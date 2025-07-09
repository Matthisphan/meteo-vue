<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useWeatherAPI } from '../composables/useWeatherAPI'
import { useWeatherStore } from '../stores/weatherStore'
import WeatherCard from '../components/WeatherCard.vue'

const route = useRoute()
const { fetchWeather } = useWeatherAPI()
const weatherStore = useWeatherStore()

onMounted(() => {
  const city = route.params.city as string
  if (city) {
    fetchWeather(city)
  }
})
</script>

<template>
  <div class="min-h-screen p-4 bg-gray-100">
    <h1 class="text-2xl font-bold mb-4 text-center">
      Météo à {{ weatherStore.city }}
    </h1>
    <div v-if="weatherStore.error" class="text-red-500 text-center">
      {{ weatherStore.error }}
    </div>
    <WeatherCard :data="weatherStore.weatherData" />
  </div>
</template>
