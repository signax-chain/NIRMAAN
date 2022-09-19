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
            <h3>
               <!-- {{ $route.params.data }} -->
               <!-- {{ headings}} -->
            </h3>
            <v-simple-table fixed-header class="mt-3">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th
                      class="text-left"
                      v-for="(heading, index) in headings"
                      :key="index"
                    >
                      {{ heading }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(user, index) in data" :key="index">
                    <td v-for="(heading, idx) in headings" :key="idx">
                      {{ getData(user, heading) }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
        <v-row v-if="headings['Sector']">
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
        <v-row v-for="(user, index) in data" :key="index" class="mt-5">
          <v-col cols="12">
            <img
              :src="user['Photo URL']"
              :alt="user['Startup']"
              style="width: 100px"
              class="d-block mx-auto"
            />
            <h2 class="text-center">{{ user["Startup"] }}</h2>
          </v-col>
          <p class="mt-5" v-if="user['Description']">
            {{ user["Description"] }}
          </p>
          <div class="basic__details">
            <h3>Basic details</h3>
            <v-row>
              <v-col cols="6" md="6">
                <v-simple-table>
                  <template v-slot:default>
                    <tbody>
                      <tr v-if="user['Cohort']">
                        <th class="text-left">Cohort</th>
                        <td>
                          {{ user["Cohort"].name }} {{ user["Cohort"].year }}
                        </td>
                      </tr>
                      <tr v-if="user['Sector']">
                        <th class="text-left">Sector</th>
                        <td>{{ user["Sector"] }}</td>
                      </tr>
                      <!-- <tr>
                        <th class="text-left">CIN/ Reg.No</th>
                        <td>
                          {{
                            user.cinNumber !== null || user.cinNumber !== ""
                              ? user.cinNumber
                              : "-"
                          }}
                        </td>
                      </tr> -->
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
              <v-col cols="6" md="6">
                <v-simple-table>
                  <template v-slot:default>
                    <tbody>
                      <tr v-if="user['Email']">
                        <th class="text-left">Email</th>
                        <td>{{ user["Email"] }}</td>
                      </tr>
                      <tr v-if="user['Phone Number']">
                        <th class="text-left">Contact number</th>
                        <td>{{ user["Phone Number"] }}</td>
                      </tr>
                      <tr v-if="user['Social Links']">
                        <th class="text-left">Website</th>
                        <td>{{ user["Social Links"].website }}</td>
                      </tr>
                      <tr v-if="user['Social Links']">
                        <th class="text-left">Linked In</th>
                        <td>{{ user["Social Links"].linkedIn }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </div>
          <div class="founder__details mt-4" v-if="user['Founders'].length > 0">
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
                  <tr v-for="(founder, index) in user['Founders']" :key="index">
                    <td>{{ founder.name }}</td>
                    <td>{{ founder.email }}</td>
                    <td>{{ founder.phoneNumber }}</td>
                    <td>{{ founder.linkedIn }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
          <div
            class="awards__and_recognitions mt-4"
            v-if="user['Awards & Recognitions'].length > 0"
          >
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
                  <tr
                    v-for="(award, index) in user['Awards & Recognitions']"
                    :key="index"
                  >
                    <td>{{ award.date }}</td>
                    <td>{{ award.name }}</td>
                    <td>{{ award.givenBy }}</td>
                    <td>{{ award.money }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>

          <!-- <div class="progress mt-4">
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
          </div> -->
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
import html2pdf from "html2pdf.js";
import { getMentorsAssociated } from "../../services/Startups";

export default {
  name: "ReportVisualizer",
  data() {
    return {
      users: [],
      activities: [],
      values: [],
      sectors: [],
      width: 350,
      height: 350,
      headings: [],
      data: [],
      exceptionalHeadings: [
        "Fundings",
        "Founders",
        "Awards & Recognitions",
        "Description",
        "Social Links",
        "Photo URL",
        "Team Members",
      ],
      mentorsAssociated: [],
    };
  },
  async mounted() {
    const incubatorId = this.$store.state.incubator.currentIncubator.docId;
    this.data = this.$route.params.data;
    this.prepareHeadings();
    this.mentorsAssociated = await getMentorsAssociated(incubatorId);
    this.prepareSectors();
  },
  methods: {
    getData(user, heading) {
      if (heading === "Cohort")
        return `${user[heading].name} ${user[heading].year}`;
      if (heading === "Mentors Associated")
        return this.getMentors(user[heading]);
      else return user[heading];
    },
    prepareHeadings() {
      this.headings = Object.keys(this.data[0]);
      this.exceptionalHeadings.forEach((heading) => {
        const idx = this.headings.indexOf(heading);
        if (idx !== -1) this.headings.splice(idx, 1);
      });
    },
    prepareSectors() {
      this.sectors = this.data.map((dt) => dt["Sector"]);
      let counts = {};
      this.sectors.forEach(function (x) {
        counts[x] = (counts[x] || 0) + 1;
      });
      this.values = Object.values(counts);
    },
    getFounders(founders) {
      return founders.map((founder) => founder.name).toString();
    },
    getMentors(mentorIds) {
      let data = "";
      mentorIds.forEach((mid) => {
        const obj = this.mentorsAssociated.find((mentor) => mentor.id === mid);
        data += obj.name + ", ";
      });
      return data.slice(0, -1);
    },
    dataFormat: function (a, b) {
      if (b) return b + "%";
      return a;
    },
    download() {
      const element = document.getElementById("report__container");
      const opt = {
        margin: [0.2, 0, 1.1, 0],
        filename: `Startups Report - ${new Date().toDateString()}`,
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
  width: 1000px;
  margin: 0 auto;
  border: 1px solid black;
  page-break-inside: avoid;
  padding-bottom: 2rem;
}

th {
  color: #3aa959;
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