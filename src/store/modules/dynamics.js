export default {
    state: {
        cohortnames: [],
        programs: [],
        sectors: [],
    },
    mutations: {
        /**
         * @param  {} state
         * @param  {} payload
         */
        updateCohortNames(state, payload) {
            state.cohortnames = payload
        },
        /**
         * @param  {} state
         * @param  {} payload
         */
        updatePrograms(state, payload) {
            state.programs = payload
        },
        updateSectors(state, payload) {
            state.sectors = payload
        }
    },
    actions: {
        /**
         * @param  {} {commit}
         * @param  {} payload
         */
        setCohortNames({ commit }, payload) {
            commit('updateCohortNames', payload)
        },
        /**
         * @param  {} {commit}
         * @param  {} payload
         */
        setPrograms({ commit }, payload) {
            commit('updatePrograms', payload)
        },
        setSectors({ commit }, payload) {
            commit('updateSectors', payload)
        }
    }
}