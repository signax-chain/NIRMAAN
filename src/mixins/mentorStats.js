import { getMentorsByIncubatorId } from "../services/Mentors";
import { calculateMentorHours, getMentoringSessions } from "../services/Mentorship";
import store from "../store";

export default {
    data() {
        return {
            recentActivities: [
                {
                    title: "Total Mentoring Hours",
                    icon: "total-startups.svg",
                    count: 103,
                    link: '/mentorship'
                },
                {
                    title: "Mentoring Sessions",
                    icon: "active-startups.svg",
                    count: 9,
                    link: '/mentorship'
                },
                {
                    title: "Total Mentors",
                    icon: "graduated-startups.svg",
                    count: 24,
                    link: '/mentors'
                },
                // {
                //     title: "Active Mentors",
                //     icon: "droppedout-startups.svg",
                //     count: 2,
                // },
            ]
        }
    },
    created() {
        this.getRecentActivities();
    },
    methods: {
        async getRecentActivities() {
            const incubatorId = store.state.incubator.currentIncubator.docId;
            const minutes = await calculateMentorHours(incubatorId);
            this.recentActivities[0].count = this.convertMinutesToHours(minutes);

            this.recentActivities[1].count = (await getMentoringSessions(incubatorId)).length;
            this.recentActivities[2].count = (await getMentorsByIncubatorId(incubatorId)).length;
        },
        convertMinutesToHours(minutes) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return hours + "hr " + mins + "min";
        }
    }
}