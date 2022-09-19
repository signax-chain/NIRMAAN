import { mentorshipRef } from "../../../config/firebase_services"
import store from "../../../store"

export const getAverageSessionsPerMonth = async () => {
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
        return { [mentorship.date]: mentorship.mentorHours }
    })

    let filteredMentoringHours = {}
    let res = {}
    mentoringHours.forEach(mentoringHours => {
        filteredMentoringHours = { ...filteredMentoringHours, ...mentoringHours }
    })

    
    Object.keys(filteredMentoringHours).forEach(key => {
        key === "null" ? delete filteredMentoringHours[key] : {}
    })
    
    res.sessions = Object.keys(filteredMentoringHours).length
    
    const monthYearMap = {}
    Object.keys(filteredMentoringHours).forEach(function (x) {
        const date = new Date(x)
        const key = date.toLocaleString('default', { month: 'short' }) + ' ' + x.split("-")[0]
        if (Object.keys(monthYearMap).includes(key)) {
            monthYearMap[key] +=  1
        }
        else
            monthYearMap[key] = 1
    });

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const keys = Object.keys(monthYearMap)

    keys.sort((a, b) => {
        a = a.split(" ");
        b = b.split(" ");
        if (a[1] !== b[1]) {
            return a[1] - b[1];
        } else {
            return months.indexOf(a[0]) - months.indexOf(b[0]);
        }
    })

    const result = {}

    keys.forEach(key => {
        result[key] = monthYearMap[key]
    })

    res.months = Object.keys(result).length
    res.avg = Math.round(res.sessions / res.months)

    return res
}