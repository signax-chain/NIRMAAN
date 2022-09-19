<template>
  <div>
    <v-row>
      <v-col cols="12" md="12">
        <!-- <funding-per-cohort></funding-per-cohort> -->
        <funding-overview></funding-overview>
      </v-col>
      <!-- <recent-funded-startup></recent-funded-startup> -->
    </v-row>
    <!-- <router-link
      to="/dashboard?tab=funding"
      v-if="$route.query.tab === undefined || $route.query.tab === 'overview'"
    >
      <v-btn color="traktor" dark class="mt-2 d-block ml-auto">
        View more details <v-icon>mdi-arrow-right</v-icon>
      </v-btn>
    </router-link> -->
  </div>
</template>

<script>
// import FundingPerCohort from "../Graphs/Funding/FundingPerCohort.vue";
// import RecentFundedStartup from "../Graphs/Funding/RecentFundedStartup.vue";
import FundingOverview from "./FundingOverview.vue";
export default {
  components: {
    // RecentFundedStartup,
    FundingOverview,
    // FundingPerCohort
  },
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