import { activityRef } from "../../../config/firebase_services"
import store from "../../../store"

export const getStartupLogins = async () => {
    const incubatorId = store.state.incubator.currentIncubator.docId
    const documents = await activityRef.where('incubatorId', '==', incubatorId).where('type', '==', 'startup').orderBy('createdAt').get()

    const activities = []
    documents.forEach(document => {
        activities.push(document.data()['createdAt'].toDate().toLocaleString('default', { month: 'long' }))
    })

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let counts = {};
    activities.forEach(function (x) {
        counts[x] = (counts[x] || 0) + 1;
    });

    months.forEach(month => {
        const count = counts[month] || 0;
        counts[month] = count
    })

    return counts
}