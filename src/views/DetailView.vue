<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from "vue";
import { useWeatherGradient } from "../composables/useWeatherGradient.ts";
import { useRoute, useRouter } from "vue-router";
import { useWeatherAPI } from "../composables/useWeatherAPI";
import { useWeatherStore } from "../stores/weatherStore";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const { gradientStyle } = useWeatherGradient();
const route = useRoute();
const router = useRouter();
const { fetchWeather, fetchForecast } = useWeatherAPI();
const weatherStore = useWeatherStore();
console.log("Weather Store:", weatherStore);
const selectedView = ref("Température");
const viewOptions = ["Température", "Humidité", "Pression", "Vent"];
let chartInstance: Chart | null = null;

const getChartData = () => {
  if (!weatherStore.forecastData) return { labels: [], data: [], unit: "" };
  const today = new Date();
  const points = weatherStore.forecastData.list
    .filter((item: any) => {
      const d = new Date(item.dt * 1000);
      return d.getDate() === today.getDate();
    })
    .map((item: any) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temp: item.main.temp,
      humidity: item.main.humidity,
      pressure: item.main.pressure,
      wind: item.wind.speed,
    }));
  let data: number[];
  let unit: string;
  switch (selectedView.value) {
    case "Humidité":
      data = points.map((p: any) => p.humidity);
      unit = "%";
      break;
    case "Pression":
      data = points.map((p: any) => p.pressure);
      unit = "hPa";
      break;
    case "Vent":
      data = points.map((p: any) => p.wind);
      unit = "m/s";
      break;
    default:
      data = points.map((p: any) => p.temp);
      unit = "°C";
  }
  return { labels: points.map((p: any) => p.time), data, unit };
};

const renderChart = () => {
  const canvas = document.getElementById("weatherChart") as HTMLCanvasElement;
  const ctx = canvas?.getContext("2d");
  const { labels, data, unit } = getChartData();
  if (ctx && labels.length) {
    chartInstance?.destroy();
    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: `${selectedView.value} (${unit})`,
            data,
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 2,
            pointRadius: 4,
            tension: 0.4,
          },
        ],
      },
      options: { scales: { y: { beginAtZero: false } }, responsive: true },
    });
  }
};

onMounted(async () => {
  const city = route.params.city as string;
  if (city) {
    await fetchWeather(city);
    await fetchForecast(city);
  }
  await nextTick();
  renderChart();
});

