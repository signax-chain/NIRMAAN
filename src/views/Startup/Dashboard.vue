<template>
  <v-container>
    <v-row class="row__1">
      <v-col cols="12" md="4">
        <BasicDetails />
      </v-col>
      <v-col cols="12" md="8">
        <v-row class="row__1_progress">
          <v-col cols="12" md="6">
            <Progress />
          </v-col>
          <v-col cols="12" md="6">
            <fundings></fundings>
          </v-col>
        </v-row>
        <v-row class="row__1_about mt-10 mb-8">
          <v-col cols="12" md="12">
            <About />
          </v-col>
        </v-row>
        <v-row class="row__1_founders mt-10 mb-8">
          <v-col cols="12" md="12">
            <Founders />
          </v-col>
        </v-row>
        <v-row
          class="row__1_upcomings d-flex"
          v-if="currentUser.role === 'startup'"
        >
          <div class="row__1_upcomings_events">
            <UpcomingEvents />
          </div>
          <div class="row__1_upcomings_sessions">
            <UpcomingSessions />
          </div>
        </v-row>
        <v-row class="row__1_awards mt-10">
          <v-col cols="12" md="12">
            <AwardsandRecognitions />
          </v-col>
        </v-row>
        <v-row class="row__1_awards docs_row mt-10 mb-1">
          <v-col cols="12" md="12" class="mb-5">
            <Documents class="mt-2" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import About from "@/components/Startup/About";
import BasicDetails from "@/components/Startup/BasicDetails";
import UpcomingEvents from "@/components/Events/UpcomingEvents";
import UpcomingSessions from "@/components/Mentorship/UpcomingSessions";
import Progress from "@/components/Startup/Progress";
import AwardsandRecognitions from "@/components/Startup/AwardsandRecognitions";
import Founders from "@/components/Startup/Founders";
import Documents from "@/components/Startup/Documents";
import { mapState } from "vuex";
import Fundings from "../../components/Startup/Fundings.vue";

export default {
  name: "StartupDashboard",
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  components: {
    About,
    BasicDetails,
    UpcomingEvents,
    UpcomingSessions,
    Progress,
    AwardsandRecognitions,
    Founders,
    Documents,
    Fundings,
  },
};
</script>

<style scoped>
.col-md-4 {
  padding: 0;
}

.row__1,
.row__2 {
  height: auto;
  padding: 20px 0;
}

.row__1 > .col-md-8 {
  height: 800px;
}

.row__1 > .col-md-4,
.row__2 > .col-md-4 {
  border: 1px solid #e5e5e5;
  border-radius: 5px;
}

.row__1 > .col-md-8 {
  border-radius: 5px;
}

.row__1_about,
.row__1_progress,
.row__1_milestones,
.row__1_awards,
.row__1_founders {
  height: auto;
  padding: 0 20px;
}

.row__1_about > .col-md-12,
.row__1_milestones > .col-md-12,
.row__1_progress > .col-md-6,
.row__1_awards > .col-md-12,
.row__1_founders > .col-md-12 {
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  background-color: #fff;
}

.row__1_upcomings {
  height: auto;
  padding: 20px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.row__1_upcomings > div {
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  width: 48% !important;
  background: #fff;
}

@media only screen and (max-width: 600px) {
  .row__1_about {
    margin-top: 10px !important;
    padding: 0 !important;
  }

  .row__1_upcomings,
  .row__1_progress,
  .row__1_milestones,
  .row__1_awards {
    margin-top: 30px !important;
    padding: 0 !important;
  }
}
</style>
