<template>
  <div>
    <Header></Header>
    <h4 class="heading mb-2">Overview</h4>
    <div class="events-row d-flex justify-space-between align-center">
      <event-card
        v-for="(event, index) in eventDetails"
        :event="event"
        :key="index"
      ></event-card>
    </div>
    <h4 class="heading mb-2">Weekly Activity</h4>
    <v-row>
      <v-col cols="12" md="8">
        <weekly-activity></weekly-activity>
      </v-col>
      <v-col cols="12" md="4">
      <upcoming-event></upcoming-event>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <number-of-events-conducted></number-of-events-conducted>
      </v-col>
      <v-col cols="12" md="3">
        <overall-startup-feedbacks></overall-startup-feedbacks>
      </v-col>
      <v-col cols="12" md="3">
        <overall-mentor-feedbacks></overall-mentor-feedbacks>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <events-vs-sectors></events-vs-sectors>
      </v-col>
      <v-col cols="12" md="6">
        <events-vs-industry></events-vs-industry>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Header from "./Common/Header.vue";
import eventStats from "../../../mixins/eventStats";
import EventCard from "../../Events/EventCard.vue";
import WeeklyActivity from "./Graphs/Events/WeeklyActivity.vue";
import NumberOfEventsConducted from "./Graphs/Events/NumberOfEventsConducted.vue";
import OverallStartupFeedbacks from "./Graphs/Events/OverallStartupFeedbacks.vue";
import OverallMentorFeedbacks from "./Graphs/Events/OverallMentorFeedbacks.vue";
import EventsVsSectors from "./Graphs/Events/EventsVsSectors.vue";
import EventsVsIndustry from "./Graphs/Events/EventsVsIndustry.vue";
import UpcomingEvent from './Graphs/Events/UpcomingEvent.vue';

export default {
  components: {
    Header,
    EventCard,
    WeeklyActivity,
    NumberOfEventsConducted,
    OverallStartupFeedbacks,
    OverallMentorFeedbacks,
    EventsVsSectors,
    EventsVsIndustry,
    UpcomingEvent,
  },
  name: "EventsIncubatorDashboard",
  mixins: [eventStats],
};
</script>

<style scoped>
h4 {
  font-weight: normal;
  color: #1f1f1f;
  margin-top: 1rem;
}
</style>