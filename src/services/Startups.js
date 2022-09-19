import { startupsRef } from "../config/firebase_services"

/**
 * @param  {} incubatorId
 */
export const getStartups = async (incubatorId) => {
    const startups = []
    const documents = await startupsRef
        .where(
            "incubatorId",
            "==",
            incubatorId
        )
        .where("isDeleted", "==", false)
        .where("status", "==", 'active')
        .get();

    documents.forEach(document => {
        if (document.exists) {
            startups.push(document.data())
        }
    })
    return startups
}

/**
 * @param  {} id
 */
export const getStartupById = async (id) => {
    const document = await startupsRef.doc(id).get()
    return document.data()
}

/**
 * @param  {} incubatorId
 */
export const getStartupsByIncubatorId = async (incubatorId) => {
    const data = [];
    const documents = await startupsRef.where('incubatorId', '==', incubatorId).where('isDeleted', '==', false).where('status', '==', 'active').get();
    documents.forEach(document => {
        data.push(document.data());
    })
    return data
}

/**
 * @param  {} incubatorId
 */
export const getMentorsAssociated = async (incubatorId) => {
    const data = await getStartupsByIncubatorId(incubatorId)
    const mentorsAssociated = data.map(dt => dt.mentorsAssociated).filter(mentor => mentor.length > 0).flat()
    return mentorsAssociated
}

/**
 * @param  {} status
 */
export const getAllStartups = async (incubatorId) => {
    const data = [];
    const documents = await startupsRef.where('incubatorId', '==', incubatorId).where('isDeleted', '==', false).get();
    documents.forEach(document => {
        data.push(document.data());
    })
    return data
}

export const getStartupsByStatus = async (status, incubatorId) => {
    const data = await getStartupsByIncubatorId(incubatorId)
    const startups = data.map(dt => dt.name)
    return startups
}
