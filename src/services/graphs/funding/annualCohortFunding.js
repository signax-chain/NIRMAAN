import { startupsRef } from "../../../config/firebase_services";
import store from "../../../store";


export const getAnnualCohortFunding = async () => {
    const incubatorId = store.state.incubator.currentIncubator.docId;

    const documents = await startupsRef.where('incubatorId', '==', incubatorId).where("isDeleted", "==", false).get();

    let startups = []
    documents.forEach(document => {
        startups.push(document.data());
    })

    let cohorts = [];

    cohorts = [...new Set(startups.map((startup) => {
        return startup.cohort.year !== null ? startup.cohort.year : "";
    }))];

    cohorts.sort((a, b) => {
        return parseInt(a) - parseInt(b);
    });

    let cohortWiseFunding = {};

    cohorts.forEach(cohort => {
        const cohortStartups = startups.filter(startup => startup.cohort.year === cohort);
        let fundings = []
        cohortStartups.forEach((st) => {
            fundings.push(st.funding);
        })
        fundings = fundings.filter(funding => funding !== undefined)
        let totalFunding = 0;

        if (fundings.length > 0) {
            fundings.forEach(funding => {
                totalFunding += +funding.received.toString().replace(/,/g, '');
            })
            cohortWiseFunding[cohort] = totalFunding;
        }
    })

    return cohortWiseFunding;
}