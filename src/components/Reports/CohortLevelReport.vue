<template>
  <v-container>
    <v-row>
      <v-card class="report__container mt-5 px-10 py-2" id="report__container">
        <v-row>
          <v-col cols="12">
            <img
              :src="$store.state.incubator.currentIncubator.photoURL"
              :alt="$store.state.incubator.currentIncubator.name"
              width="200"
              class="d-block mx-auto"
            />
            <h2 class="text-center mt-3">
              {{ $store.state.incubator.currentIncubator.name }}
            </h2>
          </v-col>
        </v-row>
        <v-row class="my-5">
          <v-col cols="12">
            <h3>Cohort snapshot</h3>
            <v-simple-table fixed-header class="mt-3">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Startup</th>
                    <th class="text-left">Founders</th>
                    <th class="text-left">Mentors</th>
                    <th class="text-left">Cohort</th>
                    <th class="text-left">Sector</th>
                    <th class="text-left">Stage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(user, index) in users" :key="index">
                    <td>{{ user.name }}</td>
                    <td>{{ getFounders(user.founders) }}</td>
                    <td>{{ getMentors(user.mentorsAssociated) }}</td>
                    <td>{{ user.cohort.name }} {{ user.cohort.year }}</td>
                    <td>{{ user.sector }}</td>
                    <td>{{ user.stage }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <h3>Data Visualization</h3>
            <graph-pie
              :width="width"
              :height="height"
              :padding-top="50"
              :padding-bottom="50"
              :padding-left="50"
              :padding-right="50"
              :values="values"
              :names="sectors"
              :active-index="[0, 2]"
              :active-event="'click'"
              :show-text-type="'outside'"
              :data-format="dataFormat"
              class="text-center"
            >
              <legends :names="sectors"></legends>
              <tooltip :names="sectors"></tooltip>
            </graph-pie>
          </v-col>
        </v-row>
        <v-row v-for="(user, index) in users" :key="index" class="mt-5">
          <v-col cols="12">
            <img
              :src="user.photoURL"
              :alt="user.name"
              style="width: 100px"
              class="d-block mx-auto"
            />
            <h2 class="text-center">{{ user.name }}</h2>
          </v-col>
          <p class="mt-5">{{ user.description }}</p>
          <div class="basic__details">
            <h3>Basic details</h3>
            <v-row>
              <v-col cols="6" md="6">
                <v-simple-table>
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <th class="text-left">Cohort</th>
                        <td>{{ user.cohort.name }} {{ user.cohort.year }}</td>
                      </tr>
                      <tr>
                        <th class="text-left">Sector</th>
                        <td>{{ user.sector }}</td>
                      </tr>
                      <tr>
                        <th class="text-left">Faculty/ Student ID</th>
                        <td>
                          {{
                            user.facultyOrStudentId !== "" ||
                            user.facultyOrStudentId !== null
                              ? user.facultyOrStudentId
                              : "-"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <th class="text-left">CIN/ Reg.No</th>
                        <td>
                          {{
                            user.cinNumber !== null || user.cinNumber !== ""
                              ? user.cinNumber
                              : "-"
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
              <v-col cols="6" md="6">
                <v-simple-table>
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <th class="text-left">Email</th>
                        <td>{{ user.email }}</td>
                      </tr>
                      <tr>
                        <th class="text-left">Contact number</th>
                        <td>{{ user.phoneNumber }}</td>
                      </tr>
                      <tr>
                        <th class="text-left">Website</th>
                        <td>{{ user.socialLinks.website }}</td>
                      </tr>
                      <tr>
                        <th class="text-left">Linked In</th>
                        <td>{{ user.socialLinks.linkedIn }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </div>
          <div class="founder__details mt-4">
            <h3>Founder details</h3>
            <v-simple-table fixed-header>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Name</th>
                    <th class="text-left">Email</th>
                    <th class="text-left">Contact number</th>
                    <th class="text-left">Linked In</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(founder, index) in user.founders" :key="index">
                    <td>{{ founder.name }}</td>
                    <td>{{ founder.email }}</td>
                    <td>{{ founder.phoneNumber }}</td>
                    <td>{{ founder.linkedIn }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
          <div class="awards__and_recognitions mt-4">
            <h3>Awards and recognitions</h3>
            <v-simple-table fixed-header>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Date</th>
                    <th class="text-left">Name</th>
                    <th class="text-left">Given by</th>
                    <th class="text-left">Prize money</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(award, index) in user.awards" :key="index">
                    <td>{{ award.date }}</td>
                    <td>{{ award.name }}</td>
                    <td>{{ award.givenBy }}</td>
                    <td>{{ award.money }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
          <div class="progress mt-4">
            <h3>Progress</h3>
            <v-simple-table fixed-header>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Date</th>
                    <th class="text-left">Stage</th>
                    <th class="text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(stage, index) in user.progress" :key="index">
                    <td>{{ stage.createdAt.toDate().toDateString() }}</td>
                    <td>{{ stage.stage }}</td>
                    <td style="width: 350px">{{ stage.description }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
          <div class="progress mt-4">
            <h3>Activities</h3>
            <v-simple-table fixed-header>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Date</th>
                    <th class="text-left">Activity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(activity, index) in user.activities" :key="index">
                    <td>{{ activity.createdAt.toDate().toDateString() }}</td>
                    <td style="width: 550px">{{ activity.statement }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-row>
      </v-card>
    </v-row>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <button
          left
          bottom
          fab
          class="white--text floating__button"
          v-bind="attrs"
          v-on="on"
          @click="download()"
        >
          <v-icon color="white">mdi-download</v-icon>
        </button>
      </template>
      <span>Download report</span>
    </v-tooltip>
  </v-container>
</template>

<script>
import {
  startupsRef,
  startupProgressRef,
  activityRef,
} from "../../config/firebase_services";
import html2pdf from "html2pdf.js";

export default {
  name: "CLReport",
  data() {
    return {
      users: [],
      activities: [],
      values: [],
      sectors: [],
      width: 350,
      height: 350,
    };
  },
  created() {
    this.getStartupsDetails(this.$route.params.cn, this.$route.params.cy);
  },
  methods: {
    async getStartupsDetails(cn, cy) {
      const documents = await startupsRef
        .where(
          "incubatorId",
          "==",
          this.$store.state.incubator.currentIncubator.docId
        )
        .where("cohort.name", "==", cn)
        .where("cohort.year", "==", parseInt(cy))
        .get();

      documents.forEach((document) => {
        this.users.push(document.data());
        this.sectors.push(document.data()["sector"]);
      });

      this.getStartupsProgress();
    },
    getStartupsProgress() {
      this.users.forEach(async (user) => {
        const progress = [];
        const documents = await startupProgressRef
          .where("startup.docId", "==", user.docId)
          .get();

        documents.forEach((document) => {
          progress.push(document.data());
        });
        return (user.progress = progress);
      });
      this.getStartupsActivities();
    },
    getStartupsActivities() {
      this.users.forEach(async (user) => {
        const activities = [];
        const documents = await activityRef
          .where("type", "==", "startup")
          .where("startup.docId", "==", user.docId)
          .get();

        documents.forEach((document) => {
          activities.push(document.data());
        });
        return (user.activities = activities);
      });
      this.prepareSectors();
    },
    prepareSectors() {
      let counts = {};
      this.sectors.forEach(function (x) {
        counts[x] = (counts[x] || 0) + 1;
      });
      this.values = Object.values(counts);
    },
    getFounders(founders) {
      return founders.map((founder) => founder.name).toString();
    },
    getMentors(mentors) {
      return mentors.map((mentor) => mentor.name).toString();
    },
    dataFormat: function (a, b) {
      if (b) return b + "%";
      return a;
    },
    download() {
      const element = document.getElementById("report__container");
      const opt = {
        margin: [0.2, 0, 1.1, 0],
        filename: `${this.user.name}`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      html2pdf(element, opt);
    },
  },
};
</script>

<style scoped>
.report__container {
  height: auto;
  width: 800px;
  margin: 0 auto;
  border: 1px solid black;
  page-break-inside: avoid;
}

.report__container > h2 {
  color: #3aa959;
}

.floating__button {
  background-color: #3aa959 !important;
  color: #fff;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none !important;
  box-shadow: 0 0 4px rgb(0 0 0 / 14%), 0 4px 8px rgb(0 0 0 / 28%);
  bottom: 0;
  position: fixed;
  margin: 1em;
  right: 0;
  z-index: 1;
}
</style>