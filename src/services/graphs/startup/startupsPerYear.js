import { startupsRef } from "../../../config/firebase_services";
import store from "../../../store";


export const getStartupsByYear = async () => {
    const incubatorId = store.state.incubator.currentIncubator.docId;

    const documents = await startupsRef.where('incubatorId', '==', incubatorId).where("isDeleted", "==", false).get();

    let startups = []
    documents.forEach(document => {
        startups.push(document.data());
    })

    let cohortYears = [];

    cohortYears = startups.map((startup) => startup.cohort.year).sort((a, b) => a - b);

    let counts = {};
    cohortYears.forEach(function (x) {
        counts[x] = (counts[x] || 0) + 1;
    });
    return counts
}