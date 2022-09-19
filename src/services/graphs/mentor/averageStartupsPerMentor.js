import { mentorsRef, startupsRef } from "../../../config/firebase_services"
import store from "../../../store"

export const getAverageStartupsPerMentor = async () => {
    const incubatorId = store.state.incubator.currentIncubator.docId

    let documents = await startupsRef.where("incubatorId", "==", incubatorId).where("isDeleted", "==", false).get()
    const totalStartups = documents.size

    documents = await mentorsRef.where("incubatorId", "==", incubatorId).where("isDeleted", "==", false).get()
    const totalMentors = documents.size

    const avg = Math.round(totalStartups / totalMentors)
    return {
        totalStartups,
        totalMentors,
        avg
    }
}