// composables/useWeatherGradient.ts
import { computed } from "vue";
import { useWeatherStore } from "../stores/weatherStore";

export function useWeatherGradient() {
    const weatherStore = useWeatherStore();

    const gradientStyle = computed<string>(() => {
        const weather = weatherStore.weatherData?.weather[0]?.main || "";

        switch (weather) {
            case "Clear":
                return "linear-gradient(135deg, #bfdbfe, #3b82f6)";
            case "Clouds":
                return "linear-gradient(135deg, #d1d5db, #4b5563)";
            case "Rain":
                return "linear-gradient(135deg, #9ca3af, #1f2937)";
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

    return { gradientStyle };
}