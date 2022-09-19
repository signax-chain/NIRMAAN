<template>
  <div>
    <Header></Header>
    <h4 class="heading mb-2">Overview</h4>
    <funding-overview></funding-overview>
    <h4 class="heading mb-2">Incubators</h4>
    <v-row>
      <v-col cols="12" md="6">
        <img
          src="../../../assets/images/graphs/top10-funded-incubators.svg"
          width="100%"
          alt=""
        />
      </v-col>
      <v-col cols="12" md="6">
        <img
          src="../../../assets/images/graphs/Industry-wise-funded.svg"
          width="100%"
          alt=""
        />
      </v-col>
      <v-col cols="12" md="6">
        <img
          src="../../../assets/images/graphs/sectors-funded.svg"
          width="100%"
          alt=""
        />
      </v-col>
      <v-col cols="12" md="6">
        <img
          src="../../../assets/images/graphs/startups-funding.svg"
          width="100%"
          alt=""
        />
      </v-col>
    </v-row>
    <h4 class="heading mb-2">Startups</h4>
    <v-row>
      <v-col cols="12" md="8">
        <img
          src="../../../assets/images/graphs/funding-activity.png"
          width="100%"
          alt=""
        />
      </v-col>
      <v-col cols="12" md="4">
        <img
          src="../../../assets/images/graphs/recent-funded-startup.svg"
          width="100%"
          alt=""
        />
      </v-col>
      <v-col cols="12" md="6">
        <img
          src="../../../assets/images/graphs/month-vs-funding.svg"
          width="100%"
          alt=""
        />
      </v-col>
      <v-col cols="12" md="3">
        <img
          src="../../../assets/images/graphs/year-vs-funding.svg"
          width="100%"
          alt=""
        />
      </v-col>
      <v-col cols="12" md="3">
        <img
          src="../../../assets/images/graphs/average-funding.svg"
          width="100%"
          alt=""
        />
      </v-col>
    </v-row>
    <h4 class="heading mb-2">Revenue</h4>
    <revenue-overview></revenue-overview>
    <v-row>
      <v-col cols="12" md="6">
        <img
          src="../../../assets/images/graphs/revenue-per-sector.svg"
          width="100%"
          alt=""
        />
      </v-col>
      <v-col cols="12" md="6">
        <img
          src="../../../assets/images/graphs/revenue-share-per-industry.svg"
          width="100%"
          alt=""
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import FundingOverview from "./Common/FundingOverview.vue";
import Header from "./Common/Header.vue";
import RevenueOverview from "./Common/RevenueOverview.vue";
export default {
  components: { Header, FundingOverview, RevenueOverview },
};
</script>

<style scoped>
h4 {
  font-weight: normal;
  color: #1f1f1f;
  margin-top: 1rem;
}
</style>