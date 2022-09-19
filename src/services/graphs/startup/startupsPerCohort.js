import { startupsRef } from "../../../config/firebase_services";
import store from "../../../store";


export const getCohorts = async () => {
    const incubatorId = store.state.incubator.currentIncubator.docId;

    const documents = await startupsRef.where('incubatorId', '==', incubatorId).where("isDeleted", "==", false).get();

    let startups = []
    documents.forEach(document => {
        startups.push(document.data());
    })

    let cohorts = [];

    startups.forEach(startup => {
        startup.cohortBatch = `${startup.cohort.name} ${startup.cohort.year}`
    });

    cohorts = startups.map((startup) => startup.cohortBatch);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    cohorts.sort((a, b) => {
        a = a.split(" ");
        b = b.split(" ");
        if (a[1] !== b[1]) {
            return a[1] - b[1];
        } else {
            return months.indexOf(a[0]) - months.indexOf(b[0]);
        }
    })

    let counts = {};
    cohorts.forEach(function (x) {
        counts[x] = (counts[x] || 0) + 1;
    });
    return counts
}