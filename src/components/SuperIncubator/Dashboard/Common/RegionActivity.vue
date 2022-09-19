<template>
  <v-row>
    <v-col col cols="12" md="8">
      <startups-per-region></startups-per-region>
    </v-col>
    <v-col col cols="12" md="4">
      <top-performing-startup></top-performing-startup>
    </v-col>
  </v-row>
</template>

<script>
import StartupsPerRegion from "../Graphs/Regions/StartupsPerRegion.vue";
import TopPerformingStartup from "../Graphs/Regions/TopPerformingStartup.vue";
export default {
  components: { StartupsPerRegion, TopPerformingStartup },
};
</script>

<style>
</style>