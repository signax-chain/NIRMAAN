<template>
  <div>
    <Header @download-dashboard="downloadDashboard"></Header>
    <div ref="downloadContainer" id="download_container">
      <h4 class="heading my-5">Overview</h4>
      <startup-overview></startup-overview>
      <v-row>
        <v-col cols="12" md="12">
          <h4 class="heading my-5">Funding</h4>
          <funding-activity></funding-activity>
        </v-col>
      </v-row>
      <!-- <v-row>
      <v-col cols="12" md="12">
        <h4 class="heading my-5">New Startups</h4>
        <new-startups></new-startups>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <h4 class="heading my-5">New Mentors</h4>
        <new-mentors></new-mentors>
      </v-col>
    </v-row> -->
      <h4 class="heading my-5">Startups</h4>
      <v-row>
        <v-col cols="12" md="12">
          <startups-per-cohort></startups-per-cohort>
        </v-col>
        <v-col cols="12" md="12" v-if="!progressLoader">
          <router-link to="/dashboard?tab=startup">
            <v-btn color="traktor" dark class="d-block ml-auto">
              View more details <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </router-link>
        </v-col>
      </v-row>
      <h4 class="heading my-5">Mentors</h4>
      <v-row>
        <v-col cols="12" md="12">
          <mentoring-hours></mentoring-hours>
        </v-col>
        <v-col cols="12" md="12" v-if="!progressLoader">
          <router-link to="/dashboard?tab=mentors">
            <v-btn color="traktor" dark class="d-block ml-auto">
              View more details <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </router-link>
        </v-col>
      </v-row>
      <h4 class="heading mb-2">Funding</h4>
      <v-row>
        <v-col cols="12" md="12">
          <funding-per-cohort></funding-per-cohort>
        </v-col>
        <v-col cols="12" md="12" v-if="!progressLoader">
          <router-link to="/dashboard?tab=funding">
            <v-btn color="traktor" dark class="d-block ml-auto">
              View more details <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </router-link>
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
import Header from "../../../components/Incubator/Dashboards/Common/Header.vue";
import StartupOverview from "./Common/StartupOverview.vue";
import FundingActivity from "./Common/FundingActivity.vue";
// import NewStartups from "./Common/NewStartups.vue";
// import NewMentors from "./Common/NewMentors.vue";
import StartupsPerCohort from "./Graphs/Startup/StartupsPerCohort.vue";
import MentoringHours from "./Graphs/Mentor/MentoringHours.vue";
import FundingPerCohort from "../Dashboards/Graphs/Funding/FundingPerCohort.vue";
import ProgressLoader from "../../Modals/Loaders/ProgressLoader.vue";
import dashboardExport from "../../../mixins/dashboard-export";

export default {
  name: "IncubatorDashboardOverview",
  components: {
    Header,
    StartupOverview,
    FundingActivity,
    // NewStartups,
    // NewMentors,
    StartupsPerCohort,
    MentoringHours,
    FundingPerCohort,
    ProgressLoader,
    // NewMentors,
    // NewStartups,
  },
  mixins: [dashboardExport],
};
</script>,
<style scoped>
h4 {
  font-weight: normal;
}

a {
  text-decoration: none;
}
</style>