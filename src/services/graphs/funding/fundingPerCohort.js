import { startupsRef } from "../../../config/firebase_services";
import store from "../../../store";


export const getCohortWiseFunding = async () => {
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

    cohorts = [...new Set(startups.map((startup) => {
        return startup.cohortBatch !== null ? startup.cohortBatch : "";
    }))];

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

    let cohortWiseFunding = {};

    cohorts.forEach(cohort => {
        const cohortStartups = startups.filter(startup => startup.cohortBatch === cohort);
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