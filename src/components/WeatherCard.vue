<script setup lang="ts">
import { defineProps } from 'vue'

interface WeatherData {
  name: string
  sys: { country: string; sunrise: number; sunset: number }
  weather: { icon: string; description: string }[]
  main: { temp: number; humidity: number }
  wind: { speed: number }
}

const props = defineProps<{ data: WeatherData | null }>()

function formatTime(unix: number) {
  const date = new Date(unix * 1000)
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div
      v-if="data"
      class="max-w-sm mx-auto bg-white rounded-lg shadow p-6 space-y-4"
  >
    <div class="flex items-center space-x-4">
      <img
          :src="`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`"
          :alt="data.weather[0].description"
          class="w-16 h-16"
      />
      <div>
        <h2 class="text-2xl font-semibold">
          {{ data.name }}, {{ data.sys.country }}
        </h2>
        <p class="text-gray-500 capitalize">
          {{ data.weather[0].description }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 text-center">
      <div>
        <p class="text-xl font-bold">{{ Math.round(data.main.temp) }}°C</p>
        <span class="text-sm text-gray-500">Température</span>
      </div>
      <div>
        <p class="text-xl font-bold">{{ data.main.humidity }} %</p>
        <span class="text-sm text-gray-500">Humidité</span>
      </div>
      <div>
        <p class="text-xl font-bold">{{ data.wind.speed }} m/s</p>
        <span class="text-sm text-gray-500">Vent</span>
      </div>
      <div>
        <p class="text-xl font-bold">
          {{ formatTime(data.sys.sunrise) }} / {{ formatTime(data.sys.sunset) }}
        </p>
        <span class="text-sm text-gray-500">Lever / Coucher</span>
      </div>
    </div>
  </div>
</template>