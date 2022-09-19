<template>
  <v-card class="mx-auto activities" v-if="activities.length > 0">
    <v-toolbar elevation="0">
      <v-toolbar-title>Recent Activity</v-toolbar-title>
    </v-toolbar>
    <vue-scroll>
      <v-list subheader two-line v-if="!skeletonLoader">
        <v-list-item v-for="(activity, index) in activities" :key="index">
          <v-list-item-avatar>
            <v-img :src="getPhotoURL(activity)"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="activity.statement"></v-list-item-title>
            <v-list-item-subtitle>{{
              getTimestamp(activity.createdAt)
            }}</v-list-item-subtitle>
          </v-list-item-content>
         
        </v-list-item>
      </v-list>
      <ListTile v-else />
    </vue-scroll>
  </v-card>
</template>
<script>
import ListTile from "@/components/Stateless/SkeletonLoader/ListTile";
import { activityRef } from "../../config/firebase_services";

export default {
  name: "Activities",
  components: {
    ListTile,
  },
  data() {
    return {
      activities: [],
      skeletonLoader: true,
    };
  },
  methods: {
    getPhotoURL: function (activity) {
      if (activity.photoURL === undefined || activity.photoURL === null)
        return activity.photoURL;
      else return activity.photoURL;
    },

    getTimestamp(createdAt) {
      return (
        createdAt.toDate().toDateString() +
        " at " +
        createdAt
          .toDate()
          .toLocaleTimeString("en-in", { hour: "2-digit", minute: "2-digit" })
      );
    },
  },

  created() {
    try {
      const currentUser = this.$store.state.user.currentUser;
      if (currentUser.role === "incubator" || currentUser.role === "member") {
        activityRef
          .where(
            "incubatorId",
            "==",
            this.$store.state.incubator.currentIncubator.docId
          )
          .orderBy("createdAt", "desc")
          // .limit(10)
          .onSnapshot((snapshot) => {
            this.activities = [];
            snapshot.forEach((document) => {
              const data = document.data();
              if (!data.onlyStartup && !data.onlyMentor)
                this.activities.push(data);
            });
            this.$emit("updateActivityLen", this.activities.length);
          });
      }

      if (currentUser.role === "mentor") {
        activityRef
          .where("mentorId", "==", currentUser.docId)
          .orderBy("createdAt", "desc")
          // .limit(10)
          .onSnapshot((snapshot) => {
            this.activities = [];
            snapshot.forEach((document) => {
              const data = document.data();
              if (data.onlyMentor) this.activities.push(data);
            });
            this.$emit("updateActivityLen", this.activities.length);
          });
      }
    } catch (e) {
      this.$toast.error(e, {
        position: "top",
      });
    }
    this.skeletonLoader = false;
  },
};
</script>

<style scoped>
>>> .v-list-item__title {
  font-size: 12px !important;
  display: flex;
  flex-wrap: wrap;
  word-wrap: break-word !important;
  white-space: unset !important;
}

>>> .v-list-item__subtitle {
  font-size: 10px !important;
}

>>> .v-list-item__title {
  font-weight: 600;
}

>>> .v-toolbar__title {
  color: #4f4f4f;
}

.activities {
  min-height: 100vh;
  height: 100vh;
}

@media only screen and (max-width: 600px) {
  .activities {
    height: 100%;
  }
}
</style>

