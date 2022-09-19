import { startupsRef } from "../../../config/firebase_services";
import store from "../../../store";


export const getTop10FundedStartups = async () => {
    const incubatorId = store.state.incubator.currentIncubator.docId;

    const documents = await startupsRef.where('incubatorId', '==', incubatorId).where("isDeleted", "==", false).get();

    let startups = []
    documents.forEach(document => {
        startups.push(document.data());
    })

    let fundedStartups = {};
    startups.forEach((startup) => {
        fundedStartups[startup.name] = startup.funding
    })

    Object.keys(fundedStartups).forEach(key => fundedStartups[key] === undefined ? delete fundedStartups[key] : {});

    let fundingReceived = {}
    Object.keys(fundedStartups).forEach(key => {
        fundingReceived[key] = +fundedStartups[key].received.toString().replace(/,/g, '')
        fundingReceived[key] += getExternalFunding(key, startups)
    })

    let sortedFunding = Object.keys(fundingReceived).sort((a, b) => {
        return parseFloat(fundingReceived[b]) - parseFloat(fundingReceived[a])
    }).slice(0, 10);

    const top10Funded = {}
    sortedFunding.forEach(startup => {
        top10Funded[startup] = fundingReceived[startup]
    })

    return top10Funded
}

function getExternalFunding(name, startups) {
    const startup = startups.find(startup => startup.name === name);
    const awards = startup.awards;
    let total = 0
    if (awards.length > 0) {
        let amounts = []
        amounts = awards.map((award) => award.money)
        amounts.forEach(amt => {
            if (amt !== "" && amt !== null) {
                total += +amt.replace(/[^0-9]/g, "")
            }
        })
    }
    return total
}