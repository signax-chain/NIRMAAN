import { mentorsRef } from "../../../config/firebase_services";
import store from "../../../store";


export const getAssignedAndNotAssignedStartups = async () => {
    const incubatorId = store.state.incubator.currentIncubator.docId;

    const documents = await mentorsRef.where('incubatorId', '==', incubatorId).where("isDeleted", "==", false).get();

    let mentors = []
    documents.forEach(document => {
        mentors.push(document.data());
    })

    let counts = {
        assigned: 0,
        notAssigned: 0
    };
    mentors.forEach((mentor) => {
        if (mentor.startupsAssociated.length > 0)
            counts.assigned++;
        else
            counts.notAssigned++;

    })

    return counts
}