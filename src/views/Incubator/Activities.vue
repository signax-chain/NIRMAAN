<template>
  <div>
    <div class="wrapper">
      <v-row class="back__nav">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              color="traktor"
              v-bind="attrs"
              v-on="on"
              link
              to="/dashboard"
              ><v-icon size="30">mdi-arrow-left</v-icon></v-btn
            >
          </template>
          <span>Back</span>
        </v-tooltip>
      </v-row>
      <v-row class="top__header">
        <v-col cols="12" class="d-flex">
          <h2 class="white--text">Activities</h2>
          <div class="actions__items d-flex ml-auto">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <download-excel :data="activities">
                  <v-btn icon color="#fff" v-bind="attrs" v-on="on"
                    ><v-icon size="28">mdi-microsoft-excel</v-icon></v-btn
                  >
                </download-excel>
              </template>
              <span>Export data</span>
            </v-tooltip>
          </div>
        </v-col>
      </v-row>
    </div>
    <v-data-table :headers="headers" :items="activities" mobile-breakpoint="0">
      <template v-slot:[`item.createdAt`]="{ item }">
        {{ item.createdAt.toDate().toDateString() }} at
        {{ item.createdAt.toDate().toLocaleString("en-in").split(",")[1] }}
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { activityRef } from "../../config/firebase_services";

export default {
  name: "Activities",
  data() {
    return {
      activities: [],
      headers: [
        { text: "Date", align: "center", sortable: true, value: "createdAt" },
        {
          text: "Activity",
          align: "start",
          sortable: true,
          value: "statement",
        },
      ],
      exportingData: [],
    };
  },
  created() {
    this.getActivities();
  },
  methods: {
    getActivities() {
      activityRef
        .where(
          "incubatorId",
          "==",
          this.$store.state.incubator.currentIncubator.docId
        )
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
          this.activities = [];
          snapshot.forEach((document) => {
            this.activities.push(document.data());
          });
          this.prepareJsonToExcelData();
        });
    },
    prepareJsonToExcelData() {
      const fields = {
        statement: "Statement",
        createdAt: "Date",
      };

      this.activities.forEach((activity) => {
        const data = {};
        Object.keys(fields).forEach((key) => {
          activity[key] === undefined || activity[key] === null
            ? (data[fields[key]] = "")
            : (data[fields[key]] = activity[key]);

          if (key === "createdAt") data[fields[key]] = activity[key].toDate();
        });

        this.exportingData.push(data);
      });
    },
  },
};
</script>
<style scoped>
>>> th {
  color: #3aa95a !important;
  font-size: 17px !important;
  font-weight: bold !important;
}

.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back__nav {
  height: 60px;
  width: 10%;
  border-radius: 20px;
  margin-bottom: 25px;
  display: flex;
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
</style>