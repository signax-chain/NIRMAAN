export default {
    state: {
        currentUser: null,
    },
    mutations: {
        SET_CURRENT_USER(state, payload) {
            state.currentUser = payload
        },
    },
    actions: {
        SHOW_CURRENT_USER({ commit }, payload) {
            commit("SET_CURRENT_USER", payload)
          },
    }
}