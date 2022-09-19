<template>
  <v-row>
    <v-col cols="12" :md="activityLen > 0 ? 9 : 12" class="mt-3">
      <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
      <h3 class="heading">Recent Activity</h3>
      <div class="recent-activity-row">
        <recent-activity
          v-for="(activity, index) in recentActivities"
          :key="index"
          :activity="activity"
        ></recent-activity>
      </div>
      <!-- <v-row class="quick__data mt-3" id="v-step-0">
        <CountCard
          v-for="(item, index) in cardItems"
          :key="index"
          :item="item"
        />
        <a
          href="http://nirmaan.iitm.ac.in"
          target="_blank"
          class="card__container nirmaan ml-2"
          v-show="$store.state.incubator.currentIncubator.isWebsite"
        >
          <div class="card__icon">
            <v-icon size="50" color="traktor">mdi-web</v-icon>
          </div>
          <div class="card__details">
            <span>Nirmaan Website</span>
            <h2 class="black--text"></h2>
          </div>
        </a>
      </v-row> -->
      <v-row>
        <v-col cols="12" md="12" class="current__mentees">
          <h3 class="heading mt-5">Other Stats</h3>
          <Counts class="mx-2" />
        </v-col>
      </v-row>
      <v-row class="mt-5">
        <v-col cols="12" md="12">
          <current-mentees class="mx-5" />
        </v-col>
      </v-row>
      <div class="upcomings">
        <div class="upcoming-col">
          <h3 class="heading">Upcoming Events</h3>
          <upcoming-events></upcoming-events>
        </div>
        <div class="upcoming-col">
          <h3 class="heading">Mentoring Session</h3>
          <upcoming-sessions></upcoming-sessions>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import UpcomingEvents from "@/components/Events/UpcomingEvents";
import UpcomingSessions from "@/components/Mentorship/UpcomingSessions";
import { startupsRef, mentorsRef } from "../../config/firebase_services";
import CurrentMentees from "@/components/Mentor/CurrentMentees";
import Counts from "@/components/Mentor/Counts";
import RecentActivity from "../../components/Startup/Cards/RecentActivity.vue";
import startupStats from "../../mixins/startupStats";

export default {
  name: "Dashboard",
  components: {
    UpcomingEvents,
    UpcomingSessions,
    CurrentMentees,
    Counts,
    RecentActivity,
  },
  data() {
    return {
      isLoading: true,
      activityLen: 0,
      cardItems: [
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
        {
          icon: "mdi-teach",
          title: "Mentors",
          count: 0,
          path: "/mentors",
        },
      ],
      configItem: {},
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
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
          href: "breadcrumbs_dashboard",
        },
      ],
    };
  },
  mixins: [startupStats],
  async created() {
    const startupRef = await startupsRef
      .where(
        "incubatorId",
        "==",
        this.$store.state.incubator.currentIncubator.docId
      )
      .where("isDeleted", "==", false)
      .get();
    this.cardItems[0].count = startupRef.size;

    const mentorRef = await mentorsRef
      .where(
        "incubatorId",
        "==",
        this.$store.state.incubator.currentIncubator.docId
      )
      .where("isDeleted", "==", false)
      .get();
    this.cardItems[4].count = mentorRef.size;

    const activeRef = await startupsRef
      .where(
        "incubatorId",
        "==",
        this.$store.state.incubator.currentIncubator.docId
      )
      .where("status", "==", "active")
      .where("isDeleted", "==", false)
      .get();
    this.cardItems[1].count = activeRef.size;

    const graduatedRef = await startupsRef
      .where(
        "incubatorId",
        "==",
        this.$store.state.incubator.currentIncubator.docId
      )
      .where("status", "==", "graduated")
      .where("isDeleted", "==", false)
      .get();
    this.cardItems[2].count = graduatedRef.size;

    const droppedoutRef = await startupsRef
      .where(
        "incubatorId",
        "==",
        this.$store.state.incubator.currentIncubator.docId
      )
      .where("status", "==", "droppedout")
      .where("isDeleted", "==", false)
      .get();
    this.cardItems[3].count = droppedoutRef.size;

    this.isLoading = false;
  },
  methods: {
    updateActivityLen(len) {
      this.activityLen = len;
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}

.card__container {
  box-shadow: 0 0 24px rgba(299, 299, 299, 0.75);
  background: #fff;
  border: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  width: 32%;
  height: 80px;
}

span {
  color: #b0b0b0;
  font-size: 14px;
  font-weight: bold;
}

.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}

.recent-activity-row {
  display: flex;
  align-items: center;
  margin: 0 1rem;
  flex-wrap: wrap;
}

.upcomings {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 1rem;
}

.upcoming-col {
  width: 46%;
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  padding: 1rem;
}

@media only screen and (max-width: 600px) {
  .quick__data {
    display: flex;
    flex-wrap: wrap;
  }

  .quick__data > * {
    width: 100%;
  }

  .nirmaan {
    margin: 0 5px !important;
  }
}
</style>