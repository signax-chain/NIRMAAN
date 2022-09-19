<template>
  <div>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <h3 class="heading">Notifications</h3>
    <v-data-table :headers="headers" :items="notifications" class="mx-5"></v-data-table>
  </div>
</template>

<script>
import { activityRef } from "../../config/firebase_services";
// import moment from "moment";

export default {
  name: "AllNotifications",
  data() {
    return {
      headers: [
        {
          text: "Timestamp",
          align: "left",
          value: "createdAt",
          sortable: true,
        },
        {
          text: "Notification",
          align: "left",
          value: "statement",
          sortable: true,
        },
      ],
      role: "",
      notifications: [],
      crumbs: [
        {
          text: "Notifications",
          disabled: true,
        },
        {
          text: "All Notifications",
          disabled: true,
        },
      ],
    };
  },
  created() {
    this.setRole();
    this.getNotifications();
  },
  methods: {
    setRole() {
      this.role = this.$store.state.user.currentUser.role;
    },
    getNotifications() {
      let incubatorId = this.$store.state.incubator.currentIncubator.docId;

      if (this.role === "incubator") {
        this.getIncubatorNotifications(incubatorId);
      }
    },
    async getIncubatorNotifications(incubatorId) {
      const documents = await activityRef
        .where("incubatorId", "==", incubatorId)
        .where("notification", "==", true)
        .orderBy("createdAt", "desc")
        .get();

      documents.forEach((document) => {
        const dt = document.data();
        dt.docId = document.id;
        // dt.createdAt = moment(dt.createdAt.toDate()).fromNow();
        dt.createdAt =
          dt.createdAt.toDate().toDateString() +
          " at " +
          dt.createdAt
            .toDate()
            .toLocaleTimeString("en-in", {
              hour: "2-digit",
              minute: "2-digit",
            });
        if (!dt.onlyStartup && !dt.onlyMentor) this.notifications.push(dt);
      });
    },
  },
};
</script>

<style scoped>
.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}

>>> th {
  color: #3aa959 !important;
  font-size: 16px !important;
}
</style>