import { startupsRef } from '../config/firebase_services'
import { getStartupById } from './Startups'
/**
 * @param  {} incubatorId
 */
const getFundingInfo = async (incubatorId, year) => {
    const data = []
    let documents = []
    if (year === 'all') documents = await startupsRef.where('incubatorId', '==', incubatorId).get()
    else documents = await startupsRef.where('incubatorId', '==', incubatorId).where('cohort.year', '==', year).get()
    documents.forEach(document => {
        let docData = document.data()
        if (docData.funding !== undefined)
            data.push(docData.funding)
    })
    return data
}
/**
 * @param  {} incubatorId
 */
const getAwardsInfo = async (incubatorId, year) => {
    const data = []
    let documents = []
    if (year === 'all') documents = await startupsRef.where('incubatorId', '==', incubatorId).get()
    else documents = await startupsRef.where('incubatorId', '==', incubatorId).where('cohort.year', '==', year).get()
    documents.forEach(document => {
        let docData = document.data()
        if (docData.awards !== undefined)
            data.push(docData.awards)
    })
    return data
}
/**
 * @param  {} incubatorId
 */
export const fundingRecieved = async (incubatorId, year) => {
    const fundings = await getFundingInfo(incubatorId, year)
    if (fundings.length === 0) return 0
    let total = 0
    let amounts = fundings.map((funding) => funding.received)
    amounts.forEach(amt => {
        if (amt !== "" && amt !== null) {
            total += parseFloat(amt.toString().replace(',', ""))
        }
    })
    return total
}
/**
 * @param  {} incubatorId
 */
export const fundingUtilized = async (incubatorId, year) => {
    const fundings = await getFundingInfo(incubatorId, year)
    if (fundings.length === 0) return 0
    let total = 0
    let amounts = fundings.map((funding) => funding.utilized)
    amounts.forEach(amt => {
        if (amt !== "" && amt !== null) {
            total += parseFloat(amt.toString().replace(',', ""))
        }
    })
    return total
}
/**
 * @param  {} incubatorId
 */
export const externalFunding = async (incubatorId, year) => {
    let gTotal = 0;
    const fundings = await getAwardsInfo(incubatorId, year)
    for (let awards of fundings) {
        if (awards.length !== 0) {
            let amounts = []
            let total = 0
            amounts = awards.map((award) => award.money)
            amounts.forEach(amt => {
                if (amt !== "" && amt !== null) {
                    total += +amt.replace(/[^0-9]/g, "")
                }
            })
            gTotal += total
        }
    }
    return gTotal
}

function calculateAwardsMoney(awards) {
    let total = 0
    let amounts = awards.map((award) => award.money)
    amounts.forEach(amt => {
        if (amt !== "" && amt !== null) {
            total += +amt.replace(/[^0-9]/g, "")
        }
    })
    return total
}

export const getExternalFundingByStartup = async (startupId) => {
    let externalFunding = 0;
    const startup = await getStartupById(startupId)
    const awardsMoney = calculateAwardsMoney(startup.awards);

    externalFunding += awardsMoney

    return externalFunding
}