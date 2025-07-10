import { useWeatherStore } from '../stores/weatherStore'

const API_KEY = 'a833901cea998295fa4363f7f3ee9380'

export function useWeatherAPI() {
  const store = useWeatherStore()

  const fetchWeather = async (cityWithCountry: string) => {
    store.setError('')
    store.setWeatherData(null)
    store.setCity(cityWithCountry)

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityWithCountry)}&units=metric&lang=fr&appid=${API_KEY}`
      )

      if (!response.ok) {
        throw new Error('Ville non trouvée')
      }

      const data = await response.json()
      store.setWeatherData(data)
    } catch (error: any) {
      store.setError(error.message || 'Erreur inconnue')
    }
  }

  const fetchForecast = async (cityWithCountry: string) => {
    store.setError('')
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityWithCountry)}&units=metric&lang=fr&appid=${API_KEY}`
      )
      if (!response.ok) {
        throw new Error('Prévisions non disponibles')
      }
      const data = await response.json()
      store.setForecastData(data)
    } catch (error: any) {
      store.setError(error.message || 'Erreur inconnue')
    }
  }

  return {
    fetchWeather,
    fetchForecast  
  }
}
