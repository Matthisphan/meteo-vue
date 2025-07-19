import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWeatherStore = defineStore('weather', () => {
  const city = ref('')
  const weatherData = ref<any | null>(null)
  const forecastData = ref<any | null>(null)
  const error = ref('')

  function setCity(value: string) {
    city.value = value
  }

  function setWeatherData(data: any) {
    weatherData.value = data
  }

  function setForecastData(data: any) {
    forecastData.value = data
  }

  function setError(msg: string) {
    error.value = msg
  }

  return {
    city,
    weatherData,
    forecastData,
    error,
    setCity,
    setWeatherData,
    setForecastData,
    setError
  }
})

