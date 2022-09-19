// import store from '../store'
// import {
//     fundingRecieved,
//     fundingUtilized,
//     externalFunding,
// } from "../services/Fundings";

export default {
    data() {
        return {
            recentActivities: [
                {
                    title: "Revenue Generated",
                    icon: "funding-disbursed.svg",
                    count: "6,800,000",
                },
                {
                    title: "Valuation",
                    icon: "funding-utilized.svg",
                    count: "Rs. 385,000",
                },
            ]
        }
    },
    async created() {
        // const incubatorId = store.state.incubator.currentIncubator.docId;
        // const year = "all";
        // this.fundingStats[0].count = await fundingRecieved(incubatorId, year);
        // this.fundingStats[1].count = await fundingUtilized(incubatorId, year);
        // this.fundingStats[2].count = await externalFunding(incubatorId, year);
    },
}