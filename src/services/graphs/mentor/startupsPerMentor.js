import { mentorsRef } from "../../../config/firebase_services";
import store from "../../../store";


export const getStartups = async () => {
    const incubatorId = store.state.incubator.currentIncubator.docId;

    const documents = await mentorsRef.where('incubatorId', '==', incubatorId).where("isDeleted", "==", false).get();

    let mentors = []
    documents.forEach(document => {
        mentors.push(document.data());
    })

    let mentorData = {};
    mentors.forEach((mentor) => {
        mentorData[mentor.name] = mentor.startupsAssociated.length
    })

    return mentorData
}