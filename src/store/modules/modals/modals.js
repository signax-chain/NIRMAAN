export default {
  state: {
    raiseRequestModal: { isShowing: false },
    StartupEditModal: { isShowing: false, basicDetails: "" },
    mentorProfileModal: { isShowing: false, data: "" },
    downloadTemplateModal: { isShowing: false },
    uploadTemplateModal: { isShowing: false },
    mentorEditModal: { isShowing: false, basicDetails: "" },
    startupProgressUpdateModal: { isShowing: false, data: "" },
    mentorProgressUpdateModal: { isShowing: false, data: "" },
    shareEventModal: { isShowing: false, data: "" },
    responseEventModal: { isShowing: false, data: "" },
    feedbackEventModal: { isShowing: false, data: "" },
    newspeakerModal: { isShowing: false, data: "" },
    incubatorProfileModal: { isShowing: false, data: "" },
  },

  mutations: {
    SET_RAISE_REQUEST(state, payload) {
      state.raiseRequestModal = payload;
    },
    SET_STARTUP_EDIT(state, payload) {
      state.StartupEditModal = payload;
    },
    SET_MENTOR_PROFILE(state, payload) {
      state.mentorProfileModal = payload;
    },
    SET_DOWNLOAD_TEMPLATE(state, payload) {
      state.downloadTemplateModal = payload;
    },
    SET_UPLOAD_TEMPLATE(state, payload) {
      state.uploadTemplateModal = payload;
    },
    SET_MENTOR_EDIT(state, payload) {
      state.mentorEditModal = payload;
    },
    SET_STARTUP_PROGRESS_UPDATE(state, payload) {
      state.startupProgressUpdateModal = payload;
    },
    SET_MENTOR_PROGRESS_UPDATE(state, payload) {
      state.mentorProgressUpdateModal = payload;
    },
    SET_SHARE_EVENT(state, payload) {
      state.shareEventModal = payload;
    },
    SET_RESPONSE_EVENT(state, payload) {
      state.responseEventModal = payload;
    },
    SET_FEEDBACK_EVENT(state, payload) {
      state.feedbackEventModal = payload;
    },
    SET_NEW_SPEAKER(state, payload) {
      state.newspeakerModal = payload;
    },
    SET_INCUBATOR_PROFILE(state, payload) {
      state.incubatorProfileModal = payload;
    },
  },

  actions: {
    SHOW_RAISE_REQUEST({ commit }, payload) {
      commit("SET_RAISE_REQUEST", payload);
    },
    SHOW_STARTUP_EDIT({ commit }, payload) {
      commit("SET_STARTUP_EDIT", payload);
    },
    SHOW_MENTOR_PROFILE({ commit }, payload) {
      commit("SET_MENTOR_PROFILE", payload);
    },
    SHOW_DOWNLOAD_TEMPLATE({ commit }, payload) {
      commit("SET_DOWNLOAD_TEMPLATE", payload);
    },
    SHOW_UPLOAD_TEMPLATE({ commit }, payload) {
      commit("SET_UPLOAD_TEMPLATE", payload);
    },
    SHOW_MENTOR_EDIT({ commit }, payload) {
      commit("SET_MENTOR_EDIT", payload);
    },
    SHOW_STARTUP_PROGRESS_UPDATE({ commit }, payload) {
      commit("SET_STARTUP_PROGRESS_UPDATE", payload);
    },
    SHOW_MENTOR_PROGRESS_UPDATE({ commit }, payload) {
      commit("SET_MENTOR_PROGRESS_UPDATE", payload);
    },
    SHOW_SHARE_EVENT({ commit }, payload) {
      commit("SET_SHARE_EVENT", payload);
    },
    SHOW_RESPONSE_EVENT({ commit }, payload) {
      commit("SET_RESPONSE_EVENT", payload);
    },
    SHOW_FEEDBACK_EVENT({ commit }, payload) {
      commit("SET_FEEDBACK_EVENT", payload);
    },
    SHOW_NEW_SPEAKER({ commit }, payload) {
      commit("SET_NEW_SPEAKER", payload);
    },
    SHOW_INCUBATOR_PROFILE({ commit }, payload) {
      commit("SET_INCUBATOR_PROFILE", payload);
    },
  },
};
