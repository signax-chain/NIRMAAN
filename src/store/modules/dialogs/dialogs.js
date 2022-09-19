export default {
    state: {
        snackbar: {},
        loader: {}
    },
    mutations: {
        SET_SNACKBAR(state, payload) {
            state.snackbar = payload
        },
        SET_LOADER(state, payload) {
            state.loader = payload
        },
    },
    actions: {
        SHOW_SNACKBAR({ commit }, payload) {
            commit("SET_SNACKBAR", payload)
          },
          SHOW_LOADER({ commit }, payload) {
            commit("SET_LOADER", payload)
          },
    }
}