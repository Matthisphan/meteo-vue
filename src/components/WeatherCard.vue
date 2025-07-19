<script setup lang="ts">
import { defineProps } from "vue";

interface WeatherData {
  name: string;
  sys: { country: string; sunrise: number; sunset: number };
  weather: { icon: string; description: string }[];
  main: { temp: number; humidity: number };
  wind: { speed: number };
}

defineProps<{ data: WeatherData | null }>();

function formatTime(unix: number) {
  const date = new Date(unix * 1000);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<template>
  <div v-if="data" class="max-w-sm bg-white rounded-lg shadow p-6 space-y-4">
    <div class="grid grid-cols-1 justify-items-center">
      <div class="bg-white/80 backdrop-blur-sm p-3 rounded-full drop-shadow-lg max-w-1/2">
        <img
          :src="`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`"
          :alt="data.weather[0].description"
          class="w-20 h-20"
        />
      </div>
      <div>
        <h2 class="text-2xl font-semibold text-gray-800">
          {{ data.name }}, {{ data.sys.country }}
        </h2>
        <p class="uppercase text-sm text-gray-500">
          {{ data.weather[0].description }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 text-center">
      <div>
        <p class="text-xl font-bold text-gray-800">
          {{ Math.round(data.main.temp) }}°C
        </p>
        <span class="text-sm text-gray-500">Température</span>
      </div>
      <div>
        <p class="text-xl font-bold text-gray-800">
          {{ formatTime(data.sys.sunrise) }} / {{ formatTime(data.sys.sunset) }}
        </p>
        <span class="text-sm text-gray-500">Lever / Coucher</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.drop-shadow-lg img {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}
</style>
