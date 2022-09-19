import store from '../store'
import {
    fundingRecieved,
    fundingUtilized,
    externalFunding,
} from "../services/Fundings";

export default {
    data() {
        return {
            fundingStats: [
                {
                    title: "Funding Disbursed",
                    icon: "funding-disbursed.svg",
                    count: 0,
                },
                {
                    title: "Funding Utilized",
                    icon: "funding-utilized.svg",
                    count: 0,
                },
                {
                    title: "External Funding",
                    icon: "funding-external.svg",
                    count: 0,
                },
                // {
                //     title: "VC Funding",
                //     icon: "funding-disbursed.svg",
                //     count: 0,
                // },
            ]
        }
    },
    async created() {
        const incubatorId = store.state.incubator.currentIncubator.docId;
        const year = "all";
        this.fundingStats[0].count = await fundingRecieved(incubatorId, year);
        this.fundingStats[1].count = await fundingUtilized(incubatorId, year);
        this.fundingStats[2].count = await externalFunding(incubatorId, year);
    },
}