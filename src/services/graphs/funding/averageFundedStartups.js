import { startupsRef } from "../../../config/firebase_services"
import store from "../../../store"

export const getAverageFundedStartups = async () => {
    const incubatorId = store.state.incubator.currentIncubator.docId;

    let documents = await startupsRef.where("incubatorId", "==", incubatorId).where('isDeleted', '==', false).get()
    const totalStartups = documents.size

    let startups = []
    documents.forEach(doc => {
        startups.push(doc.data())
    })

    const fundings = startups.map(startup => {
        return startup.funding
    })
        .filter(funding => funding !== undefined)
        .map(funding => funding.received)

    const avg = Math.round(fundings.length * 100 / totalStartups)
    console.log(avg);
    return {
        fundedStartups: fundings.length,
        totalStartups,
        avg
    }
}