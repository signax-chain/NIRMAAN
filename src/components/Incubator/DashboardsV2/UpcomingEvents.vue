<template>
  <section>
    <div class="item mb-5">
      <h3>Recent Activities</h3>
      <div v-if="activities.length === 0">
        <img
          src="../../../assets/images/no-documents.svg"
          alt=""
          width="100%"
        />
        <span class="grey--text mt-5">No activities</span>
      </div>
      <div v-else class="activities">
        <v-list subheader>
          <v-list-item
            v-for="(activity, index) in activities"
            :key="index"
            @click="goto(`/startup/${activity.startupId}`)"
          >
            <v-list-item-avatar>
              <v-img :src="activity.photoURL"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ activity.statement }}</v-list-item-title>
              <!-- <v-list-item-subtitle>
                {{ activity.subtitle }}
              </v-list-item-subtitle> -->
            </v-list-item-content>
            <!-- <v-list-item-action>
              <v-btn small dark text color="traktor">view</v-btn>
            </v-list-item-action> -->
          </v-list-item>
        </v-list>
      </div>
    </div>
    <div class="item">
      <h3 class="mb-5">Upcoming Events</h3>
      <div>
        <img src="../../../assets/images/no-events.svg" alt="" width="100%" />
        <span class="grey--text mt-5">No upcoming events</span>
      </div>
    </div>
  </section>
</template>

<script>
import { activityRef } from "../../../config/firebase_services";
export default {
  data() {
    return {
      events: [],
      activities: [],
    };
  },
  created() {
    this.getActivities();
  },
  methods: {
    async getActivities() {
      const incubatorId = this.$store.state.incubator.currentIncubator.docId;
      const documents = await activityRef
        .where("incubatorId", "==", incubatorId)
        .where("isActivityLog", "==", true)
        .where("to", "==", "incubator")
        .orderBy("createdAt", "desc")
        // .limit(5)
        .get();

      this.activities = documents.docs.map((doc) => {
        return {
          ...doc.data(),
          docId: doc.id,
        };
      });
    },
    goto(url) {
      this.$router.push(url);
    },
  },
};
</script>

<style scoped>
section {
  height: 100vh;
}

.item {
  border-radius: 5px;
  padding: 0.5rem 1rem;
  background-color: #fff;
  height: 46%;
  border: 1px solid #e5e5e5;
  text-align: center;
}

.activities {
  min-height: 40vh;
  height: 40vh;
  overflow-y: scroll;
}

img {
  opacity: 0.5;
}

>>> .v-list-item__title {
  font-size: 12px !important;
  display: flex;
  flex-wrap: wrap;
  word-wrap: break-word !important;
  white-space: unset !important;
  text-align: left;
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
</style>