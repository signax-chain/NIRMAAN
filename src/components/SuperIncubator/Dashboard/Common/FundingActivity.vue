<template>
  <v-row>
    <v-col col cols="12" md="8">
      <top-funded-incubators></top-funded-incubators>
    </v-col>
    <v-col col cols="12" md="4">
      <recent-funding-activity></recent-funding-activity>
    </v-col>
  </v-row>
</template>

<script>
import RecentFundingActivity from "../Graphs/Funding/RecentFundingActivity.vue";
import TopFundedIncubators from "../Graphs/Funding/TopFundedIncubators.vue";
export default {
  components: { TopFundedIncubators, RecentFundingActivity },
};
</script>

<style scoped>
</style>