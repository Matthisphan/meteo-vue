<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useWeatherAPI } from '../composables/useWeatherAPI'
import { useWeatherStore } from '../stores/weatherStore'

type City = {
  name: string
  country: string
}

const store = useWeatherStore()
const { fetchWeather } = useWeatherAPI()

const allCities = ref<City[]>([])
const filteredCities = ref<City[]>([])
const search = ref('')
const showDropdown = ref(false)

const error = computed(() => store.error)

onMounted(() => {
  store.setWeatherData(null)
  store.setError('')
  fetchCities()
  document.addEventListener('click', handleClickOutside)
})

const fetchCities = async () => {
  const response = await fetch('/data/villeMonde.json')
  const data = await response.json()
  allCities.value = data
}

const onInput = () => {
  const query = search.value.toLowerCase()
  if (query.length > 0) {
    filteredCities.value = allCities.value
        .filter(city => city.name.toLowerCase().includes(query))
        .slice(0, 10)
    showDropdown.value = true
  } else {
    filteredCities.value = []
    store.setWeatherData(null)
    store.setError('')
    showDropdown.value = false
  }
}

const selectCity = async (city: City) => {
  search.value = `${city.name}, ${city.country}`
  showDropdown.value = false
  await fetchWeather(`${city.name},${city.country}`)
}

const handleKeydown = async (event: KeyboardEvent) => {
  if (event.key === 'Enter' && search.value.trim() !== '') {
    const inputCity = search.value.trim().toLowerCase()

    const matchedCity = allCities.value.find(
        city => `${city.name}, ${city.country}`.toLowerCase() === inputCity
    )

    if (matchedCity) {
      await fetchWeather(`${matchedCity.name},${matchedCity.country}`)
      showDropdown.value = false
    } else {
      store.setWeatherData(null)
      store.setError('Ville non trouvée')
    }
  }
}

const handleClickOutside = (event: MouseEvent) => {
  const el = document.getElementById('search-wrapper')
  if (el && !el.contains(event.target as Node)) {
    showDropdown.value = false
  }
}
</script>

<template>
  <div id="search-wrapper" class="relative w-full max-w-md mx-auto mt-8">
    <input
        v-model="search"
        @input="onInput"
        @keydown="handleKeydown"
        placeholder="Rechercher une ville"
        class="w-full border px-4 py-2 rounded"
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

    <div v-if="error" class="mt-4 text-red-500 text-center">{{ error }}</div>
  </div>
</template>
