import { mentorshipRef } from '../config/firebase_services'
/**
 * @param  {} incubatorId
 */
export const getMentoringSessions = async (incubatorId) => {
    const sessions = []
    const documents = await mentorshipRef.where('incubator.docId', '==', incubatorId).get();
    documents.forEach(doc => {
        sessions.push(doc.data())
    })
    return sessions
}
/**
 * @param  {} incubatorId
 */
export const getMentorHours = async (incubatorId) => {
    const sessions = await getMentoringSessions(incubatorId);
    const mentorHours = sessions.map(session => session.mentorHours)
    return mentorHours;
}
/**
 * @param  {} incubatorId
 */
export const calculateMentorHours = async (incubatorId) => {
    const hours = await getMentorHours(incubatorId);
    return hours.reduce((acc, curr) => acc + curr, 0)
}