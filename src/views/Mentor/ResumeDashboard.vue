<template>
  <v-container>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <h3 class="heading">Mentor Profile</h3>
    <profile :data="data" class="item"></profile>
    <about :data="data" class="item"></about>
    <current-mentees class="item" />
    <mentorship class="item"></mentorship>
    <div class="upcomings">
      <div class="upcoming-col">
        <h3 class="heading">Upcoming Events</h3>
        <upcoming-events></upcoming-events>
      </div>
      <div class="upcoming-col">
        <h3 class="heading">Mentoring Session</h3>
        <upcoming-sessions></upcoming-sessions>
      </div>
    </div>
    <activity-log class="item"></activity-log>
    <div class="item pt-3">
      <h3 class="heading">Average mentoring feedback</h3>
      <average-mentoring-feedback class="ma-3"></average-mentoring-feedback>
    </div>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import UpcomingEvents from "../../components/Events/UpcomingEvents.vue";
import AverageMentoringFeedback from "../../components/Incubator/Dashboards/Graphs/Mentor/AverageMentoringFeedback.vue";
import CurrentMentees from "../../components/Mentor/CurrentMentees.vue";
import About from "../../components/Mentor/ResumeProfile/About.vue";
import ActivityLog from "../../components/Mentor/ResumeProfile/ActivityLog.vue";
import Mentorship from "../../components/Mentor/ResumeProfile/Mentorship.vue";
import Profile from "../../components/Mentor/ResumeProfile/Profile.vue";
import UpcomingSessions from "../../components/Mentorship/UpcomingSessions.vue";
import { mentorsRef } from "../../config/firebase_services";
export default {
  components: {
    Profile,
    About,
    CurrentMentees,
    Mentorship,
    ActivityLog,
    AverageMentoringFeedback,
    UpcomingEvents,
    UpcomingSessions,
  },
  name: "ResumeDashboard",
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  data() {
    return {
      mentorId: "",
      data: {},
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
        },
        {
          text: "Mentors",
          disabled: true,
        },
        {
          text: "Profile",
          disabled: true,
        },
      ],
    };
  },
  created() {
    this.setMentorId();
    this.setMentorData();
  },
  methods: {
    setMentorId() {
      this.mentorId =
        this.$route.params.id !== undefined
          ? this.$route.params.id
          : this.$store.state.user.currentUser.docId;
    },
    async setMentorData() {
      const document = await mentorsRef.doc(this.mentorId).get();
      this.data = document.data();
    },
  },
};
</script>

<style scoped>
.item {
  width: 96%;
  border: 1px solid #ccc;
  margin: 0 auto;
  margin-bottom: 20px;
  border-radius: 5px;
  background-color: #fff;
}

.upcomings {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem auto;
  width: 96%;
}

.upcoming-col {
  width: 46%;
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  padding: 1rem;
}

.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}

@media only screen and (max-width: 600px) {
  .container {
    padding: 0 !important;
  }
}
</style>