import { activityRef } from "../config/firebase_services";
import store from "../store";

export default {
  methods: {
    async updateActivity(statement) {
      if (store.state.user.currentUser.role === "startup") {
        const activity = {
          createdAt: new Date(),
          incubatorId: store.state.incubator.currentIncubator.docId,
          notification: false,
          photoURL: store.state.user.currentUser.photoURL,
          startupId: store.state.user.currentUser.docId,
          statement: `${store.state.user.currentUser.name} ${statement}`,
          from: "startup",
          to: "incubator",
          isActivityLog: true,
        };
        await activityRef.add(activity);
      }
    },
  },
};
