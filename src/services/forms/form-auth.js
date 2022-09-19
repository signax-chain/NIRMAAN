import { auth } from '../../config/firebase_services'

export class FormAuth {
    projectId = '1097114383627';
    constructor() { }

    async getCredentials() {
        const userToken = await auth.currentUser.getIdToken();
        return { userToken, projectId: this.projectId };
    }

    login() {

    }
}