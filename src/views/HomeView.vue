<script setup lang="ts">
import SearchResults from "../components/SearchResults.vue";
import {useWeatherGradient} from "../composables/useWeatherGradient.ts";
const weatherEmojis = ["☀️", "🌧️", "⛈️", "❄️", "🌫️", "🌪️", "☁️", "💨", "🌤️"];
const { gradientStyle } = useWeatherGradient();
</script>

<template>
  <main
      class="min-h-screen bg-gradient-to-br from-blue-200 via-sky-300 to-indigo-400 flex items-center justify-center px-4"
      :style="{ background: gradientStyle }"
  >
    <section
        class="relative w-full lg:w-3/4 bg-white/60 backdrop-blur-md p-10 rounded-3xl shadow-2xl space-y-8 my-10 border border-white/30"
    >
      <h1 class="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight drop-shadow-sm text-center">
        WeatherWorld
      </h1>

      <p class="text-lg text-gray-700 text-center">
        Recherchez la météo de <span class="font-semibold text-blue-800">n'importe quelle ville</span> du monde en
        <span class="font-semibold text-indigo-700">temps réel</span> !
      </p>

      <SearchResults />

      <!-- Carousel d'emojis -->
      <div class="overflow-hidden w-1/2 align-center mx-auto rounded-full bg-gray-50/50 backdrop-blur-md shadow-inner p-4">
        <div class="whitespace-nowrap animate-scroll text-4xl md:text-5xl space-x-8 text-center">
          <span v-for="(emoji, index) in weatherEmojis" :key="index">{{ emoji }}</span>
          <span v-for="(emoji, index) in weatherEmojis" :key="'loop-' + index">{{ emoji }}</span>
        </div>
      </div>

    </section>
  </main>
</template>

<style scoped>
@keyframes scroll {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-scroll {
  display: inline-block;
  animation: scroll 20s linear infinite;
}

</style>
