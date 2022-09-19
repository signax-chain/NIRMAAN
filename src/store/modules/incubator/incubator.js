export default {
    state: {
        currentIncubator: null,
    },

    mutations: {
        UPDATE_INCUBATOR(state, payload) {
            state.currentIncubator = payload
        }
    },

    actions: {
        SET_INCUBATOR({ commit }, payload) {
            commit('UPDATE_INCUBATOR', payload)
        }
    }
}
