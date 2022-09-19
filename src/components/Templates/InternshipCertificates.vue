<template>
  <section>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <div class="d-flex justify-space-between align-center">
      <h3 class="heading">
        <v-btn icon link to="/all-requests">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        Internship Certificate
      </h3>
      <div class="d-flex">
        <v-btn color="traktor" dark class="mr-2" @click="download()"
          >Download</v-btn
        >
        <!-- <v-btn color="traktor" dark>Share</v-btn> -->
      </div>
    </div>
    <div class="c4" id="certificate">
      <p class="c5"><span class="c2 c14"></span></p>
      <p class="c5"><span class="c2 c16"></span></p>
      <p class="c9">
        <span class="c7">Internship Certificate</span
        ><span class="c2 c13">&nbsp;</span>
      </p>
      <p class="c6">
        <span class="c2 c23">Date: {{ new Date().toDateString() }} </span>
      </p>
      <p class="c21">
        <span class="c2 c1">This is to inform you that </span
        ><span class="c0">{{ item.request.candidateName }} </span
        ><span class="c2 c1">of {{ item.request.college }} has</span
        ><span class="c1">&nbsp;</span
        ><span class="c2 c1">
          successfully completed his Internship with {{ getStartupName() }}.
        </span>
      </p>
      <p class="c10">
        <span class="c2 c1"
          >{{ item.request.candidateName }} has worked as an </span
        ><span class="c0">Intern &ndash; {{ item.request.role.role }} </span
        ><span class="c2 c1">from </span
        ><span class="c0">{{ getMonthAndDate(item.request.dates[0]) }}</span
        ><span class="c8">th</span
        ><span class="c0">, {{ getYear(item.request.dates[0]) }} </span
        ><span class="c2 c1">&ndash; </span
        ><span class="c0">{{ getMonthAndDate(item.request.dates[1]) }}</span
        ><span class="c8">th</span
        ><span class="c0">, {{ getYear(item.request.dates[1]) }} </span
        ><span class="c2 c1">Through </span><span class="c1">&nbsp;</span
        ><span class="c2 c1"
          >the course of his internship, he worked on various aspects.
          &nbsp;</span
        >
      </p>
      <p class="c11">
        <span class="c2 c1"
          >During the Internship, we have found him to be hardworking, diligent,
          and timely with his work. He will be an</span
        ><span class="c1">&nbsp;</span><span class="c1 c2">asset to any </span
        ><span class="c1">organization</span
        ><span class="c2 c1"
          >&nbsp;he plans to join in the future and we wish him all the best </span
        ><span class="c1">in</span><span class="c2 c1">&nbsp;his </span
        ><span class="c1">endeavors</span><span class="c2 c1">. </span>
      </p>
      <p class="c15"><span class="c0">Best, </span></p>
      <p class="c18"><span class="c0"></span></p>
      <p class="c12">
        <span class="c20">{{ founderName }}</span
        ><span class="c0">&nbsp; </span>
      </p>
      <p class="c3"><span class="c0">Founder &amp; CEO, &nbsp;</span></p>
      <p class="c19">
        <span class="c20">{{ companyName }}</span>
      </p>
      <p class="c22"><span class="c2 c17"></span></p>
    </div>
  </section>
</template>

<script>
import { getAllRequests, getStartups } from "../../services/raise-request";
import html2pdf from "html2pdf.js";

