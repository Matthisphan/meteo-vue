<template>
  <div
      ref="mapContainer"
      class="w-full h-64 md:h-auto rounded-xl overflow-hidden border-4 border-white/50 shadow-inner z-30"
  ></div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch, nextTick } from "vue";
import { useWeatherStore } from "../stores/weatherStore";
import L, { Map, Marker } from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const weatherStore = useWeatherStore();
const mapContainer = ref<HTMLDivElement | null>(null);
const map = ref<Map | null>(null);
const marker = ref<Marker | null>(null);

watch(
    () => weatherStore.weatherData,
    async (data) => {
      if (!data) return;

      await nextTick();
      const el = mapContainer.value;
      if (!el) return;

      if (map.value) {
        map.value.remove();
        map.value = null;
        marker.value = null;
      }

      const { lat, lon } = data.coord;
      map.value = L.map(el).setView([lat, lon], 10);
      const leafletMap = map.value as Map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(leafletMap);

      marker.value = L.marker([lat, lon]).addTo(leafletMap);
    },
    { immediate: true }
);

onUnmounted(() => {
  map.value?.remove();
});
</script>
