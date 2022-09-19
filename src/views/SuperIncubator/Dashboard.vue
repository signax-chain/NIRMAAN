<template>
  <v-row>
    <v-col cols="12" md="11" class="middle-block mx-auto">
      <vue-scroll>
        <div class="wrapper">
          <overview
            v-if="
              $route.query.tab === 'overview' || $route.query.tab === undefined
            "
          ></overview>
          <incubator v-if="$route.query.tab === 'incubator'"></incubator>
          <regions v-if="$route.query.tab === 'regions'"></regions>
          <funding v-if="$route.query.tab === 'funding'"></funding>
        </div>
      </vue-scroll>
    </v-col>
  </v-row>
</template>

<script>
import Funding from "../../components/SuperIncubator/Dashboard/Funding.vue";
import Incubator from "../../components/SuperIncubator/Dashboard/Incubator.vue";
import Overview from "../../components/SuperIncubator/Dashboard/Overview.vue";
import Regions from "../../components/SuperIncubator/Dashboard/Regions.vue";

export default {
  name: "Dashboard",
  components: {
    Overview,
    Incubator,
    Regions,
    Funding,
  },
};
</script>

<style scoped>
.middle-block {
  min-height: 100vh;
  height: 100vh;
  overflow-y: scroll;
}

.wrapper {
  background-color: #fff;
  border-radius: 5px;
  padding: 0.5rem 1rem;
}
</style>