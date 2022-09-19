<template>
  <div class="wrapper pa-5">
    <h2>Activity</h2>
    <v-data-table
      :headers="headers"
      :items="activities"
      mobile-breakpoint="0"
      class="mt-3"
      :items-per-page="5"
    >
      <template v-slot:[`item.createdAt`]="{ item }">
        {{ item.createdAt.toDate().toDateString() }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { activityRef } from "@/config/firebase_services";

export default {
  data() {
    return {
      headers: [
        {
          text: "Date",
          align: "start",
          sortable: true,
          value: "createdAt",
        },
        {
          text: "Activity",
          align: "start",
          sortable: true,
          value: "statement",
        },
      ],
      activities: [],
    };
  },
  mounted() {
    this.getActivities();
  },
  methods: {
    getActivities() {
      activityRef
        .where("mentorId", "==", this.$route.params.id)
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
          this.activities = [];
          snapshot.forEach((document) => {
            const data = document.data();
            this.activities.push(data);
          });
        });
    },
  },
};
</script>

<style scoped>
>>> th {
  color: #3aa95a !important;
  font-size: 16px !important;
}
</style>