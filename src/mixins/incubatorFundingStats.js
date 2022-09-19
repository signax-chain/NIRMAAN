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
                    title: "Funding Disbursed",
                    icon: "funding-disbursed.svg",
                    count: "6,800,000",
                },
                {
                    title: "Funding Utilized",
                    icon: "funding-utilized.svg",
                    count: "3,193,177.41",
                },
                {
                    title: "External Funding",
                    icon: "funding-external.svg",
                    count: "385,000",
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