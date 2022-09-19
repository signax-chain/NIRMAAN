import { mentorsRef } from "../../../config/firebase_services";
import store from "../../../store";


export const getIndustries = async (mentorValue) => {
    const incubatorId = store.state.incubator.currentIncubator.docId;

    const documents = await mentorsRef.where('incubatorId', '==', incubatorId).where("isDeleted", "==", false).get();

    let mentors = []
    documents.forEach(document => {
        mentors.push(document.data());
    })

    let industries = [];
    industries = mentors.map((mentor) =>
        mentor.areaOfExpertise
    ).flat();

    let counts = {};
    industries.forEach(function (x) {
        counts[x] = (counts[x] || 0) + 1;
    });

    let sortedIndustries = Object.keys(counts).sort(function (a, b) {
        return counts[b] - counts[a];
    }).slice(0, mentorValue.value);

    let topIndustries = {}
    sortedIndustries.forEach(industry => {
        topIndustries[industry] = counts[industry];
    })

    return topIndustries
}