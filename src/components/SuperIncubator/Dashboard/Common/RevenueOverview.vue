<template>
  <v-row>
    <v-col cols="12" md="12">
      <div class="recent-activity-row">
        <recent-activity
          v-for="(activity, index) in recentActivities"
          :key="index"
          :activity="activity"
          :width="`${
            $route.query.tab === undefined ||
            $route.query.tab === 'overview'
              ? '46'
              : ''
          }`"
        ></recent-activity>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import RecentActivity from "../../../Startup/Cards/RecentActivity.vue";
import incubatorRevenueStats from "../../../../mixins/incubatorRevenueStats";

export default {
  components: {
    RecentActivity,
  },
  mixins: [incubatorRevenueStats],
};
</script>

<style scoped>
.recent-activity-row {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}
</style>