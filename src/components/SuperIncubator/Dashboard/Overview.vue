<template>
  <div>
    <Header></Header>
    <h4 class="heading mb-2">Impact</h4>
    <incubator-impact></incubator-impact>
    <v-row>
      <v-col cols="12" md="12">
        <h4 class="heading mb-2">Incubators</h4>
        <incubator-activity></incubator-activity>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <h4 class="heading mb-2">Regions</h4>
        <region-activity></region-activity>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <h4 class="heading mb-2">Funding</h4>
        <funding-activity></funding-activity>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <h4 class="heading mb-2">Jobs</h4>
        <jobs-activity></jobs-activity>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import FundingActivity from "./Common/FundingActivity.vue";
import Header from "./Common/Header.vue";
import IncubatorActivity from "./Common/IncubatorActivity.vue";
import IncubatorImpact from "./Common/IncubatorImpact.vue";
import JobsActivity from "./Common/JobsActivity.vue";
import RegionActivity from "./Common/RegionActivity.vue";

export default {
  name: "IncubatorDashboardOverview",
  components: {
    Header,
    IncubatorImpact,
    IncubatorActivity,
    RegionActivity,
    FundingActivity,
    JobsActivity,
  },
};
</script>

<style scoped>
h4 {
  font-weight: normal;
}
</style>