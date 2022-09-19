import { auth } from "../../config/firebase_services";
import firebase from "firebase";
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const signUpWithGoogle = async () => {
    try {
        return await auth.signInWithPopup(googleAuthProvider);
    } catch (error) {
        console.log(error);
    }
}

export const getLinkedInURI = () => {
    const CLIENT_ID = '86h9h40h4pvsgp';
    // const CLIENT_SECRET = 'hNq2eiRVOmPdIgCO'
    const REDIRECT_URI = 'http://localhost:8080/auth/linkedin/callback';
    const state = 'some-state-of-my-choice';
    // const scope = 'r_liteprofile%20r_emailaddress';
    const REQUEST_URL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${state}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
    return REQUEST_URL
}    