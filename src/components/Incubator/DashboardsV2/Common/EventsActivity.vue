<template>
  <v-row>
    <v-col cols="12" md="8">
      <img
        src="../../../../assets/images/graphs/event-preview.svg"
        alt=""
        width="100%"
      />
    </v-col>
    <v-col cols="12" md="4">
      <upcoming-event></upcoming-event>
      <router-link
        to="/dashboard?tab=events"
        v-if="$route.query.tab === undefined || $route.query.tab === 'overview'"
      >
        <v-btn color="traktor" dark class="d-block mx-auto mt-2">
          View more details <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </router-link>
    </v-col>
  </v-row>
</template>

<script>
import UpcomingEvent from "../Graphs/Events/UpcomingEvent.vue";
export default {
  components: { UpcomingEvent },
};
</script>

<style scoped>
a {
  text-decoration: none;
}

h4 {
  color: #3aa959;
}
</style>