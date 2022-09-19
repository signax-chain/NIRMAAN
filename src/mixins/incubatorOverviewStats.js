import { impactStatsRef, websiteRef } from "../config/firebase_services";
import store from '../store'

export default {
    data() {
        return {
            recentActivities: [
                {
                    title: "Total Incubators",
                    icon: 'total-incubators.svg',
                    count: 103,
                    isEditable: false,
                },
                {
                    title: "Active Incubators",
                    icon: 'active-incubators.svg',
                    count: 37,
                    isEditable: false,
                },
                {
                    title: "Total Startups Incubated",
                    icon: 'total-startups-1.svg',
                    count: 17,
                    isEditable: false,
                },
                {
                    title: "Total Events",
                    icon: 'total-events.svg',
                    count: 49,
                    isEditable: false,
                },
                // {
                //     title: "Inactive",
                //     icon: 'inactive-incubators.svg',
                //     count: 5,
                //     isEditable: false,
                // },
            ]
        }
    },
    created() {
        // https://www.figma.com/file/VN4yZS32Br4Xat1yPKcNiT/Platform?node-id=2136%3A10291https://www.figma.com/file/VN4yZS32Br4Xat1yPKcNiT/Platform?node-id=2136%3A10291
        // this.getRecentActivities();
    },
    methods: {
        async getRecentActivities() {

            const jobsDocuments = await websiteRef.doc(store.state.incubator.currentIncubator.docId).collection('jobs').get();
            this.recentActivities[0].count = jobsDocuments.size;

            impactStatsRef.doc(store.state.incubator.currentIncubator.docId).onSnapshot(snapshot => {
                const data = snapshot.data()
                this.recentActivities[1].count = data.ipsCreated ? data.ipsCreated : 0;
                this.recentActivities[2].count = data.revenueGenerated ? data.revenueGenerated : 0;
                this.recentActivities[3].count = data.startupValuation ? data.startupValuation : 0;
            })
        }
    }
}