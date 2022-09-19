import { activityRef } from '../config/firebase_services';
import moment from "moment";

/**
 * @param  {} data
 */
export const addToActivity = async (data) => {
    await activityRef.add(data);
}
/**
 * @param  {} role
 * @param  {} incubatorId
 * @param  {} startupId=""
 */
export const getActivities = async (role, incubatorId, startupId = "") => {
    let notifications = []
    if (role === 'incubator') {
        activityRef
            .where(
                "incubatorId",
                "==",
                incubatorId
            )
            .where("notification", "==", true)
            .where("read", "==", false)
            .orderBy("createdAt", "desc")
            .onSnapshot((snapshot) => {
                notifications = [];
                snapshot.forEach((document) => {
                    const dt = document.data();
                    dt.docId = document.id;
                    dt.createdAt = moment(dt.createdAt.toDate()).fromNow();
                    notifications.push(dt);
                });
                return notifications
            });
    }

    if (role === 'startup') {
        activityRef
            .where(
                "startupId",
                "==",
                startupId
            )
            .where("notification", "==", true)
            .where("read", "==", false)
            .where('onlyStartup', '==', true)
            .orderBy("createdAt", "desc")
            .onSnapshot((snapshot) => {
                notifications = [];
                snapshot.forEach((document) => {
                    const dt = document.data();
                    dt.docId = document.id;
                    dt.createdAt = moment(dt.createdAt.toDate()).fromNow();
                    notifications.push(dt);
                });
                return notifications
            });
    }
}