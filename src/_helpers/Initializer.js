import { incubatorsRef, mentorsRef, startupsRef, membersRef } from '../config/firebase_services'
import store from '../store';
/**
 * @param  {} data
 */
const initializeIncubator = (data) => {
    return new Promise((resolve) => {
        setTimeout(async () => {
            try {
                const document = await incubatorsRef.doc(data.userId).get();
                const currentUser = document.data();
                currentUser.role = data.role;
                await store.dispatch("SHOW_CURRENT_USER", currentUser);
                resolve(currentUser);
            } catch (error) {
                resolve(error);
            }
        }, 500)
    })
}
/**
 * @param  {} data
 */
const initializeMentor = (data) => {
    return new Promise((resolve) => {
        setTimeout(async () => {
            try {
                const document = await mentorsRef.doc(data.userId).get();
                const currentUser = document.data();
                currentUser.role = data.role;
                store.dispatch("SHOW_CURRENT_USER", currentUser);
                resolve(currentUser);
            } catch (error) {
                resolve(error);
            }
        }, 500)
    })
}
/**
 * @param  {} data
 */
const initializeStartup = (data) => {
    return new Promise((resolve) => {
        setTimeout(async () => {
            try {
                const document = await startupsRef.doc(data.userId).get();
                const currentUser = document.data();
                currentUser.role = data.role;
                store.dispatch("SHOW_CURRENT_USER", currentUser);
                resolve(currentUser);
            } catch (error) {
                resolve(error);
            }
        }, 500)
    })
}
/**
 * @param  {} data
 */
const initializeMember = (data) => {
    return new Promise((resolve) => {
        setTimeout(async () => {
            try {
                const document = await membersRef.doc(data.userId).get();
                const currentUser = document.data();
                currentUser.role = data.role;
                store.dispatch("SHOW_CURRENT_USER", currentUser);
                resolve(currentUser);
            } catch (error) {
                resolve(error);
            }
        }, 500)
    })
}
/**
 * @param  {} incubatorId
 */
const setCurrentIncubator = (incubatorId) => {
    return new Promise((resolve) => {
        setTimeout(async () => {
            try {
                const document = await incubatorsRef.doc(incubatorId).get();
                store.dispatch("SET_INCUBATOR", document.data());
                resolve(document.data())
            } catch (error) {
                resolve(error);
            }
        }, 500)
    })
}

export { initializeIncubator, initializeMentor, initializeStartup, initializeMember, setCurrentIncubator }
