<template>
  <v-container>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <h3 class="heading">Incubator Profile</h3>
    <div class="mx-5">
      <profile></profile>
      <div class="">
        <v-tabs color="traktor">
          <v-tab>Overview</v-tab>
          <v-tab>Startups</v-tab>
          <v-tab>Mentors</v-tab>
          <v-tab>Funding</v-tab>
          <v-tab>Events</v-tab>
          <v-tab-item>
            <v-container>
              <img src="../../assets/images/overview.png" alt="" width="100%" />
            </v-container>
          </v-tab-item>
          <v-tab-item>
            <v-container>
              <img
                src="../../assets/images/incubators.png"
                alt=""
                width="100%"
              />
            </v-container>
          </v-tab-item>
          <v-tab-item>
            <v-container>
              <img
                src="../../assets/images/mentors.png"
                alt=""
                width="100%"
              />
            </v-container>
          </v-tab-item>
          <v-tab-item>
            <v-container>
              <funding></funding>
            </v-container>
          </v-tab-item>
          <v-tab-item>
            <v-container>
              <events></events>
            </v-container>
          </v-tab-item>
        </v-tabs>
      </div>
    </div>
  </v-container>
</template>

<script>
import Events from "../../components/Incubator/Dashboards/Events.vue";
import Profile from "../../components/Incubator/Profile/Profile.vue";
import Funding from "../../components/SuperIncubator/Dashboard/Funding.vue";
export default {
  components: { Profile, Funding, Events },
  data() {
    return {
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
        },
        {
          text: "Incubators",
          disabled: true,
        },
        {
          text: "Profile",
          disabled: true,
        },
      ],
    };
  },
};
</script>

<style scoped>
.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}

.v-tab {
  color: #4f4f4f;
  text-transform: capitalize;
}
</style>