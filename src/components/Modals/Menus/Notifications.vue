<template>
  <v-card v-show="show" style="width: 550px">
    <v-card-title class="heading">Notifications</v-card-title>
    <v-card-text>
      <v-divider></v-divider>
      <v-list subheader two-line v-if="notifications.length > 0">
        <v-list-item
          v-for="(notification, index) in notifications"
          :key="index"
          class="pa-0"
        >
          <!-- <v-list-item-avatar>
            <v-img :src="notification.photoURL"></v-img>
          </v-list-item-avatar> -->

          <v-list-item-content>
            <v-list-item-title
              v-text="notification.statement"
            ></v-list-item-title>

            <v-list-item-subtitle>{{
              notification.createdAt
            }}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <div class="d-flex">
              <router-link v-if="notification.link" :to="notification.link">
                <v-btn>view</v-btn>
              </router-link>
              <router-link v-else to="/notifications">
                <v-btn>view</v-btn>
              </router-link>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="markAsRead(notification.docId)"
                  >
                    <v-icon color="traktor" size="12">mdi-circle</v-icon>
                  </v-btn>
                </template>
                <span>Mark as read</span>
              </v-tooltip>
            </div>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-list v-else>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="black--text"
              >No notifications</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import moment from "moment";
import { activityRef } from "../../../config/firebase_services";

export default {
  name: "NotificationsMenu",
  props: ["visible"],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) return this.$emit("close");
      },
    },
  },
  data() {
    return {
      notifications: [],
    };
  },
  created() {
    this.getNotifications();
  },
  methods: {
    async getNotifications() {
      let currentUser = this.$store.state.user.currentUser;
      let currentIncubator = this.$store.state.incubator.currentIncubator;
      if (currentUser.role === "incubator") {
        activityRef
          .where("incubatorId", "==", currentIncubator.docId)
          .where("notification", "==", true)
          .where("read", "==", false)
          .orderBy("createdAt", "desc")
          .onSnapshot((snapshot) => {
            this.notifications = [];
            snapshot.forEach((document) => {
              const dt = document.data();
              dt.docId = document.id;
              dt.createdAt = moment(dt.createdAt.toDate()).fromNow();
              if (!dt.onlyStartup && !dt.onlyMentor)
                this.notifications.push(dt);
            });
            this.$emit("updateCount", this.notifications.length);
          });
      }

      if (currentUser.role === "startup") {
        activityRef
          .where("startupId", "==", currentUser.docId)
          .where("notification", "==", true)
          .where("read", "==", false)
          .orderBy("createdAt", "desc")
          .onSnapshot((snapshot) => {
            this.notifications = [];
            snapshot.forEach((document) => {
              const dt = document.data();
              dt.docId = document.id;
              dt.createdAt = moment(dt.createdAt.toDate()).fromNow();
              if (dt.onlyStartup) this.notifications.push(dt);
            });
            this.$emit("updateCount", this.notifications.length);
          });
      }

      if (currentUser.role === "mentor") {
        activityRef
          .where("mentorId", "==", currentUser.docId)
          .where("notification", "==", true)
          .where("read", "==", false)
          .orderBy("createdAt", "desc")
          .onSnapshot((snapshot) => {
            this.notifications = [];
            snapshot.forEach((document) => {
              const dt = document.data();
              dt.docId = document.id;
              dt.createdAt = moment(dt.createdAt.toDate()).fromNow();
              if (dt.onlyMentor) this.notifications.push(dt);
            });
            this.$emit("updateCount", this.notifications.length);
          });
      }
    },
    markAsRead(docId) {
      activityRef.doc(docId).set({ read: true }, { merge: true });
    },
  },
};
</script>

<style scoped>
.v-card__title {
  color: #4d4d4d;
}

.v-list-item__title {
  white-space: break-spaces;
  color: #4f4f4f !important;
  font-size: 14px;
}

.v-list-item__subtitle {
  color: #b0b0b0 !important;
  font-size: 12px;
}

a {
  text-decoration: none;
}
</style>