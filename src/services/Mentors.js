import { mentorsRef } from "../config/firebase_services";

/**
 * @param  {} incubatorId
 */
export const getMentorsByIncubatorId = async (incubatorId) => {
    const data = [];
    const documents = await mentorsRef.where('incubatorId', '==', incubatorId).where('isDeleted', '==', false).get();
    documents.forEach(document => {
        data.push(document.data());
    })
    return data
}