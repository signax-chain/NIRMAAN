<template>
  <v-container>
    <v-row>
      <v-card class="report__container mt-5 px-10 py-2" id="report__container">
        <v-img
          :src="user.photoURL"
          :alt="user.name"
          width="100"
          class="mx-auto"
        ></v-img>
        <h2 class="text-center">{{ user.name }}</h2>
        <p class="mt-5">{{ user.description }}</p>
        <div class="basic__details">
          <h3>Basic details</h3>
          <v-row v-if="type === 's'">
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
          <v-row v-if="type === 'm'">
            <v-col cols="6" md="6">
              <v-simple-table>
                <template v-slot:default>
                  <tbody>
                    <tr>
                      <th class="text-left">Designation</th>
                      <td>{{ user.designation }}</td>
                    </tr>
                    <tr>
                      <th class="text-left">Institution</th>
                      <td>{{ user.institution }}</td>
                    </tr>
                    <tr>
                      <th class="text-left">Expertise</th>
                      <td>
                        {{ user.areaOfExpertise.toString() }}
                      </td>
                    </tr>
                    <tr>
                      <th class="text-left">Qualification</th>
                      <td>
                        {{ user.qualification }}
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
                      <th class="text-left">Linked In</th>
                      <td>{{ user.socialLinks.linkedIn }}</td>
                    </tr>
                    <tr>
                      <th class="text-left">Startups</th>
                      <td>{{ getStartups(user.startupsAssociated) }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
        </div>
        <div class="founder__details mt-4" v-if="type === 's'">
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
        <div class="awards__and_recognitions mt-4" v-if="type === 's'">
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
                <tr v-for="(stage, index) in progress" :key="index">
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
                <tr v-for="(activity, index) in activities" :key="index">
                  <td>{{ activity.createdAt.toDate().toDateString() }}</td>
                  <td style="width: 550px">{{ activity.statement }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
      </v-card>
    </v-row>
    <!-- <v-tooltip top>
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
    </v-tooltip> -->
  </v-container>
</template>

<script>
import {
  startupsRef,
  mentorsRef,
  startupProgressRef,
  mentorProgressRef,
  activityRef,
} from "../../config/firebase_services";

import html2pdf from "html2pdf.js";

export default {
  name: "InReport",
  data() {
    return {
      type: null,
      user: {},
      activities: [],
      progress: [],
    };
  },
  created() {
    this.validateURL();
  },
  methods: {
    validateURL() {
      const params = this.$route.params;
      this.type = params.sm;
      this.prepareReport(params);
    },
    prepareReport(params) {
      if (params.sm === "s") this.getStartupDetails(params.id);
      else if (params.sm === "m") this.getMentorDetails(params.id);
    },
    async getStartupDetails(id) {
      const document = await startupsRef.doc(id).get();
      this.user = document.data();
      this.getStartupProgress(id);
    },
    async getMentorDetails(id) {
      const document = await mentorsRef.doc(id).get();
      this.user = document.data();
      this.getMentorProgress(id);
    },
    async getStartupProgress(id) {
      const documents = await startupProgressRef
        .where("startup.docId", "==", id)
        .get();

      documents.forEach((document) => {
        this.progress.push(document.data());
      });
      this.getStartupActivities(id);
    },
    async getStartupActivities(id) {
      const documents = await activityRef
        .where("type", "==", "startup")
        .where("startup.docId", "==", id)
        .get();

      documents.forEach((document) => {
        this.activities.push(document.data());
      });
    },
    async getMentorProgress(id) {
      const documents = await mentorProgressRef
        .where("mentor.docId", "==", id)
        .get();

      documents.forEach((document) => {
        this.progress.push(document.data());
      });
      this.getMentorActivities(id);
    },
    async getMentorActivities(id) {
      const documents = await activityRef
        .where("type", "==", "mentor")
        .where("mentor.docId", "==", id)
        .get();

      documents.forEach((document) => {
        this.activities.push(document.data());
      });
    },
    getStartups(startups) {
      return startups.map((startup) => startup.name).toString();
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