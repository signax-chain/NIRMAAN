<template>
  <div class="activity__container">
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header> <h2>Activity</h2> </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-data-table
            :headers="headers"
            :items="activities"
            mobile-breakpoint="0"
            class="mt-3"
            :items-per-page="5"
          >
            <template v-slot:[`item.createdAt`]="{ item }">
              {{
                item.createdAt.toDate().toDateString() +
                " at " +
                item.createdAt.toDate().toLocaleTimeString("en-in", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
            </template>
          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <!-- <div class="wrapper">
      <v-row class="top__header">
        <v-col cols="12" class="d-flex">
          <h2 class="white--text">Activity Log</h2>
        </v-col>
      </v-row>
    </div> -->
  </div>
</template>
<script>
import { activityRef } from "../../config/firebase_services";
import { mapState } from "vuex";

export default {
  name: "Activity",
  props: ["userId"],
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
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
      // if (this.$store.state.user.currentUser.role === "startup") {
      activityRef
        .where("startupId", "==", this.userId)
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
          this.activities = [];
          snapshot.forEach((document) => {
            const data = document.data();
            // const name = this.$store.state.user.currentUser.name;
            // if (data.statement.includes("Startup")) {
            //   data.statement.replace("Startup", "");
            // }
            // if (data.statement.includes(name)) {
            //   data.statement.replace(name, "You");
            // }
            this.activities.push(data);
          });
        });
      // }

      // if (this.$store.state.user.currentUser.role === "mentor") {
      //   activityRef
      //     .where("mentorId", "==", this.currentUser.docId)
      //     .orderBy("createdAt", "desc")
      //     .onSnapshot((snapshot) => {
      //       this.activities = [];
      //       snapshot.forEach((document) => {
      //         this.activities.push(document.data());
      //       });
      //     });
      // }
    },
  },
};
</script>
<style scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top__header {
  background: #3aa95a;
  height: 60px;
  width: 90%;
  margin: 0 auto;
  border-radius: 20px;
  margin-bottom: 25px;
}

.activity__container {
  border-radius: 10px;
  padding: 10px;
}

h1 {
  color: #4f4f4f;
}

>>> th {
  color: #3aa95a !important;
  font-size: 16px !important;
}
</style>