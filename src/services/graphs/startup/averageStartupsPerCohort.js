import { startupsRef } from "../../../config/firebase_services"
import store from "../../../store"

export const getAverageStartupsPerCohort = async () => {
    const incubatorId = store.state.incubator.currentIncubator.docId

    let documents = await startupsRef.where("incubatorId", "==", incubatorId).where('isDeleted', '==', false).get()
    const totalStartups = documents.size

    let startups = []
    documents.forEach(doc => {
        startups.push(doc.data())
    })

    let cohorts = [];

    startups.forEach(startup => {
        startup.cohortBatch = `${startup.cohort.name} ${startup.cohort.year}`
    });

    cohorts = startups.map((startup) => startup.cohortBatch);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

    cohorts.sort((a, b) => {
        a = a.split(" ");
        b = b.split(" ");
        if (a[1] !== b[1]) {
            return a[1] - b[1];
        } else {
            return months.indexOf(a[0]) - months.indexOf(b[0]);
        }
    })

    cohorts = [...new Set(cohorts)];

    const totalSectors = cohorts.length;

    const avg = Math.round(totalStartups / totalSectors)
    return {
        totalStartups,
        totalSectors,
        avg
    }
}