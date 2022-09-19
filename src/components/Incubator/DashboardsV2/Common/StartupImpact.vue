<template>
  <v-row>
    <v-col cols="12" md="12">
      <div class="recent-activity-row">
        <recent-activity
          v-for="(activity, index) in recentActivities"
          :key="index"
          :activity="activity"
        ></recent-activity>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import RecentActivity from "../../../Startup/Cards/RecentActivity.vue";
import impactStats from "../../../../mixins/impactStats";

export default {
  components: {
    RecentActivity,
  },
  mixins: [impactStats],
};
</script>

<style scoped>
.recent-activity-row {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}
</style>