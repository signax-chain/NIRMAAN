<template>
  <div>
    <Header></Header>
    <h4 class="heading mb-2">Overview</h4>
    <region-overview></region-overview>
    <h4 class="heading mb-2">Activity</h4>
    <v-row>
      <v-col cols="12" md="8">
        <img
          src="../../../assets/images/graphs/daily-mentor-logins.png"
          width="100%"
          alt=""
        />
      </v-col>
      <v-col cols="12" md="4">
        <top-performing-region></top-performing-region>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="8">
        <img
          src="../../../assets/images/graphs/daily-mentor-logins.png"
          width="100%"
          alt=""
        />
      </v-col>
      <v-col cols="12" md="4">
        <least-performing-region></least-performing-region>
      </v-col>
    </v-row>
    <h4 class="heading mb-2">Sector</h4>
    <v-row>
      <v-col cols="12" md="6">
        <img
          src="../../../assets/images/graphs/region-vs-sector.svg"
          width="100%"
          alt=""
        />
      </v-col>
      <v-col cols="12" md="6">
        <img
          src="../../../assets/images/graphs/regions-vs-industry.svg"
          width="100%"
          alt=""
        />
      </v-col>
    </v-row>
    <h4 class="heading mb-2">Jobs</h4>
     <v-row>
      <v-col cols="12" md="4">
        <img
          src="../../../assets/images/graphs/course-vs-founders.svg"
          width="100%"
          alt=""
        />
      </v-col>
      <v-col cols="12" md="3">
        <img
          src="../../../assets/images/graphs/jobs-open-vs-closed.svg"
          width="100%"
          alt=""
        />
      </v-col>
      <v-col cols="12" md="5">
        <img
          src="../../../assets/images/graphs/ips.svg"
          width="100%"
          alt=""
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Header from "./Common/Header.vue";
import RegionOverview from "./Common/RegionOverview.vue";
import LeastPerformingRegion from "./Graphs/Regions/LeastPerformingRegion.vue";
import TopPerformingRegion from "./Graphs/Regions/TopPerformingRegion.vue";
export default {
  components: {
    Header,
    RegionOverview,
    TopPerformingRegion,
    LeastPerformingRegion,
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