import { startupsRef } from "../../../config/firebase_services";
import store from "../../../store";


export const getSectorWiseFunding = async (number) => {
    const incubatorId = store.state.incubator.currentIncubator.docId;

    const documents = await startupsRef.where('incubatorId', '==', incubatorId).where("isDeleted", "==", false).get();

    let startups = []
    documents.forEach(document => {
        startups.push(document.data());
    })

    let sectors = [];

    sectors = [...new Set(startups.map((startup) => {
        return startup.sector !== null ? startup.sector : "";
    }))];

    let sectorWiseFunding = {};

    sectors.forEach(sector => {
        const secStartups = startups.filter(startup => startup.sector === sector);
        let fundings = []
        secStartups.forEach((st) => {
            fundings.push(st.funding);
        })
        fundings = fundings.filter(funding => funding !== undefined)
        let totalFunding = 0;

        if (fundings.length > 0) {
            fundings.forEach(funding => {
                totalFunding += +funding.received.toString().replace(/,/g, '');
            })
            sectorWiseFunding[sector] = totalFunding + getExternalFunding(sector, startups);
        }
    })

    const sortedSectors = Object.keys(sectorWiseFunding).sort((a, b) => {
        return sectorWiseFunding[b] - sectorWiseFunding[a];
    }).slice(0, number);

    let top3Sectors = {}
    sortedSectors.forEach((sector) => {
        top3Sectors[sector] = sectorWiseFunding[sector];
    })

    return top3Sectors;
}

function getExternalFunding(sector, startups) {
    const secStartups = startups.filter(startup => startup.sector === sector);
    const awards = secStartups.map(startup => startup.awards).flat();
    let total = 0
    if (awards.length > 0) {
        let amounts = []
        amounts = awards.map((award) => award.money)
        amounts.forEach(amt => {
            if (amt !== "" && amt !== null) {
                total += +amt.replace(/[^0-9]/g, "")
            }
        })
    }
    return total
}