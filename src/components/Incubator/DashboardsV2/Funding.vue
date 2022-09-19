<template>
  <div>
    <Header @download-dashboard="downloadDashboard"></Header>
    <div ref="downloadContainer" id="download_container">
      <h4 class="heading mb-2">Overview</h4>
      <funding :width="32"></funding>
      <!-- <h4 class="heading mb-2">Startups</h4> -->
      <v-row>
        <v-col cols="12" md="12">
          <top-10-funded-startups></top-10-funded-startups>
        </v-col>
        <!-- <v-col cols="12" md="4">
        <recent-funded-startup></recent-funded-startup>
      </v-col> -->
      </v-row>
      <v-row>
        <v-col cols="12" md="12">
          <!-- <industry-wise-startups-funded></industry-wise-startups-funded> -->
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="4">
          <!-- <h4 class="heading">Cohort</h4> -->
        </v-col>
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
        <v-col cols="12" md="8">
          <!-- <cohort-vs-funding></cohort-vs-funding> -->
          <top-funded-sectors></top-funded-sectors>
        </v-col>
        <v-col cols="12" md="4">
          <!-- <average-vs-funding></average-vs-funding> -->
          <h4
            class="heading mb-2 d-flex"
            style="
              margin-top: 70px;
              font-family: Helvetica, Arial, sans-serif;
              opacity: 0.87;
              color: #000000de;
              font-size: 15px;
              font-weight: 900;
            "
          >
            Average funding per startup
          </h4>
          <average-funding-per-startup></average-funding-per-startup>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4">
          <h4
            class="heading mb-2 d-flex"
            style="
              font-family: Helvetica, Arial, sans-serif;
              opacity: 0.87;
              color: #000000de;
              font-size: 15px;
              font-weight: 900;
            "
          >
            Average funded startups
          </h4>
          <average-funded-startup></average-funded-startup>
        </v-col>
        <v-col cols="12" md="4">
          <h4
            class="heading mb-2 d-flex"
            style="
              font-family: Helvetica, Arial, sans-serif;
              opacity: 0.87;
              color: #000000de;
              font-size: 15px;
              font-weight: 900;
            "
          >
            Percentage of funding utilized
          </h4>
          <percentage-of-funding-utilized></percentage-of-funding-utilized>
        </v-col>
      </v-row>
    </div>
    <progress-loader
      :visible="progressLoader"
      loaderText="preparing to download"
      @close="progressLoader = false"
    ></progress-loader>
  </div>
</template>

<script>
import Funding from "./Common/FundingOverview.vue";
import Header from "../../../components/Incubator/Dashboards/Common/Header.vue";
import CohortFunding from "./Graphs/Funding/CohortFunding.vue";
// import IndustryWiseStartupsFunded from "./Graphs/Funding/IndustryWiseStartupsFunded.vue";
// import StartupsFunding from "./Graphs/Funding/StartupsFunding.vue";
import Top10FundedStartups from "./Graphs/Funding/Top10FundedStartups.vue";
// import CohortVsFunding from "./Graphs/Funding/CohortVsFunding.vue";
import AnnualCohortVsFunding from "./Graphs/Funding/AnnualCohortVsFunding.vue";
// import AverageVsFunding from "./Graphs/Funding/AverageVsFunding.vue";
// import RecentFundedStartup from "./Graphs/Funding/RecentFundedStartup.vue";
import TopFundedSectors from "./Graphs/Funding/TopFundedSectors.vue";
import AverageFundingPerStartup from "./Graphs/Funding/AverageFundingPerStartup.vue";
import AverageFundedStartup from "./Graphs/Funding/AverageFundedStartup.vue";
import PercentageOfFundingUtilized from "./Graphs/Funding/PercentageOfFundingUtilized.vue";
import ProgressLoader from "../../Modals/Loaders/ProgressLoader.vue";
import dashboardExport from "../../../mixins/dashboard-export";

export default {
  components: {
    Header,
    Funding,
    Top10FundedStartups,
    // IndustryWiseStartupsFunded,
    // StartupsFunding,
    CohortFunding,
    // CohortVsFunding,
    AnnualCohortVsFunding,
    // AverageVsFunding,
    // RecentFundedStartup,
    TopFundedSectors,
    AverageFundingPerStartup,
    AverageFundedStartup,
    PercentageOfFundingUtilized,
    ProgressLoader,
  },
  data() {
    return {
      items: ["Funding by cohort", "Funding by year"],
      cohortOrYear: "Funding by cohort",
    };
  },
  mixins: [dashboardExport],
};
</script>

<style scoped>
h4 {
  font-weight: normal;
  color: #1f1f1f;
  margin-top: 1rem;
}
</style>