<template>
  <div>
    <v-row>
      <v-col cols="12" md="12">
        <startup-overview
          v-if="
            $route.query.tab === 'overview' || $route.query.tab === undefined
          "
        ></startup-overview>
        <startups-per-cohort
          v-if="
            $route.query.tab === 'startup' && selected === 'Startups by cohort'
          "
        ></startups-per-cohort>
        <startups-per-year
          v-if="selected === 'Startups by year'"
        ></startups-per-year>
      </v-col>
    </v-row>
    <!-- <startup-of-the-week></startup-of-the-week> -->
    <v-row>
      <v-col cols="12" md="12">
        <router-link
          to="/dashboard?tab=startup"
          v-if="
            $route.query.tab === undefined || $route.query.tab === 'overview'
          "
        >
          <v-btn color="traktor" dark class="mt-2 d-block ml-auto">
            View more details <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
        </router-link>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import StartupsPerCohort from "../Graphs/Startup/StartupsPerCohort.vue";
import StartupsPerYear from "../Graphs/Startup/StartupsPerYear.vue";
// import StartupOfTheWeek from "./StartupOfTheWeek.vue";
import StartupOverview from "./StartupOverview.vue";
export default {
  props: ["option"],
  computed: {
    selected() {
      return this.option;
    },
  },
  components: {
    // StartupOfTheWeek,
    StartupOverview,
    StartupsPerCohort,
    StartupsPerYear,
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