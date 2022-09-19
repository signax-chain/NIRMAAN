<template>
  <v-row>
    <v-col cols="12" md="12">
      <div class="recent-activity-row">
        <recent-activity
          v-for="(activity, index) in recentActivities"
          :key="index"
          :activity="activity"
          :width="`${
            $route.query.tab === undefined || $route.query.tab === 'overview'
              ? '24'
              : ''
          }`"
        ></recent-activity>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import RecentActivity from "../../../Startup/Cards/RecentActivityV2.vue";
import startupStats from "../../../../mixins/startupStats";

export default {
  components: {
    RecentActivity,
  },
  mixins: [startupStats],
};
</script>

<style scoped>
.recent-activity-row {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}
</style>