export default {
  name: "InternshipCertificates",
  data() {
    return {
      items: [],
      item: {},
      startups: [],
      crumbs: [
        {
          text: "Requests",
          disabled: true,
        },
        {
          text: "Internship Certificate",
          disabled: true,
        },
      ],
    };
  },
  created() {
    this.prepareData();
  },
  mounted() {
    this.item = this.$route.params;
    if (Object.keys(this.item).length === 1) this.getData();
  },
  methods: {
    async prepareData() {
      this.startups = await getStartups();
    },
    async getData() {
      this.items = await getAllRequests();
      this.item = this.items.find((item) => item.id === this.$route.params.id);
    },
    getMonthAndDate(dateString) {
      const date = new Date(dateString);
      return date.toDateString().split(" ")[1] + " " + date.getDate();
    },
    getYear(dateString) {
      const date = new Date(dateString);
      return date.toDateString().split(" ")[3];
    },
    getStartupName() {
      return this.startups.find((item) => item.id === this.item.userId).name;
    },
    download() {
      const element = document.getElementById("certificate");
      element.style.width = "100%";
      const opt = {
        // margin: [0, 0, 0, 0],
        filename: "Internship Certificate.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, logging: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      html2pdf().from(element).set(opt).save();
      //   element.style.width = "76%";
    },
  },
};
</script>

<style scoped>
@import url("https://themes.googleusercontent.com/fonts/css?kit=soa_V42eXREs8LDkwBiWS64fnxpW6PVRuPCJ3776g6WJs-Cxcflh_ev5EYg-iABu");

.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}

ol {
  margin: 0;
  padding: 0;
}

table td,
table th {
  padding: 0;
}

.c7 {
  -webkit-text-decoration-skip: none;
  color: #000000;
  font-weight: 700;
  text-decoration: underline;
  vertical-align: baseline;
  text-decoration-skip-ink: none;
  font-size: 13pt;
  font-family: "Arial Narrow";
  font-style: normal;
}

.c21 {
  margin-left: 0.3pt;
  padding-top: 34.9pt;
  text-indent: 0pt;
  padding-bottom: 0pt;
  line-height: 1.4244863986968994;
  text-align: left;
  margin-right: -0.2pt;
}

.c0 {
  color: #000000;
  font-weight: 700;
  text-decoration: none;
  vertical-align: baseline;
  font-size: 11.5pt;
  font-family: "Arial Narrow";
  font-style: normal;
}

.c22 {
  margin-left: 0.2pt;
  padding-top: 332.7pt;
  padding-bottom: 0pt;
  line-height: 0.9485788941383362;
  text-align: center;
  margin-right: 3.3pt;
  height: 11pt;
}

.c8 {
  color: #000000;
  font-weight: 700;
  text-decoration: none;
  vertical-align: super;
  font-size: 12.4pt;
  font-family: "Arial Narrow";
  font-style: normal;
}

.c10 {
  margin-left: 0.2pt;
  padding-top: 21.3pt;
  text-indent: 0.5pt;
  padding-bottom: 0pt;
  line-height: 1.4230432510375977;
  text-align: left;
  margin-right: -0.2pt;
}

.c11 {
  margin-left: 0.3pt;
  padding-top: 21.3pt;
  text-indent: 0.4pt;
  padding-bottom: 0pt;
  line-height: 1.4403965473175049;
  text-align: left;
  margin-right: 0pt;
}

.c15 {
  margin-left: 0.7pt;
  padding-top: 20.8pt;
  padding-bottom: 0pt;
  line-height: 1;
  text-align: left;
}

.c12 {
  margin-left: 0pt;
  padding-top: 0pt;
  padding-bottom: 0pt;
  line-height: 1;
  text-align: left;
}

.c18 {
  padding-top: 1.1pt;
  padding-bottom: 0pt;
  line-height: 1;
  text-align: left;
  height: 11pt;
}

.c5 {
  padding-top: 0pt;
  padding-bottom: 0pt;
  line-height: 1;
  text-align: center;
  height: 11pt;
}

.c6 {
  padding-top: 28.1pt;
  padding-bottom: 0pt;
  line-height: 1;
  text-align: right;
  margin-right: 2.2pt;
}

.c3 {
  margin-left: 0.7pt;
  padding-top: 0pt;
  padding-bottom: 0pt;
  line-height: 1;
  text-align: left;
}

.c19 {
  margin-left: 0.2pt;
  padding-top: 0pt;
  padding-bottom: 0pt;
  line-height: 1;
  text-align: left;
}

