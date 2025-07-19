<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useWeatherAPI } from "../composables/useWeatherAPI";
import { useWeatherStore } from "../stores/weatherStore";

type City = {
  name: string;
  country: string;
};

const store = useWeatherStore();
const { fetchWeather } = useWeatherAPI();

const allCities = ref<City[]>([]);
const filteredCities = ref<City[]>([]);
const search = ref("");
const showDropdown = ref(false);

// Placeholder cycling
const placeholders = [
  "Rechercher une ville",
  "Paris",
  "Tokyo",
  "New York",
  "Londres",
  "Mumbai",
];
const placeholder = ref(placeholders[0]);
let placeholderIndex = 0;
let intervalId: number;

onMounted(() => {
  store.setWeatherData(null);
  store.setError("");
  fetchCities();
  document.addEventListener("click", handleClickOutside);

  // Start cycling placeholder text
  intervalId = setInterval(() => {
    placeholderIndex = (placeholderIndex + 1) % placeholders.length;
    placeholder.value = placeholders[placeholderIndex];
  }, 3000); // every 3 seconds
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  clearInterval(intervalId);
});

const fetchCities = async () => {
  const response = await fetch("/data/villeMonde.json");
  const data = await response.json();
  allCities.value = data;
};

const onInput = () => {
  const query = search.value.toLowerCase();
  if (query.length > 0) {
    const exactMatches = allCities.value.filter(
        (city) => city.name.toLowerCase() === query
    );

    const partialMatches = allCities.value.filter(
        (city) =>
            city.name.toLowerCase().includes(query) &&
            city.name.toLowerCase() !== query
    );

    filteredCities.value = [...exactMatches, ...partialMatches].slice(0, 10);

    showDropdown.value = true;
  } else {
    filteredCities.value = [];
    store.setWeatherData(null);
    store.setError("");
    showDropdown.value = false;
  }
};

const selectCity = async (city: City) => {
  search.value = `${city.name}, ${city.country}`;
  showDropdown.value = false;
  await fetchWeather(`${city.name},${city.country}`);
};

const handleKeydown = async (event: KeyboardEvent) => {
  if (event.key === "Enter" && search.value.trim() !== "") {
    const inputCity = search.value.trim().toLowerCase();

    const matchedCity = allCities.value.find(
        (city) => `${city.name}, ${city.country}`.toLowerCase() === inputCity
    );

    if (matchedCity) {
      await fetchWeather(`${matchedCity.name},${matchedCity.country}`);
      showDropdown.value = false;
    } else {
      store.setWeatherData(null);
      store.setError("Ville non trouvée");
    }
  }
};

const handleClickOutside = (event: MouseEvent) => {
  const el = document.getElementById("search-wrapper");
  if (el && !el.contains(event.target as Node)) {
    showDropdown.value = false;
  }
};
</script>


<template>
  <div id="search-wrapper" class="relative w-full max-w-lg mx-auto my-8 z-50 md:scale-120">
    <input
        v-model="search"
        :placeholder="placeholder"
        @input="onInput"
        @keydown="handleKeydown"
        class="w-full px-4 py-2 rounded outline-5 outline-blue-200 ring-10 focus:outline-none ring-blue-100 focus:ring-4 focus:ring-blue-500 transition bg-indigo-100 shadow-inner"
    />

    <ul
      v-if="showDropdown"
      class="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-y-auto"
    >
      <li
        v-for="city in filteredCities"
        :key="`${city.name}-${city.country}`"
        @click="selectCity(city)"
        class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
      >
        {{ city.name }}, {{ city.country }}
      </li>
    </ul>
  </div>
</template>
