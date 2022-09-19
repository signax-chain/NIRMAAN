import { startupsRef } from "../../../config/firebase_services";
import store from "../../../store";


export const getStartupsByDe = async () => {
    const incubatorId = store.state.incubator.currentIncubator.docId;

    const documents = await startupsRef.where('incubatorId', '==', incubatorId).where("isDeleted", "==", false).get();

    let startups = []
    documents.forEach(document => {
        startups.push(document.data());
    })

    let progress = [];

    progress = [
        ...new Set(
            startups.map(
                (startup) => {
                    return startup.progress !== undefined && startup.progress !== "" && startup.progress !== null ? startup.progress.currentStage : "Not updated";
                })
        )]
        .filter(x => x !== "" && x !== undefined);

    let counts = {};
    progress.forEach(function (x) {
        counts[x] = (counts[x] || 0) + 1;
    });

    return counts
}