watch([selectedView, () => weatherStore.forecastData], async () => {
  await nextTick();
  renderChart();
});
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex flex-col items-center py-8 px-4"
    :style="{ background: gradientStyle }"
  >
    <button
      @click="router.back()"
      class="self-start mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-lg shadow hover:shadow-lg transition cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5 text-indigo-600 cursor-pointer"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      <span class="text-indigo-600 font-medium">Retour</span>
    </button>

    <h1 class="text-4xl font-extrabold text-gray-800 mb-8 text-center relative">
      Météo à {{ weatherStore.city }}
      <span
        class="block absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-24 h-1 bg-indigo-600 rounded"
      ></span>
    </h1>

    <div class="flex space-x-4 mb-8">
      <button
        v-for="view in viewOptions"
        :key="view"
        @click="selectedView = view"
        :class="[
          'flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition cursor-pointer',
          selectedView === view
            ? 'bg-indigo-600 text-white shadow-lg'
            : 'bg-white text-gray-700 hover:bg-indigo-50',
        ]"
        :title="view"
      >
        <span
          class="p-2 rounded-full"
          :class="selectedView === view ? 'bg-white/30' : 'bg-white/20'"
        >
          <svg
            v-if="view === 'Température'"
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            :class="
              selectedView === view
                ? 'text-indigo-600 cursor-pointer'
                : 'text-gray-700 cursor-pointer'
            "
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
              />
            </svg>
          </svg>
          <svg
            v-else-if="view === 'Humidité'"
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            :class="
              selectedView === view
                ? 'text-indigo-600 cursor-pointer'
                : 'text-gray-700 cursor-pointer'
            "
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z"
              />
            </svg>
          </svg>
          <svg
            v-else-if="view === 'Pression'"
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            :class="
              selectedView === view
                ? 'text-indigo-600 cursor-pointer'
                : 'text-gray-700 cursor-pointer'
            "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <?xml version="1.0" encoding="utf-8"?><svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 122.88 106.3"
              style="enable-background: new 0 0 122.88 106.3"
              xml:space="preserve"
            >
              <g>
                <path
                  d="M58.15,52.98l28.6-18.22c0.2-0.15,0.48-0.12,0.65,0.06l2.76,2.94c0.17,0.18,0.18,0.47,0.02,0.66L68.51,63.6 c-3.08,3.31-6.37,3.96-9.02,3.1c-1.32-0.43-2.47-1.22-3.35-2.25c-0.88-1.02-1.49-2.27-1.74-3.61c-0.49-2.67,0.49-5.66,3.73-7.85 L58.15,52.98L58.15,52.98z M19.33,106.17c-3.05-2.87-5.8-6.05-8.21-9.48c-2.39-3.4-4.44-7.06-6.11-10.91 C3.38,82,2.12,78.02,1.26,73.88C0.44,69.86,0,65.7,0,61.44c0-8.32,1.66-16.25,4.65-23.49C7.77,30.43,12.33,23.66,18,18 c5.66-5.66,12.43-10.23,19.95-13.34C45.19,1.66,53.12,0,61.44,0c8.3,0,16.21,1.66,23.43,4.66c7.52,3.12,14.28,7.7,19.95,13.37 c5.68,5.68,10.26,12.46,13.38,19.97c3.01,7.24,4.68,15.16,4.68,23.44c0,4.05-0.4,8.01-1.16,11.85c-0.78,3.94-1.95,7.75-3.46,11.4 c-1.54,3.71-3.43,7.25-5.64,10.55c-2.23,3.34-4.78,6.45-7.6,9.3c-0.19,0.19-0.51,0.19-0.7,0l-3.07-3.06 c-0.06-0.02-0.12-0.06-0.17-0.11l-8.56-8.56c-0.19-0.19-0.19-0.51,0-0.7l4.49-4.49c0.19-0.19,0.51-0.19,0.7,0l6.61,6.61 c1.4-1.82,2.69-3.72,3.85-5.7c1.25-2.12,2.35-4.34,3.3-6.63c1.28-3.1,2.29-6.35,2.97-9.71c0.64-3.12,1-6.35,1.07-9.64h-9.11 c-0.27,0-0.5-0.22-0.5-0.5V55.7c0-0.27,0.22-0.5,0.5-0.5h8.76c-0.68-5.85-2.31-11.43-4.72-16.58c-2.49-5.31-5.82-10.15-9.82-14.37 l-5.86,5.86c-0.19,0.19-0.51,0.19-0.7,0l-4.49-4.49c-0.19-0.19-0.19-0.51,0-0.7l5.65-5.65c-4.44-3.57-9.45-6.46-14.87-8.5 C75.1,8.8,69.47,7.62,63.6,7.39v8.03c0,0.27-0.22,0.5-0.5,0.5h-6.36c-0.27,0-0.5-0.22-0.5-0.5V7.59 c-5.83,0.55-11.4,2.04-16.54,4.29c-5.31,2.33-10.17,5.49-14.42,9.3l5.87,5.87c0.19,0.19,0.19,0.51,0,0.7l-4.49,4.49 c-0.19,0.19-0.51,0.19-0.7,0l-5.8-5.8c-3.73,4.4-6.78,9.41-8.96,14.86C9.1,46.6,7.79,52.29,7.44,58.23h9.03 c0.27,0,0.5,0.22,0.5,0.5v6.36c0,0.27-0.22,0.5-0.5,0.5H7.5c0.22,2.94,0.68,5.8,1.35,8.58c0.72,3.01,1.7,5.92,2.91,8.72 c1.05,2.43,2.27,4.76,3.64,6.98c1.29,2.09,2.72,4.09,4.28,5.97l7.24-7.24c0.19-0.19,0.51-0.19,0.7,0l4.49,4.49 c0.19,0.19,0.19,0.51,0,0.7c-4.14,4.14-8.09,8.11-12.09,12.36C19.84,106.35,19.53,106.36,19.33,106.17L19.33,106.17z"
                />
              </g>
            </svg>
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            :class="
              selectedView === view
                ? 'text-indigo-600 cursor-pointer'
                : 'text-gray-700 cursor-pointer'
            "
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <?xml version="1.0" encoding="utf-8"?><svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 122.88 74.78"
              style="enable-background: new 0 0 122.88 74.78"
              xml:space="preserve"
            >
              <g>
                <path
                  d="M28.69,53.38c-1.61,0-2.91-1.3-2.91-2.91c0-1.61,1.3-2.91,2.91-2.91h51.37c0.21,0,0.42,0.02,0.62,0.07 c1.84,0.28,3.56,0.8,5.1,1.63c1.7,0.92,3.15,2.19,4.27,3.89c3.85,5.83,3.28,11.24,0.56,15.24c-1.77,2.61-4.47,4.55-7.45,5.57 c-3,1.03-6.32,1.13-9.32,0.03c-4.54-1.66-8.22-5.89-8.76-13.55c-0.11-1.6,1.1-2.98,2.7-3.09c1.6-0.11,2.98,1.1,3.09,2.7 c0.35,4.94,2.41,7.56,4.94,8.48c1.71,0.62,3.67,0.54,5.48-0.08c1.84-0.63,3.48-1.79,4.52-3.32c1.49-2.19,1.71-5.28-0.61-8.79 c-0.57-0.86-1.31-1.51-2.18-1.98c-0.91-0.49-1.97-0.81-3.13-0.99H28.69L28.69,53.38z M15.41,27.21c-1.61,0-2.91-1.3-2.91-2.91 c0-1.61,1.3-2.91,2.91-2.91h51.21c1.17-0.18,2.23-0.5,3.14-0.99c0.87-0.47,1.61-1.12,2.18-1.98c2.32-3.51,2.09-6.6,0.61-8.79 c-1.04-1.53-2.68-2.69-4.52-3.32c-1.81-0.62-3.78-0.7-5.48-0.08c-2.52,0.92-4.59,3.54-4.94,8.48c-0.11,1.6-1.49,2.81-3.09,2.7 c-1.6-0.11-2.81-1.49-2.7-3.09c0.54-7.66,4.22-11.89,8.76-13.55c3-1.09,6.32-0.99,9.32,0.03c2.98,1.02,5.68,2.97,7.45,5.57 c2.72,4,3.29,9.41-0.56,15.24c-1.12,1.7-2.57,2.97-4.27,3.89c-1.54,0.83-3.26,1.35-5.1,1.63c-0.2,0.04-0.41,0.07-0.62,0.07H15.41 L15.41,27.21z M2.91,40.3C1.3,40.3,0,38.99,0,37.39c0-1.61,1.3-2.91,2.91-2.91h107.07c1.17-0.18,2.23-0.5,3.13-0.99 c0.87-0.47,1.61-1.12,2.18-1.98c2.32-3.51,2.09-6.6,0.61-8.79c-1.04-1.53-2.68-2.69-4.52-3.32c-1.81-0.62-3.78-0.7-5.48-0.08 c-2.52,0.92-4.59,3.54-4.94,8.48c-0.11,1.6-1.49,2.81-3.09,2.7c-1.6-0.11-2.81-1.49-2.7-3.09c0.54-7.66,4.22-11.89,8.76-13.55 c3-1.09,6.32-0.99,9.32,0.03c2.98,1.02,5.68,2.97,7.45,5.57c2.72,4,3.29,9.41-0.56,15.24c-1.12,1.7-2.57,2.97-4.27,3.89 c-1.54,0.83-3.26,1.35-5.1,1.63c-0.2,0.04-0.41,0.07-0.62,0.07H2.91L2.91,40.3z"
                />
              </g>
            </svg>
          </svg>
        </span>
      </button>
    </div>

    <div class="w-full max-w-xl mb-8">
      <div
        class="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-lg flex flex-col items-center space-y-4"
      >
        <span class="text-lg text-gray-600 uppercase tracking-widest"
          >Actuel</span
        >
        <span class="text-5xl font-bold text-indigo-600">
          <template v-if="selectedView === 'Température'">
            {{ Math.round(weatherStore.weatherData.main.temp) }}°C
          </template>
          <template v-else-if="selectedView === 'Humidité'">
            {{ weatherStore.weatherData.main.humidity }}%
          </template>
          <template v-else-if="selectedView === 'Pression'">
            {{ weatherStore.weatherData.main.pressure }} hPa
          </template>
          <template v-else>
            {{ weatherStore.weatherData.wind.speed }} m/s
          </template>
        </span>
      </div>
    </div>

    <div
      class="w-full max-w-4xl bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-xl"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold text-gray-800">Aujourd'hui</h2>
      </div>
      <canvas id="weatherChart" class="w-full h-64"></canvas>
    </div>
  </div>
</template>
