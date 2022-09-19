import { dynamicsRef, startupsRef } from "../config/firebase_services"
import store from "../store"

/**
 * @param  {} incubatorId
 */
const getCohortNamesAndDocId = async (incubatorId) => {
    let cohortData = { docId: "", cohortNames: [] }

    const documents = await dynamicsRef.doc(incubatorId).collection('cohortnames').get()
    documents.forEach(document => {
        if (document.exists) {
            cohortData.cohortNames = document.data()['cohortname']
            cohortData.docId = document.id;
        }
    })
    return cohortData
}
/**
 * @param  {} incubatorId
 */
export const getCohortNames = async (incubatorId) => {
    let cohortData = await getCohortNamesAndDocId(incubatorId)
    store.dispatch('setCohortNames', cohortData.cohortNames)
}
/**
 * @param  {} incubatorId
 * @param  {} cohortNames
 */
export const setCohortNames = async (incubatorId, cohortNames) => {
    let cohortData = await getCohortNamesAndDocId(incubatorId)
    await dynamicsRef.doc(incubatorId).collection('cohortnames').doc(cohortData.docId).set({ cohortname: cohortNames }, { merge: true })
}

export const getGlobalSectors = async (incubatorId) => {
    let sectors = ""
    const documents = await dynamicsRef.doc(incubatorId).collection('sectors').get()
    documents.forEach(document => {
        if (document.exists) {
            sectors = document.data()['sectors']
        }
    })
    // sectors = sectors.split(',')
    // sectors.push('Add new +')
    store.dispatch('setSectors', sectors)
}

/**
 * @param  {} incubatorId
 */
const getProgramsAndDocId = async (incubatorId) => {
    let data = { docId: "", programs: [] }

    const documents = await dynamicsRef.doc(incubatorId).collection('programs').get()
    documents.forEach(document => {
        if (document.exists) {
            data.programs = document.data()['programs']
            data.docId = document.id;
        }
    })
    return data
}
/**
 * @param  {} incubatorId
 */
export const getPrograms = async (incubatorId) => {
    let data = await getProgramsAndDocId(incubatorId)
    store.dispatch('setPrograms', data.programs)
}
/**
 * @param  {} incubatorId
 * @param  {} programs
 */
export const setPrograms = async (incubatorId, programs) => {
    let data = await getProgramsAndDocId(incubatorId)
    await dynamicsRef.doc(incubatorId).collection('programs').doc(data.docId).set({ programs: programs }, { merge: true })
}
/**
 * @param  {} incubatorId
 */
export const getCohortYears = async (incubatorId) => {
    let data = await getStartupsDataByIncubatorId(incubatorId);
    let cohortYears = data.map(dt => dt.cohort.year)
    return cohortYears
}
/**
 * @param  {} incubatorId
 */
export const getStartupsDataByIncubatorId = async (incubatorId) => {
    const data = [];
    const documents = await startupsRef.where('incubatorId', '==', incubatorId).orderBy('createdAt', 'desc').get();
    documents.forEach(document => {
        data.push(document.data());
    })
    return data
}
/**
 * @param  {} incubatorId
 */
export const getSectors = async (incubatorId) => {
    const data = await getStartupsDataByIncubatorId(incubatorId)
    const sectors = [...new Set(data.map(dt => dt.sector))].filter(sector => sector !== null)
    return sectors
}
/**
 * @param  {} incubatorId
 */
export const getStages = async (incubatorId) => {
    const data = await getStartupsDataByIncubatorId(incubatorId)
    const stages = [...new Set(data.map(dt => dt.progress?.currentStage))].filter(stage => stage !== undefined)
    return stages
}