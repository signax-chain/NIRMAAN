import { impactStatsRef } from "../config/firebase_services";
import { teamMembersObj } from "../services/graphs/startup/team-members";
import store from "../store";

export default {
  data() {
    return {
      recentActivities: [
        {
          title: "Internships Offered",
          icon: "request-new-job.svg",
          count: 0,
          isEditable: false,
        },
        {
          title: "IPs Created",
          icon: "active-startups.svg",
          count: 0,
          isEditable: true,
        },
        {
          title: "Revenue Generated",
          icon: "funding-disbursed.svg",
          count: 0,
          isEditable: true,
        },
        {
          title: "Startup Valuation",
          icon: "total-startups.svg",
          count: 0,
          isEditable: true,
        },
      ],
    };
  },
  created() {
    this.getRecentActivities();
  },
  methods: {
    async getRecentActivities() {
      // const jobsDocuments = await websiteRef.doc(store.state.incubator.currentIncubator.docId).collection('jobs').get();
      // this.recentActivities[0].count = jobsDocuments.size;
      const count = await teamMembersObj.findCount();
      impactStatsRef
        .doc(store.state.incubator.currentIncubator.docId)
        .onSnapshot((snapshot) => {
          const data = snapshot.data();
          this.recentActivities[0].count = count;
          this.recentActivities[1].count = data.ipsCreated
            ? data.ipsCreated
            : 0;
          this.recentActivities[2].count = data.revenueGenerated
            ? data.revenueGenerated
            : 0;
          this.recentActivities[3].count = data.startupValuation
            ? data.startupValuation
            : 0;
        });
    },
  },
};
