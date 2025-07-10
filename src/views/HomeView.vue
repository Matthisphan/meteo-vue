<template>
  <div
    class="min-h-screen p-4 bg-gray-100 space-y-4 items-center flex flex-col"
  >
    <WeatherSearch />

    <div v-if="weatherStore.error" class="text-red-500 text-center">
      {{ weatherStore.error }}
    </div>

    <div
      v-if="weatherStore.weatherData"
      :style="{ background: gradientStyle }"
      class="flex flex-col md:flex-row items-stretch gap-6 p-8 md:p-10 rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 w-[90%]"
    >
      <WeatherCard
        :data="weatherStore.weatherData"
        class="w-full md:w-1/3 bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg hover:scale-[1.02] transition-transform duration-200"
      />
      <div
        id="map"
        ref="mapContainer"
        class="w-full md:w-2/3 h-64 md:h-auto rounded-xl overflow-hidden border-4 border-white/50 shadow-inner z-30"
      ></div>
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
import { ref, watch, computed, nextTick } from "vue";
import WeatherSearch from "../components/WeatherSearch.vue";
import WeatherCard from "../components/WeatherCard.vue";
import { useWeatherStore } from "../stores/weatherStore";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const weatherStore = useWeatherStore();
const mapContainer = ref<HTMLDivElement | null>(null);
const map = ref<L.Map | null>(null);
const marker = ref<L.Marker | null>(null);

const gradientStyle = computed<string>(() => {
  const w = weatherStore.weatherData?.weather[0]?.main || "";
  switch (w) {
    case "Clear":
      return "linear-gradient(135deg, #bfdbfe, #3b82f6)";
    case "Clouds":
      return "linear-gradient(135deg, #d1d5db, #4b5563)";
    case "Rain":
    case "Drizzle":
      return "linear-gradient(135deg, #6b7280, #1e40af)";
    case "Thunderstorm":
      return "linear-gradient(135deg, #6d28d9, #111827)";
    case "Snow":
      return "linear-gradient(135deg, #ffffff, #93c5fd)";
    default:
      return "linear-gradient(135deg, #c7d2fe, #6366f1)";
  }
});

watch(
  () => weatherStore.weatherData,
  async (data) => {
    if (!data) return;

    await nextTick();
    const el = mapContainer.value;
    if (!el) return;

    if (map.value) {
      map.value.remove();
      map.value = null;
      marker.value = null;
    }

    const { lat, lon } = data.coord;
    map.value = L.map(el).setView([lat, lon], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map.value);

    marker.value = L.marker([lat, lon]).addTo(map.value);
  },
  { immediate: true }
);
</script>
