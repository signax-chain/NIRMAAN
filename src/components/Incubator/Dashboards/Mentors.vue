<template>
  <div class="mb-10">
    <Header></Header>
    <h4 class="heading mb-2">Overview</h4>
    <mentor-overview></mentor-overview>
    <v-row>
      <v-col cols="12" md="12">
        <!-- <h4 class="heading mb-2">Activity</h4> -->
        <mentor-activity></mentor-activity>
      </v-col>
    </v-row>
    <v-row>
      <!-- <v-col cols="12" md="6">
       
      </v-col> -->
      <v-col cols="12" md="6">
        <!-- <startups-per-mentor></startups-per-mentor> -->
        <h4
          class="mb-2"
          style="
            margin-top: 70px;
            font-family: Helvetica, Arial, sans-serif;
            opacity: 0.87;
            color: #000000de;
            font-size: 15px;
            font-weight: 900;
          "
        >
          Average startups per mentor
        </h4>
        <average-startups-per-mentor></average-startups-per-mentor>
      </v-col>
      <v-col cols="12" md="6">
        <!-- <assigned-not-assigned></assigned-not-assigned> -->
        <mentor-industries></mentor-industries>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <h4
          class="mb-2"
          style="
            margin-top: 70px;
            font-family: Helvetica, Arial, sans-serif;
            opacity: 0.87;
            color: #000000de;
            font-size: 15px;
            font-weight: 900;
          "
        >
          Average mentoring sessions per month
        </h4>
        <average-sessions-per-month></average-sessions-per-month>
      </v-col>
      <v-col cols="12" md="6">
        <h4
          class="mb-2"
          style="
            margin-top: 70px;
            font-family: Helvetica, Arial, sans-serif;
            opacity: 0.87;
            color: #000000de;
            font-size: 15px;
            font-weight: 900;
          "
        >
          Average duration of session
        </h4>
        <average-duration-of-session></average-duration-of-session>
      </v-col>
    </v-row>
    <!-- <h4 class="mb-2">Industry</h4>
    <v-row>
      <v-col cols="12" md="12">
      </v-col>
    </v-row> -->
    <!-- <h4 class="mb-2"><b>Demographics</b></h4> -->
    <v-row>
      <!-- <v-col cols="12" md="3">
        <gender-mentors></gender-mentors>
      </v-col>
      <v-col cols="12" md="3">
        <mentor-age></mentor-age>
      </v-col> -->
      <!-- <v-col cols="12" md="6">
        <mentor-course></mentor-course>
      </v-col> -->
    </v-row>
  </div>
</template>

<script>
import Header from "./Common/Header.vue";
import MentorOverview from "./Common/MentorOverview.vue";
import MentorActivity from "./Common/MentorActivity.vue";
import MentorIndustries from "./Graphs/Mentor/MentorIndustries.vue";
// import StartupsPerMentor from "./Graphs/Mentor/StartupsPerMentor.vue";
// import AssignedNotAssigned from "./Graphs/Mentor/AssignedNotAssigned.vue";
// import MentorSectors from "./Graphs/Mentor/MentorSectors.vue";
// import MentorIndustry from "./Graphs/Mentor/MentorIndustry.vue";
// import GenderMentors from "./Graphs/Mentor/GenderMentors.vue";
// import MentorAge from "./Graphs/Mentor/MentorAge.vue";
import AverageStartupsPerMentor from "./Graphs/Mentor/AverageStartupsPerMentor.vue";
import AverageSessionsPerMonth from "./Graphs/Mentor/AverageSessionsPerMonth.vue";
import AverageDurationOfSession from './Graphs/Mentor/AverageDurationOfSession.vue';
// import MentorCourse from "./Graphs/Mentor/MentorCourse.vue";

export default {
  components: {
    Header,
    MentorOverview,
    MentorActivity,
    MentorIndustries,
    // StartupsPerMentor,
    // AssignedNotAssigned,
    // MentorSectors,
    // MentorIndustry,
    // GenderMentors,
    // MentorAge,
    AverageStartupsPerMentor,
    AverageSessionsPerMonth,
    AverageDurationOfSession,
    // MentorCourse,
  },
  name: "IncubatorDashboardMentors",
};
</script>

<style scoped>
h4 {
  font-weight: normal;
  color: #1f1f1f;
  margin-top: 1rem;
}

/* >>> .row {
  text-align: center !important;
}

>>> .col-md-6 {
  margin: 0 auto !important;
  display: grid;
  place-items: center;
} */
</style>