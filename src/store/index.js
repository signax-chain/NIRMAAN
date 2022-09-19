import Vue from 'vue'
import Vuex from 'vuex'
import modals from "./modules/modals/modals";
import dialogs from './modules/dialogs/dialogs';
import user from './modules/users/user';
import incubator from './modules/incubator/incubator'
import navigation from './modules/navigation';
import dynamics from './modules/dynamics'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    modals,
    dialogs,
    user,
    incubator,
    navigation,
    dynamics
  }
})
