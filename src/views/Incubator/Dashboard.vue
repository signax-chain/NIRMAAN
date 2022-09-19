<template>
  <v-row>
    <v-col cols="12" md="9" class="middle-block">
      <vue-scroll>
        <div class="wrapper">
          <overview
            v-if="
              $route.query.tab === 'overview' || $route.query.tab === undefined
            "
          ></overview>
          <startup v-if="$route.query.tab === 'startup'"></startup>
          <mentors v-if="$route.query.tab === 'mentors'"></mentors>
          <funding v-if="$route.query.tab === 'funding'"></funding>
          <events v-if="$route.query.tab === 'events'"></events>
        </div>
      </vue-scroll>
    </v-col>
    <v-col cols="12" md="3">
      <upcoming-events></upcoming-events>
    </v-col>
  </v-row>
</template>

<script>
import { startupsRef, mentorsRef } from "../../config/firebase_services";
import {
  fundingRecieved,
  fundingUtilized,
  externalFunding,
} from "../../services/Fundings";
import { getCohortYears } from "../../services/dynamics";
import { calculateMentorHours } from "../../services/Mentorship";
import mentorship from "../../mixins/mentorship";
import Overview from "../../components/Incubator/DashboardsV2/Overview.vue";
import Startup from "../../components/Incubator/DashboardsV2/Startup.vue";
import Mentors from "../../components/Incubator/DashboardsV2/Mentors.vue";
import Funding from "../../components/Incubator/DashboardsV2/Funding.vue";
import Events from "../../components/Incubator/Dashboards/Events.vue";
import UpcomingEvents from "../../components/Incubator/DashboardsV2/UpcomingEvents.vue";

export default {
  name: "Dashboard",
  components: {
    Overview,
    Startup,
    Mentors,
    Funding,
    Events,
    UpcomingEvents,
  },
  mixins: [mentorship],
  data() {
    return {
      isLoading: true,
      filters: ["Startups", "Mentors", "Funding"],
      activeFilter: "Startups",
      startupItems: [
        {
          icon: "mdi-account-group",
          title: "Total startups",
          count: 0,
          path: "/startups?status=all",
        },
        {
          icon: "mdi-account-multiple-check",
          title: "Active startups",
          count: 0,
          path: "/startups?status=active",
        },
        {
          icon: "mdi-account-tie",
          title: "Graduated startups",
          count: 0,
          path: "/startups?status=graduated",
        },
        {
          icon: "mdi-account-multiple-minus",
          title: "Dropped out",
          count: 0,
          path: "/startups?status=droppedout",
        },
      ],
      mentorItems: [
        {
          icon: "mdi-teach",
          title: "Mentors",
          count: 0,
          path: "/mentors",
        },
        {
          icon: "mdi-timer-outline",
          title: "Mentor Hours",
          count: 0,
          path: "",
        },
      ],
      configItems: [
        {
          title: "Template Uploads",
          href: "/uploads",
          icon: "mdi-upload",
        },
      ],
      fundingItems: [
        {
          title: "Funding Disbursed",
          icon: "mdi-cash-multiple",
          count: 0,
        },
        {
          title: "Funding Utilized",
          icon: "mdi-cash-minus",
          count: 0,
        },
        {
          title: "External Funding",
          icon: "mdi-cash-refund",
          count: 0,
        },
      ],
      year: "all",
      cohortyears: ["all"],
    };
  },
  async created() {
    const startupRef = await startupsRef
      .where(
        "incubatorId",
        "==",
        this.$store.state.incubator.currentIncubator.docId
      )
      .where("isDeleted", "==", false)
      .get();
    this.startupItems[0].count = startupRef.size;

    const activeRef = await startupsRef
      .where(
        "incubatorId",
        "==",
        this.$store.state.incubator.currentIncubator.docId
      )
      .where("status", "==", "active")
      .where("isDeleted", "==", false)
      .get();
    this.startupItems[1].count = activeRef.size;

    const graduatedRef = await startupsRef
      .where(
        "incubatorId",
        "==",
        this.$store.state.incubator.currentIncubator.docId
      )
      .where("status", "==", "graduated")
      .where("isDeleted", "==", false)
      .get();
    this.startupItems[2].count = graduatedRef.size;

    const droppedoutRef = await startupsRef
      .where(
        "incubatorId",
        "==",
        this.$store.state.incubator.currentIncubator.docId
      )
      .where("status", "==", "droppedout")
      .where("isDeleted", "==", false)
      .get();
    this.startupItems[3].count = droppedoutRef.size;

    const mentorRef = await mentorsRef
      .where(
        "incubatorId",
        "==",
        this.$store.state.incubator.currentIncubator.docId
      )
      .where("isDeleted", "==", false)
      .get();
    this.mentorItems[0].count = mentorRef.size;

    this.setConfig();
    this.setCohortYears();
    this.getFundingData();
    this.getMentorHours();

    this.isLoading = false;
  },
  methods: {
    async setCohortYears() {
      this.cohortyears = [
        ...this.cohortyears,
        ...(await getCohortYears(
          this.$store.state.incubator.currentIncubator.docId
        )),
      ];
      this.cohortyears = [...new Set(this.cohortyears)].sort((a, b) => {
        return b - a;
      });
      this.year = "all";
    },
    setConfig() {
      if (this.$store.state.incubator.currentIncubator.isWebsite)
        this.configItems.push({
          title: "Official Website Update",
          href: "/official-website",
          icon: "mdi-web",
        });
    },
    async getFundingData() {
      const incubatorId = this.$store.state.incubator.currentIncubator.docId;
      const year = "all";
      this.fundingItems[0].count = await fundingRecieved(incubatorId, year);
      this.fundingItems[1].count = await fundingUtilized(incubatorId, year);
      this.fundingItems[2].count = await externalFunding(incubatorId, year);
    },
    async handleFunding(year) {
      const incubatorId = this.$store.state.incubator.currentIncubator.docId;
      this.fundingItems[0].count = await fundingRecieved(incubatorId, year);
      this.fundingItems[1].count = await fundingUtilized(incubatorId, year);
      this.fundingItems[2].count = await externalFunding(incubatorId, year);
    },
    async getMentorHours() {
      const incubatorId = this.$store.state.incubator.currentIncubator.docId;
      const minutes = await calculateMentorHours(incubatorId);
      this.mentorItems[1].count = this.convertMinutesToHours(minutes);
    },
  },
};
</script>

<style scoped>
.middle-block {
  min-height: 100vh;
  height: 100vh;
  overflow-y: scroll;
}

.wrapper {
  background-color: #fff;
  border-radius: 5px;
  padding: 0.5rem 1rem;
}

>>> .v-input__control > .v-input__slot {
  border: 1px solid #e5e5e5;
}

@media only screen and (max-width: 600px) {
  .quick__data {
    display: flex;
    flex-wrap: wrap;
  }

  .select__col {
    padding: 12px;
  }
}
</style>