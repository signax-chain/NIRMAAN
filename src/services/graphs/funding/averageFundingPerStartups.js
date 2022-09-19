import { startupsRef } from "../../../config/firebase_services"
import store from "../../../store"

export const getAverageFundingPerStartups = async () => {
    const incubatorId = store.state.incubator.currentIncubator.docId;

    let documents = await startupsRef.where("incubatorId", "==", incubatorId).get()
    // const totalStartups = documents.size

    let startups = []
    documents.forEach(doc => {
        startups.push(doc.data())
    })

    const fundings = startups.map(startup => {
        return startup.funding
    })
        .filter(funding => funding !== undefined)
        .map(funding => funding.received)
    let totalFunding = 0

    fundings.forEach(amt => {
        if (amt !== "" && amt !== null) {
            totalFunding += parseFloat(amt.toString().replace(',', ""))
        }
    })

    const avg = Math.round(totalFunding / fundings.length)
    return {
        totalStartups: fundings.length,
        totalFunding,
        avg
    }
}