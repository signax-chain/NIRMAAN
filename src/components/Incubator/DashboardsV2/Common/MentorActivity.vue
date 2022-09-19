<template>
  <div>
    <v-row>
      <v-col cols="12" md="12">
        <!-- <mentor-login></mentor-login> -->
        <mentor-overview
          v-if="
            $route.query.tab === 'overview' || $route.query.tab === undefined
          "
        ></mentor-overview>
        <mentoring-hours v-else></mentoring-hours>
      </v-col>
      <!-- <mentor-of-the-week></mentor-of-the-week> -->
    </v-row>
    <router-link
      to="/dashboard?tab=mentors"
      v-if="$route.query.tab === undefined || $route.query.tab === 'overview'"
    >
      <v-btn color="traktor" dark class="mt-2 d-block ml-auto">
        View more details <v-icon>mdi-arrow-right</v-icon>
      </v-btn>
    </router-link>
  </div>
</template>

<script>
import MentoringHours from "../Graphs/Mentor/MentoringHours.vue";
// import MentorLogin from '../Graphs/Mentor/MentorLogin.vue';
// import MentorOfTheWeek from "./MentorOfTheWeek.vue";
import MentorOverview from "./MentorOverview.vue";
export default {
  components: {
    // MentorOfTheWeek,
    // MentorLogin,
    MentorOverview,
    MentoringHours,
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