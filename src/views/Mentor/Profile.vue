<template>
  <v-container>
    <!-- <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon color="traktor" v-bind="attrs" v-on="on" link to="/mentors"
          ><v-icon size="30">mdi-arrow-left</v-icon></v-btn
        >
      </template>
      <span>Back</span>
    </v-tooltip> -->
    <v-row class="row__1">
      <v-col cols="12" md="4">
        <BasicDetails />
      </v-col>
      <v-col cols="12" md="8">
        <v-row class="row__1_about">
          <v-col cols="12" md="12">
            <About />
          </v-col>
        </v-row>
        <v-row v-if="currentUser.role === 'incubator'">
          <v-col cols="12" md="12" class="current__mentees">
            <Counts />
          </v-col>
        </v-row>
        <v-row class="mt-5" v-if="currentUser.role === 'incubator'">
          <v-col cols="12" md="12">
            <CurrentMentees />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import About from "@/components/Mentor/About";
import BasicDetails from "@/components/Mentor/BasicDetails";
import { mapState } from "vuex";
import Counts from "@/components/Mentor/Counts";
import CurrentMentees from "@/components/Mentor/CurrentMentees";

export default {
  name: "MentorProfile",
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  components: {
    About,
    BasicDetails,
    Counts,
    CurrentMentees,
  },
};
</script>

<style scoped>
.row__1,
.row__2 {
  height: auto;
  padding: 20px;
}

.row__1 > .col-md-4,
.row__2 > .col-md-4 {
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
}

.row__1 > .col-md-8 {
  border-radius: 5px;
}

.row__1_about {
  height: auto;
  padding: 0 20px;
}

.row__1_about > .col-md-12 {
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
}

@media only screen and (max-width: 600px) {
  .row__1_about {
    margin-top: 10px !important;
    padding: 0 !important;
  }
}
</style>
