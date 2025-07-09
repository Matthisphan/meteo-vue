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

  return {
    fetchWeather
  }
}
