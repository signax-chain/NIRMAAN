import firebase from 'firebase';
import store from '../store/'
/**
 * @param  {} data
 */
const add = (data) => {
    firebase.auth().createUserWithEmailAndPassword(data.email, "thestartupreneur").then(async user => {
        const docId = user.user.uid;
        await firebase.firestore().collection('startups').doc(docId).set(data);
    }).catch(error => {
        store.dispatch('SHOW_SNACKBAR', {
            showing: true,
            text: error.message,
            color: "error",
        })
    })
}

module.exports = add
