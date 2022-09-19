import { startupsRef } from "../../../config/firebase_services";
import store from "../../../store";


export const getSectors = async (sectorValue) => {
    const incubatorId = store.state.incubator.currentIncubator.docId;

    const documents = await startupsRef.where('incubatorId', '==', incubatorId).where("isDeleted", "==", false).get();

    let startups = []
    documents.forEach(document => {
        startups.push(document.data());
    })

    let sectors = [];

    sectors = startups.map((startup) => {
        return startup.sector;
    }).filter(sector => sector !== undefined && sector !== null);

    let counts = {};
    sectors.forEach(function (x) {
        counts[x] = (counts[x] || 0) + 1;
    });

    const sortedSectors = Object.keys(counts).sort((a, b) => {
        return counts[b] - counts[a];
    }).slice(0, sectorValue.value);

    let top3Sectors = {}
    sortedSectors.forEach((sector) => {
        top3Sectors[sector] = counts[sector];
    })

    return top3Sectors
}