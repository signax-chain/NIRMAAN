import { startupsRef } from "../config/firebase_services";
import store from "../store";

export default {
  data() {
    return {
      recentActivities: [
        {
          title: "Total Startups",
          icon: "total-startups.svg",
          count: "0",
          link: "/startups?status=all",
        },
        {
          title: "Active Startups",
          icon: "active-startups.svg",
          count: "0",
          link: "/startups?status=active",
        },
        {
          title: "Graduated Startups",
          icon: "graduated-startups.svg",
          count: "0",
          link: "/startups?status=graduated",
        },
        {
          title: "Dropped Out",
          icon: "droppedout-startups.svg",
          count: "0",
          link: "/startups?status=droppedout",
        },
      ],
    };
  },
  created() {
    this.getRecentActivities();
  },
  methods: {
    async getRecentActivities() {
      const startupRef = await startupsRef
        .where(
          "incubatorId",
          "==",
          store.state.incubator.currentIncubator.docId
        )
        .where("isDeleted", "==", false)
        .get();
      this.recentActivities[0].count = startupRef.size;

      const activeRef = await startupsRef
        .where(
          "incubatorId",
          "==",
          store.state.incubator.currentIncubator.docId
        )
        .where("status", "==", "active")
        .where("isDeleted", "==", false)
        .get();
      this.recentActivities[1].count = activeRef.size;

      const graduatedRef = await startupsRef
        .where(
          "incubatorId",
          "==",
          store.state.incubator.currentIncubator.docId
        )
        .where("status", "==", "graduated")
        .where("isDeleted", "==", false)
        .get();
      this.recentActivities[2].count = graduatedRef.size;

      const droppedoutRef = await startupsRef
        .where(
          "incubatorId",
          "==",
          store.state.incubator.currentIncubator.docId
        )
        .where("status", "==", "droppedout")
        .where("isDeleted", "==", false)
        .get();
      this.recentActivities[3].count = droppedoutRef.size;
    },
  },
};
