export default {
    state: {
        currentNavigation: null
    },

    mutations: {
        UPDATE_NAVIGATION(state, payload) {
            state.currentNavigation = payload
        }
    },

    actions: {
        SET_NAVIGATION({ commit }, payload) {
            commit('UPDATE_NAVIGATION', payload)
        }
    }
}
