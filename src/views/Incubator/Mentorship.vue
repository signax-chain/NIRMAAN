<template>
  <div>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <h3 class="heading">Mentorship</h3>
    <div class="wrapper mx-5">
      <h3 class="heading ml-0 d-flex justify-space-between">
        Mentoring Sessions
        <v-menu transition="slide-x-transition" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-badge
              :content="notifications.length"
              color="red"
              offset-x="10"
              offset-y="10"
            >
              <v-btn color="traktor" icon v-bind="attrs" v-on="on">
                <v-icon>mdi-bell</v-icon>
              </v-btn>
            </v-badge>
          </template>
          <mentorship-notifications
            :notifications="notifications"
          ></mentorship-notifications>
        </v-menu>
      </h3>
      <mentoring-sessions />
    </div>
  </div>
</template>

<script>
import MentoringSessions from "@/components/Mentorship/MentoringSessions";
import MentorshipNotifications from "../../components/Modals/Menus/MentorshipNotifications.vue";
import { activityRef } from "../../config/firebase_services";

export default {
  name: "Mentorship",
  components: {
    MentoringSessions,
    MentorshipNotifications,
  },
  created() {
    this.fetchData();
  },
  data() {
    return {
      notifications: [],
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
        },
        {
          text: "Mentorship",
          disabled: true,
        },
      ],
    };
  },
  methods: {
    async fetchData() {
      const incubatorId = this.$store.state.incubator.currentIncubator.docId;
      const documents = await activityRef
        .where("incubatorId", "==", incubatorId)
        .where("notification", "==", true)
        .where("type", "==", "incubator")
        .orderBy("createdAt", "desc")
        .get();

      documents.forEach((doc) => {
        this.notifications.push({
          id: doc.id,
          ...doc.data(),
        });

        this.notifications = this.notifications.filter((notification) => {
          return notification.statement.indexOf("mentoring session") !== -1;
        });
      });
    },
  },
};
</script>

<style scoped>
.wrapper {
  background-color: #fff;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  padding: 1rem;
}

.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}

>>> .v-menu__content {
  left: 550px !important;
}
</style>