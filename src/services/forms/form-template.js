import axios from 'axios'

const API_BASE_URL = 'https://form-builder-api.herokuapp.com'

class FormTemplate {
    constructor() {}

    async findAll() {
        try {
            const response = await axios.get(`${API_BASE_URL}/template`)
            return response.data
        } catch (error) {
            console.log(error);
        }
    }
}

export const formTemplate = new FormTemplate();