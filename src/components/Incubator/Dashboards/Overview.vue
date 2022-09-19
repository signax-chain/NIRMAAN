<template>
  <div>
    <Header></Header>
    <!-- <h4 class="heading mb-2">Overview</h4>
    <overview></overview> -->
    <!-- <v-row>
      <v-col cols="12" md="12">
        <h4 class="heading mb-2">Activity</h4>
        <activity></activity>
      </v-col>
    </v-row> -->
    <v-row>
      <v-col cols="12" md="12">
        <h4 class="heading mb-2">Startups</h4>
        <startup-activity></startup-activity>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <h4 class="heading mb-2">Mentoring</h4>
        <mentor-activity></mentor-activity>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <h4 class="heading mb-2">Funding</h4>
        <funding-activity></funding-activity>
      </v-col>
    </v-row>
    <h4 class="heading mb-2">Impact</h4>
    <startup-impact></startup-impact>
    <!-- <v-row>
      <v-col cols="12" md="12">
        <h4 class="heading mb-2">Events</h4>
        <events-activity></events-activity>
      </v-col>
    </v-row> -->
  </div>
</template>

<script>
import Header from "../../../components/Incubator/Dashboards/Common/Header.vue";
// import Overview from "./Common/StartupOverview.vue";
import StartupActivity from "./Common/StartupActivity.vue";
import MentorActivity from "./Common/MentorActivity.vue";
import FundingActivity from "./Common/FundingActivity.vue";
// import EventsActivity from "./Common/EventsActivity.vue";
// import Activity from "./Graphs/Overview/Activity.vue";
import StartupImpact from "./Common/StartupImpact.vue";

export default {
  name: "IncubatorDashboardOverview",
  components: {
    Header,
    // Overview,
    StartupActivity,
    MentorActivity,
    FundingActivity,
    // EventsActivity,
    // Activity,
    StartupImpact,
  },
};
</script>

<style scoped>
h4 {
  font-weight: normal;
}
</style>