.c2 {
  color: #000000;
  text-decoration: none;
  vertical-align: baseline;
  font-style: normal;
}

.c9 {
  padding-top: 30.1pt;
  padding-bottom: 0pt;
  line-height: 1;
  text-align: center;
}

.c13 {
  font-weight: 700;
  font-size: 13pt;
  font-family: "Arial Narrow";
}

.c4 {
  background-color: #ffffff;
  max-width: 76%;
  padding: 8.4pt 69.1pt 19pt 72pt;
  margin: 0 auto;
}

.c14 {
  font-weight: 400;
  font-size: 11pt;
  font-family: "Arial";
}

.c17 {
  font-weight: 400;
  font-size: 9.6pt;
  font-family: "Arial Narrow";
}

.c16 {
  font-weight: 400;
  font-size: 11pt;
  font-family: "Calibri";
}

.c1 {
  font-size: 11.5pt;
  font-family: "Arial Narrow";
  font-weight: 400;
}

.c20 {
  font-size: 11.5pt;
  font-family: "Arial Narrow";
  font-weight: 700;
}

.c23 {
  font-weight: 700;
  font-size: 11pt;
  font-family: "Arial Narrow";
}

.title {
  padding-top: 24pt;
  color: #000000;
  font-weight: 700;
  font-size: 36pt;
  padding-bottom: 6pt;
  font-family: "Arial";
  line-height: 1.15;
  page-break-after: avoid;
  orphans: 2;
  widows: 2;
  text-align: left;
}

.subtitle {
  padding-top: 18pt;
  color: #666666;
  font-size: 24pt;
  padding-bottom: 4pt;
  font-family: "Georgia";
  line-height: 1.15;
  page-break-after: avoid;
  font-style: italic;
  orphans: 2;
  widows: 2;
  text-align: left;
}

li {
  color: #000000;
  font-size: 11pt;
  font-family: "Arial";
}

p {
  margin: 0;
  color: #000000;
  font-size: 11pt;
  font-family: "Arial";
}

h1 {
  padding-top: 24pt;
  color: #000000;
  font-weight: 700;
  font-size: 24pt;
  padding-bottom: 6pt;
  font-family: "Arial";
  line-height: 1.15;
  page-break-after: avoid;
  orphans: 2;
  widows: 2;
  text-align: left;
}

h2 {
  padding-top: 18pt;
  color: #000000;
  font-weight: 700;
  font-size: 18pt;
  padding-bottom: 4pt;
  font-family: "Arial";
  line-height: 1.15;
  page-break-after: avoid;
  orphans: 2;
  widows: 2;
  text-align: left;
}

h3 {
  padding-top: 14pt;
  color: #000000;
  font-weight: 700;
  font-size: 14pt;
  padding-bottom: 4pt;
  font-family: "Arial";
  line-height: 1.15;
  page-break-after: avoid;
  orphans: 2;
  widows: 2;
  text-align: left;
}

h4 {
  padding-top: 12pt;
  color: #000000;
  font-weight: 700;
  font-size: 12pt;
  padding-bottom: 2pt;
  font-family: "Arial";
  line-height: 1.15;
  page-break-after: avoid;
  orphans: 2;
  widows: 2;
  text-align: left;
}

h5 {
  padding-top: 11pt;
  color: #000000;
  font-weight: 700;
  font-size: 11pt;
  padding-bottom: 2pt;
  font-family: "Arial";
  line-height: 1.15;
  page-break-after: avoid;
  orphans: 2;
  widows: 2;
  text-align: left;
}

h6 {
  padding-top: 10pt;
  color: #000000;
  font-weight: 700;
  font-size: 10pt;
  padding-bottom: 2pt;
  font-family: "Arial";
  line-height: 1.15;
  page-break-after: avoid;
  orphans: 2;
  widows: 2;
  text-align: left;
}
</style>