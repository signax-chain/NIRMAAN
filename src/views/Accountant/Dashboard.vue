<template>
  <div class="wrapper">
    <h4 class="heading mb-3">Overview</h4>
    <funding-overview></funding-overview>
    <h4 class="heading my-3">Top funded startups</h4>
    <top-10-funded-startups></top-10-funded-startups>
    <h4 class="heading my-3">Cohort/ Year wise funding</h4>
    <v-row>
      <v-col cols="12" md="4"> </v-col>
      <v-col cols="12" md="4"></v-col>
      <v-col cols="12" md="4">
        <v-select
          label="select field"
          :items="items"
          outlined
          dense
          v-model="cohortOrYear"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <cohort-funding
          v-if="cohortOrYear === 'Funding by cohort'"
        ></cohort-funding>
        <annual-cohort-vs-funding
          v-if="cohortOrYear === 'Funding by year'"
        ></annual-cohort-vs-funding>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
        <h4 class="heading my-3">Average funded startup</h4>
        <average-funded-startup></average-funded-startup>
      </v-col>
      <v-col cols="12" md="4">
        <h4 class="heading my-3">Percentage of funding utilized</h4>
        <percentage-of-funding-utilized></percentage-of-funding-utilized>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import FundingOverview from "../../components/Incubator/DashboardsV2/Common/FundingOverview.vue";
import AnnualCohortVsFunding from "../../components/Incubator/DashboardsV2/Graphs/Funding/AnnualCohortVsFunding.vue";
import AverageFundedStartup from "../../components/Incubator/DashboardsV2/Graphs/Funding/AverageFundedStartup.vue";
import CohortFunding from "../../components/Incubator/DashboardsV2/Graphs/Funding/CohortFunding.vue";
import PercentageOfFundingUtilized from "../../components/Incubator/DashboardsV2/Graphs/Funding/PercentageOfFundingUtilized.vue";
import Top10FundedStartups from "../../components/Incubator/DashboardsV2/Graphs/Funding/Top10FundedStartups.vue";
export default {
  components: {
    FundingOverview,
    Top10FundedStartups,
    CohortFunding,
    AnnualCohortVsFunding,
    AverageFundedStartup,
    PercentageOfFundingUtilized,
  },
  data() {
    return {
      items: ["Funding by cohort", "Funding by year"],
      cohortOrYear: "Funding by cohort",
    };
  },
};
</script>

<style scoped>
.wrapper {
  background-color: #fff;
  padding: 1rem;
}

h4 {
  font-weight: normal;
  color: #1f1f1f;
}
</style>