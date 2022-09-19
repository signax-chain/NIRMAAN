import { mentorshipRef } from "../../../config/firebase_services"
import store from "../../../store"

export const getAverageDurationOfSessions = async () => {
    const incubatorId = store.state.incubator.currentIncubator.docId

    const documents = await mentorshipRef.where("incubator.docId", "==", incubatorId).get()

    const mentorship = []
    documents.forEach(doc => {
        mentorship.push({
            docId: doc.id,
            ...doc.data()
        })
    })

    const mentoringHours = mentorship.map(mentorship => {
        return mentorship.mentorHours
    })
    let res = {}

    res.hours = mentoringHours.reduce((a, b) => a + b, 0)
    res.sessions = mentoringHours.length
    res.avg = res.hours / res.sessions

    res.hours = convertMinuteToHours(res.hours)
    res.avg = convertMinuteToHours(res.avg)

    return res
}

function convertMinuteToHours(minute) {
    const hours = Math.floor(minute / 60)
    const minutes = minute % 60
    return `${hours}h ${minutes}m`
}