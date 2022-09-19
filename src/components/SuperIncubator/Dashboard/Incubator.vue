<template>
  <div>
    <Header></Header>
    <h4 class="heading mb-2">Overview</h4>
    <incubator-overview></incubator-overview>
    <h4 class="heading mb-2">Activity</h4>
    <v-row>
      <v-col cols="12" md="8">
        <img
          src="../../../assets/images/graphs/mentoring-hours.svg"
          width="100%"
          alt=""
        />
      </v-col>
      <v-col cols="12" md="4">
        <top-performing-incubator></top-performing-incubator>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="8">
        <img
          src="../../../assets/images/graphs/mentoring-hours.svg"
          width="100%"
          alt=""
        />
      </v-col>
      <v-col cols="12" md="4">
        <least-performing-incubator></least-performing-incubator>
      </v-col>
    </v-row>
    <h4 class="heading mb-2">Funding</h4>
    <img
      src="../../../assets/images/graphs/top-performing-incubator-monthly.png"
      alt=""
      width="100%"
    />
    <h4 class="heading mb-2">Progress</h4>
    <v-row>
      <v-col cols="12" md="6">
        <img
          src="../../../assets/images/graphs/startups-by-de.svg"
          width="100%"
          alt=""
        />
      </v-col>
      <v-col cols="12" md="6">
        <img
          src="../../../assets/images/graphs/progress-rate.svg"
          width="100%"
          alt=""
        />
      </v-col>
    </v-row>
    <h4 class="heading mb-2">Sector</h4>
    <v-row>
      <v-col cols="12" md="6">
        <img
          src="../../../assets/images/graphs/startups-vs-sectors.svg"
          width="100%"
          alt=""
        />
      </v-col>
      <v-col cols="12" md="6">
        <img
          src="../../../assets/images/graphs/startups-vs-industry.svg"
          width="100%"
          alt=""
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Header from "./Common/Header.vue";
import IncubatorOverview from "./Common/IncubatorOverview.vue";
import LeastPerformingIncubator from "./Graphs/Incubators/LeastPerformingIncubator.vue";
import TopPerformingIncubator from "./Graphs/Incubators/TopPerformingIncubator.vue";
export default {
  components: {
    Header,
    IncubatorOverview,
    TopPerformingIncubator,
    LeastPerformingIncubator,
  },
};
</script>

<style scoped>
h4 {
  font-weight: normal;
  color: #1f1f1f;
  margin-top: 1rem;
}
</style>