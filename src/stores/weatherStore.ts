import { defineStore } from 'pinia'

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    city: '',
    weatherData: null as any | null,
    forecastData: null as any | null,   
    error: ''
  }),
  actions: {
    setCity(city: string) {
      this.city = city
    },
    setWeatherData(data: any) {
      this.weatherData = data
    },
    setForecastData(data: any) {         
      this.forecastData = data
    },
    setError(error: string) {
      this.error = error
    }
  }
})
