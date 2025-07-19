<template>
  <div
    class="space-y-4 items-center flex flex-col"
  >
    <WeatherSearch />

    <div v-if="weatherStore.error"
         class="backdrop-blur-sm bg-red-500/10 border border-red-300/30 text-red-800 px-6 py-4 rounded-2xl text-center shadow-lg">
      <div class="flex items-center justify-center space-x-3">
        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
          </path>
        </svg>
        <div>
          <p class="font-semibold">Service météo indisponible</p>
          <p class="text-sm text-red-600/80 mt-1">{{ weatherStore.error }}</p>
        </div>
      </div>
    </div>

    <div
      v-if="weatherStore.weatherData"
      :style="{ background: gradientStyle }"
      class="flex flex-col md:flex-row items-stretch gap-6 p-8 md:p-10 rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 w-full"
    >
      <WeatherCard
        :data="weatherStore.weatherData"
        class="w-full md:w-1/3 bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg hover:scale-[1.02] transition-transform duration-200"
      />
      <WeatherMap class="w-full md:w-2/3" />
    </div>

    <div v-if="weatherStore.weatherData" class="text-center">
      <router-link
        :to="`/detail/${weatherStore.city}`"
        class="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium uppercase tracking-wide rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        <span>Voir plus de détails</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useWeatherGradient} from "../composables/useWeatherGradient.ts";
import WeatherMap from "../components/WeatherMap.vue";
import WeatherSearch from "../components/WeatherSearch.vue";
import WeatherCard from "../components/WeatherCard.vue";
import { useWeatherStore } from "../stores/weatherStore";
import "leaflet/dist/leaflet.css";

const weatherStore = useWeatherStore();

const { gradientStyle } = useWeatherGradient();
</script>
