import axios from 'axios';
import { auth } from '../config/firebase_services'
import store from '../store'

const BASE_URL = 'https://webrtc-api-v2.herokuapp.com/api'
// const BASE_URL = 'http://localhost:5000/api'
const projectId = '1097114383627'

class Meeting {
    constructor() {
    }

    async validate() {
        const idToken = await auth.currentUser.getIdToken()
        const response = await axios.post(`${BASE_URL}/platform-validate`, {
            projectId: projectId,
            institution: store.state.incubator.currentIncubator.name,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${idToken}`,
            },
        })
        return response.data
    }

    login(email) {
        console.log(email);
    }

    register() {

    }
    /**
     * @param  {} data
     */
    async create(data) {
        const authToken = localStorage.getItem('sc-auth-token')
        console.log(authToken);
        if (!authToken) return "Authentication failed! try again later."
        const response = await axios.post(`${BASE_URL}/meeting`, data, {
            headers: {
                'Content-Type': 'application/json',
                'sc-auth-token': `${authToken}`,
            },
        })
        return response.data
    }
}

export const meeting = new Meeting();