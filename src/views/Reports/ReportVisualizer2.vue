<template>
  <div>
    <div class="report-container" id="report__container" ref="reportContainer">
      <div class="report" v-for="(data, index) in datas" :key="index">
        <div class="report-header pb-3">
          <img :src="currentIncubator.photoURLs.parentInstitutionLogo" alt="" />
          <div class="details">
            <h3 class="title">Startup Report</h3>
            <span class="timestamp"
              >{{ new Date().toDateString() }},
              {{
                new Date().toLocaleTimeString("en-in", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}</span
            >
          </div>
          <img :src="currentIncubator.photoURLs.institutionLogo" alt="" />
        </div>
        <div class="report-body">
          <div class="basic-details">
            <img :src="data['Photo URL']" alt="" />
            <h3 class="startup-name">{{ data["Startup"] }}</h3>
            <div class="contact-details">
              <span v-if="data['Social Links']" class="mr-2">
                <v-icon v-if="data['Social Links'].website">mdi-web</v-icon>
                {{ data["Social Links"].website }}
              </span>
              <span v-if="data['Phone Number']" class="mr-2">
                <v-icon>mdi-phone</v-icon>
                {{ data["Phone Number"] }}
              </span>
              <span v-if="data['Email']" class="mr-2">
                <v-icon>mdi-email</v-icon>
                {{ data["Email"] }}
              </span>
            </div>
            <div class="details">
              <div v-if="data['Sector']">
                <span>Sector</span>
                <h4>{{ data["Sector"] }}</h4>
              </div>
              <div v-if="data['Cohort']">
                <span>Cohort(Name)</span>
                <h4>{{ data["Cohort"].name }}</h4>
              </div>
              <div v-if="data['Cohort']">
                <span>Cohort(Year)</span>
                <h4>{{ data["Cohort"].year }}</h4>
              </div>
              <div v-if="data['Program']">
                <span>Program</span>
                <h4>{{ data["Program"] }}</h4>
              </div>
              <div v-if="data['Stage']">
                <span>Stage</span>
                <h4>{{ data["Stage"] }}</h4>
              </div>
              <div v-if="data['CIN/ Registration Number']">
                <span>CIN/ Registration Number</span>
                <h4></h4>
              </div>
            </div>
          </div>
          <div class="about" v-if="data['Description']">
            <h3>About</h3>
            <p>{{ data["Description"] }}</p>
          </div>
          <div
            class="founders"
            v-if="data['Founders'] && data['Founders'].length > 0"
          >
            <h3>Founders</h3>
            <div class="founders-row">
              <div
                class="founder"
                v-for="(founder, index) in data['Founders']"
                :key="index"
              >
                <h4>{{ founder.name }}</h4>
                <div class="social-links">
                  <a href="">
                    <v-icon>mdi-linkedin</v-icon>
                  </a>
                  <a href="">
                    <v-icon>mdi-email</v-icon>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="fundings" v-if="data['Funding']">
            <h3>Funding</h3>
            <div class="funding-row">
              <div class="funding-col">
                <h2>{{ data["Funding"].received.toLocaleString() }}</h2>
                <h4>Funding Received</h4>
              </div>
              <div class="funding-col">
                <h2>{{ data["Funding"].utilized.toLocaleString() }}</h2>
                <h4>Funding Utilized</h4>
              </div>
              <div class="funding-col">
                <h2>{{ data["Funding"].external.toLocaleString() }}</h2>
                <h4>External Funding</h4>
              </div>
            </div>
          </div>
          <div
            class="awards"
            v-if="
              data['Mentors Associated'] &&
              data['Mentors Associated'].length > 0
            "
          >
            <h3>Mentors Associated</h3>
            <table>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Area of Expertise</th>
                <th>Institution</th>
              </tr>
              <tr
                v-for="(mentor, index) in data['Mentors Associated']"
                :key="index"
              >
                <td>{{ getMentor(mentor, "name") }}</td>
                <td>{{ getMentor(mentor, "email") }}</td>
                <td>{{ getMentor(mentor, "areaOfExpertise").toString() }}</td>
                <td>{{ getMentor(mentor, "institution") }}</td>
              </tr>
            </table>
          </div>
          <div
            class="awards"
            v-if="
              data['Awards & Recognitions'] &&
              data['Awards & Recognitions'].length > 0
            "
          >
            <h3>Awards & Recognition</h3>
            <table>
              <tr>
                <th>Event Name</th>
                <th>Result</th>
                <th>Organiser</th>
                <th>Date of event</th>
              </tr>
              <tr
                v-for="(award, index) in data['Awards & Recognitions']"
                :key="index"
              >
                <td>{{ award.name }}</td>
                <td>{{ award.money }}</td>
                <td>{{ award.givenBy }}</td>
                <td>{{ award.date }}</td>
              </tr>
            </table>
          </div>
          <div
            class="team"
            v-if="data['Team Members'] && data['Team Members'].length > 0"
          >
            <h3>Team Members</h3>
            <table>
              <tr>
                <th>Name</th>
                <th>Designation</th>
                <th>Email</th>
                <th>Phone Number</th>
              </tr>
              <tr v-for="(member, index) in data['Team Members']" :key="index">
                <td>{{ member.name }}</td>
                <td>{{ member.designation }}</td>
                <td>{{ member.email }}</td>
                <td>{{ member.phoneNumber }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
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
    <progress-loader
      :visible="progressLoader"
      loaderText="preparing to download"
      @close="progressLoader = false"
    ></progress-loader>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getMentorsByIncubatorId } from "../../services/Mentors";
import domtoimage from "dom-to-image";
import { jsPDF } from "jspdf";
import ProgressLoader from "../../components/Modals/Loaders/ProgressLoader.vue";

export default {
  components: { ProgressLoader },
  name: "ReportVisualizer2",
  computed: {
    ...mapState({
      currentIncubator: (state) => state.incubator.currentIncubator,
    }),
  },
  data() {
    return {
      datas: [],
      mentorsAssociated: [],
      progressLoader: false,
    };
  },
  async mounted() {
    const incubatorId = this.$store.state.incubator.currentIncubator.docId;
    this.datas = this.$route.params.data;
    this.mentorsAssociated = await getMentorsByIncubatorId(incubatorId);
  },
  methods: {
    getMentor(id, key) {
      const mentor = this.mentorsAssociated.find((m) => m.docId === id);
      return mentor ? mentor[key] : "";
    },
    download() {
      this.progressLoader = true;
      this.$refs.reportContainer.style.width = "1000px";
      this.$refs.reportContainer.style.padding = "2rem";

      domtoimage
        .toPng(document.getElementById("report__container"))
        .then(function (blob) {
          const pdf = new jsPDF("p", "px", [
            document.getElementById("report__container").clientWidth,
            document.getElementById("report__container").clientHeight,
          ]);
          pdf.addImage(
            blob,
            "PNG",
            0,
            0,
            document.getElementById("report__container").clientWidth,
            document.getElementById("report__container").clientHeight,
            undefined,
            "FAST"
          );
          pdf.save(`Startups Report - ${new Date().toDateString()}.pdf`);
        })
        .then(() => {
          this.$refs.reportContainer.style.width = "1000px";
          this.$refs.reportContainer.style.padding = "0 0 2rem 0";
          this.progressLoader = false;
        });
    },
  },
};
</script>

<style scoped>
.report-container {
  height: auto;
  width: 1000px;
  margin: 0 auto;
  /* page-break-inside: avoid; */
  padding-bottom: 2rem;
}

.report {
  border-top: 3px solid #3aa959;
  padding: 1.5rem;
  min-height: 1122px;
  height: auto;
  border: 1px solid black;
  margin-bottom: 2rem;
  border-radius: 5px;
  background-color: #fff;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 10%;
  width: 100%;
  border-bottom: 1px solid #e3e3e3;
}

.report-header > img {
  width: 50px;
}

.report-header > .details {
  text-align: center;
}

.report-header > .details > .title {
  color: #3aa959;
  font-weight: bold;
}

.report-header > .details > .timestamp {
  color: #b9b9b9;
  font-size: 12px;
}

.report-body {
  padding: 1rem 0;
  background-image: url("../../assets/images/report-bg.svg");
  background-position: bottom;
  background-size: 60%;
  z-index: 9999;
}

.report-body > .basic-details {
  border-bottom: 1px solid #e3e3e3;
}

.report-body > .basic-details > img {
  width: 100px;
  display: block;
  margin: 0 auto;
}

.report-body > .basic-details > h3 {
  text-align: center;
}

.report-body > .basic-details > .details {
  padding: 1rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.report-body > .basic-details > .details > div > span {
  color: #b0b0b0;
  font-size: 12px;
}

.report-body > .basic-details > .details > div > h4 {
  color: #4f4f4f;
  font-size: 16px;
}

.report-body > .basic-details > .contact-details {
  width: 70%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
}

.report-body > .basic-details > .contact-details > span {
  color: #868686;
  font-size: 14px;
}

.report-body > .about {
  padding: 1rem 0;
}

.report-body > .about > h3 {
  color: #4f4f4f;
}

.report-body > .about > p {
  color: #828282;
  margin-top: 0.5rem;
  font-style: normal;
}

a {
  text-decoration: none;
}

.report-body > .founders > h3 {
  color: #4f4f4f;
}

.report-body > .founders > .founders-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.report-body > .founders > .founders-row > .founder {
  border-right: 1px solid #e3e3e3;
  padding-right: 1rem;
}

.report-body > .founders > .founders-row > .founder > h4 {
  color: #3aa959;
  font-size: 14px;
}

.report-body
  > .founders
  > .founders-row
  > .founder
  > .social-links
  > a
  > .v-icon {
  font-size: 16px;
  color: #afafaf;
}

.report-body > .fundings {
  padding: 1rem 0;
}

.report-body > .fundings > h3 {
  color: #4f4f4f;
}

.report-body > .fundings > .funding-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.report-body > .fundings > .funding-row > .funding-col {
  border-right: 1px solid #e3e3e3;
  padding-right: 1rem;
}

.report-body > .fundings > .funding-row > .funding-col > h2 {
  color: #3aa959;
}

.report-body > .fundings > .funding-row > .funding-col > h4 {
  color: #666666;
  font-size: 14px;
}

.report-body > .awards {
  padding: 1rem 0;
}

.report-body > .awards > h3 {
  color: #4f4f4f;
}

table {
  width: 100%;
}

td,
th {
  border: 1px solid #ddd;
  padding: 8px;
}

td {
  color: #7b7b7b;
  font-size: 12px;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #ddd;
}

th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  color: #707070;
  font-size: 14px;
}

.report-body > .team {
  padding: 1rem 0;
}

.report-body > .team > h3 {
  color: #4f4f4f;
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