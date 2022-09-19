import { startupsRef } from "../../../config/firebase_services";
import store from "../../../store";


export const getFounders = async () => {
    const incubatorId = store.state.incubator.currentIncubator.docId;

    const documents = await startupsRef.where('incubatorId', '==', incubatorId).where("isDeleted", "==", false).get();

    let startups = []
    documents.forEach(document => {
        startups.push(document.data());
    })

    let founders = [];
    founders = startups.map((startup) =>
        startup.founders
    ).flat().map((founder) => founder.gender ? founder.gender : "Not updated")

    let counts = {};
    founders.forEach(function (x) {
        counts[x] = (counts[x] || 0) + 1;
    });
    return counts
}