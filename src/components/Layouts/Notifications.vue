<template>
  <div>
    <v-menu bottom left>
      <template v-slot:activator="{ on, attrs }">
        <v-badge
          color="red"
          :content="notifications.length.toString()"
          class="mr-5"
          v-if="currentUser.role === 'incubator'"
          ><v-icon size="28" color="white" v-bind="attrs" v-on="on"
            >mdi-bell</v-icon
          >
        </v-badge>
      </template>

      <v-list subheader two-line>
        <v-list-item
          v-for="(notification, index) in notifications"
          :key="index"
        >
          <v-list-item-avatar>
            <v-img :src="notification.photoURL"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title
              v-text="notification.statement"
            ></v-list-item-title>

            <v-list-item-subtitle>{{
              notification.createdAt
            }}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="markAsRead(notification.docId)"
                >
                  <v-icon color="traktor" size="12">mdi-circle</v-icon>
                </v-btn>
              </template>
              <span>Mark as read</span>
            </v-tooltip>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="mr-2"
          icon
          color="white"
          @click="logout()"
          v-bind="attrs"
          v-on="on"
          ><v-icon size="28">mdi-logout-variant</v-icon></v-btn
        >
      </template>
      <span>Logout</span>
    </v-tooltip>
  </div>
</template>
<script>
import { auth, activityRef } from "../../config/firebase_services";
import moment from "moment";
import { mapState } from "vuex";

export default {
  name: "Notifications",
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
  },
  data() {
    return {
      notifications: [],
    };
  },
  async created() {
    await activityRef
      .where(
        "incubatorId",
        "==",
        this.$store.state.incubator.currentIncubator.docId
      )
      .where("notification", "==", true)
      .where("read", "==", false)
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        this.notifications = [];
        snapshot.forEach((document) => {
          const dt = document.data();
          dt.docId = document.id;
          dt.createdAt = moment(dt.createdAt.toDate()).fromNow();
          this.notifications.push(dt);
        });
      });
  },
  methods: {
    logout() {
      this.$store.dispatch("SHOW_LOADER", { isShowing: true });
      try {
        auth.signOut();
        this.$store.dispatch("SHOW_CURRENT_USER", null);
        this.$router.push("/");
        this.$store.dispatch("SHOW_LOADER", { isShowing: false });
      } catch (e) {
        this.$store.dispatch("SHOW_LOADER", { isShowing: false });
        this.$toast.error(e, {
          position: "top",
        });
      }
    },
    markAsRead(docId) {
      activityRef.doc(docId).set({ read: true }, { merge: true });
    },
  },
};
</script>