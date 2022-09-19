<template>
  <div>
    <Header @download-dashboard="downloadDashboard"></Header>
    <div ref="downloadContainer" id="download_container">
      <h4 class="heading mb-2">Overview</h4>
      <startup-overview></startup-overview>
      <!-- <v-row>
      <v-col cols="12" md="12">
        <h4 class="heading my-5">New Startups</h4>
        <new-startups></new-startups>
      </v-col>
    </v-row> -->
      <v-row class="mt-5">
        <v-col cols="12" md="12">
          <v-row>
            <v-col cols="12" md="4">
              <h4 class="heading mb-2">Startups by cohort</h4>
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
          <startup-activity :option="cohortOrYear"></startup-activity>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="12">
          <startup-sector></startup-sector>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="12">
          <!-- <h4 class="heading mb-2">Most represented sector</h4> -->
          <v-row>
            <!-- <v-col cols="12" md="6">
            <startup-industry></startup-industry>
          </v-col> -->
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="12">
          <!-- <h4 class="heading mb-2">Demographics</h4> -->
          <v-row>
            <v-col cols="12" md="6">
              <gender-founders class="mt-4"></gender-founders>
            </v-col>
            <v-col cols="6">
              <h4
                class="mb-2"
                style="
                  font-family: Helvetica, Arial, sans-serif;
                  opacity: 0.87;
                  color: #000000de;
                  font-size: 15px;
                  font-weight: 900;
                "
              >
                Average startups per cohort
              </h4>
              <average-startups-per-cohort></average-startups-per-cohort>
            </v-col>
            <!-- <v-col cols="6">
            <course-founder></course-founder>
          </v-col> -->
            <v-col cols="12" md="12">
              <h4
                class="mb-2"
                style="
                  font-family: Helvetica, Arial, sans-serif;
                  opacity: 0.87;
                  color: #000000de;
                  font-size: 15px;
                  font-weight: 900;
                "
              >
                Founders by Student ID
              </h4>
              <student-id-classification></student-id-classification>
            </v-col>
          </v-row>
          <h4 class="heading my-5">Impact</h4>
          <startup-impact></startup-impact>
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
import StartupActivity from "./Common/StartupActivity.vue";
// import StartupIndustry from "./Graphs/Startup/StartupIndustry.vue";
import StartupSector from "./Graphs/Startup/StartupSector.vue";
// import StartupStage from "./Graphs/Startup/StartupStage.vue";
import GenderFounders from "./Graphs/Startup/GenderFounders.vue";
// import CourseFounder from "./Graphs/Startup/CourseFounder.vue";
import AverageStartupsPerCohort from "./Graphs/Startup/AverageStartupsPerCohort.vue";
import ProgressLoader from "../../Modals/Loaders/ProgressLoader.vue";
// import NewStartups from "./Common/NewStartups.vue";
// import StartupsPerCohort from "./Graphs/Startup/StartupsPerCohort.vue";
import dashboardExport from "../../../mixins/dashboard-export";
import StudentIdClassification from "../Dashboards/Graphs/Startup/StudentIdClassification.vue";
import StartupImpact from "../Dashboards/Common/StartupImpact.vue";

export default {
  name: "IncubatorDashboardStartup",
  components: {
    Header,
    StartupOverview,
    StartupActivity,
    // StartupStage,
    StartupSector,
    // StartupIndustry,
    GenderFounders,
    // CourseFounder,
    AverageStartupsPerCohort,
    ProgressLoader,
    StudentIdClassification,
    StartupImpact,
    // NewStartups,
    // StartupsPerCohort
  },
  data() {
    return {
      items: ["Startups by cohort", "Startups by year"],
      cohortOrYear: "Startups by cohort",
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