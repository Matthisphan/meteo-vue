import { defineStore } from 'pinia'

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    city: '',
    weatherData: null as null | any,
    error: ''
  }),
  actions: {
    setCity(city: string) {
      this.city = city
    },
    setWeatherData(data: any) {
      this.weatherData = data
    },
    setError(error: string) {
      this.error = error
    }
  }
})
