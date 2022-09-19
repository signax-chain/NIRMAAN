import axios from 'axios'
import { credentialsRef } from '../../config/firebase_services';
import { FormAuth } from './form-auth';
import store from '../../store'

class Form extends FormAuth {
    API_URL = 'https://form-builder-api.herokuapp.com'
    // API_URL = 'http://localhost:3000'

    constructor() {
        super();
    }

    async validateUser() {
        try {
            let response = await super.getCredentials();
            response = await axios.get(`${this.API_URL}/platform-validate/${response.projectId}`, {
                headers: {
                    'Authorization': `${response.userToken}`
                }
            })
            return response.data
        } catch (error) {
            console.log(error);
        }
    }

    async authenticateUser() {
        try {
            const currentIncubator = store.state.incubator.currentIncubator;
            const documents = await credentialsRef.doc(currentIncubator.docId).collection('forms').get()
            let creds = {}
            documents.forEach(doc => {
                const data = doc.data()
                creds.email = currentIncubator.email
                creds.password = data.password
            })
            return creds
        } catch (error) {
            console.log(error);
        }
    }   
    /**
     * @param  {} formId
     * @param  {} ...creds
     */
    redirectToForm(formId, creds) {
        setTimeout(() => {
            window.open(`https://forms-430d4.web.app/form/${formId}/edit?is_platform=${true}&&email=${creds.email}&&password=${creds.password}`, '_blank');
            // window.open(`http://localhost:8081/form/${formId}/edit?is_platform=${true}&&email=${creds.email}&&password=${creds.password}`, '_blank');
        }, 1000)
    }
    /**
     * @param  {} data
     */
    async create(data) {
        try {
            const userId = await this.validateUser();
            data.isPlatform = true
            data.userId = userId

            const response = await axios.post(`${this.API_URL}/form`, data)
            const creds = await this.authenticateUser()
            
            this.redirectToForm(response.data._id, creds.email, creds.password)
        } catch (error) {
            console.log(error);
        }
    }

    async findByUserId() {
        try {
            const userId = await this.validateUser();
            const response = await axios.get(`${this.API_URL}/form/user/${userId}`)
            return response.data
        } catch (error) {
            console.log(error);
        }
    }

    async _delete(formId) {
        try {
            const userId = await this.validateUser();
            const response = await axios.delete(`${this.API_URL}/form/${formId}`, {
                headers: {
                    'Authorization': `${userId}`
                }
            })
            return response.data
        } catch (error) {
            console.log(error);
        }
    }
}

export const formObj = new Form()