<template>
  <v-row>
    <v-col cols="12" md="8">
      <jobs-created-per-month></jobs-created-per-month>
    </v-col>
    <v-col cols="12" md="4">
      <upcoming-events></upcoming-events>
    </v-col>
  </v-row>
</template>

<script>
import JobsCreatedPerMonth from "../Graphs/Jobs/JobsCreatedPerMonth.vue";
import UpcomingEvents from "../Graphs/Jobs/UpcomingEvents.vue";
export default {
  components: { JobsCreatedPerMonth, UpcomingEvents },
};
</script>

<style>
</style>