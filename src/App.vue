<template>
  <v-app @dragover="dragOver" @drop="drop">
    <SideBar v-if="currentUser !== null && typeof currentUser === 'object'" />
    <v-main>
      <v-container class="py-0 fill-height" fluid>
        <v-row class="fill-height">
          <v-col>
            <transition name="fade" mode="out-in">
              <router-view :key="$route.fullPath"></router-view>
            </transition>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <SnackBar />
    <Loader />
    <!-- <v-snackbar bottom right :value="updateExists" :timeout="-1" dark>
      An update is available
      <v-btn text @click="refreshApp" color="traktor"> Update </v-btn>
    </v-snackbar> -->
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import SideBar from "@/components/Layouts/SideBar.vue";
import Loader from "@/components/Dialogs/Loader.vue";
import SnackBar from "@/components/Dialogs/SnackBar";

import {
  auth,
  incubatorsRef,
  mentorsRef,
  startupsRef,
  membersRef,
  usersRef,
} from "./config/firebase_services";
import {
  initializeSuperIncubatorNavigation,
  initializeIncubatorNavigation,
  initializeMemberNavigation,
  initializeMentorNavigation,
  initializeStartupNavigation,
  initializeAccountantNavigation,
} from "./_helpers/NavigationInitializer";

import {
  getCohortNames,
  getGlobalSectors,
  getPrograms,
} from "./services/dynamics";

export default {
  name: "App",
  components: {
    SideBar,
    Loader,
    SnackBar,
  },
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  async created() {
    this.$store.dispatch("SHOW_LOADER", { isShowing: true });
    auth.onAuthStateChanged((user) => {
      if (user) {
        let currentUser = {};
        auth.currentUser.getIdTokenResult().then(async (idResultToken) => {
          const roles = idResultToken.claims.roles;
          currentUser.role = Object.keys(roles).find(
            (key) => roles[key] === true
          );

          if (currentUser.role === "sIncubator") {
            const document = await incubatorsRef.doc(user.uid).get();
            currentUser = document.data();
            currentUser.role = "sIncubator";
            initializeSuperIncubatorNavigation();
            this.$store.dispatch("SET_INCUBATOR", currentUser);
            this.$store.dispatch("SHOW_CURRENT_USER", currentUser);
          }

          if (currentUser.role === "incubator") {
            const document = await incubatorsRef.doc(user.uid).get();
            currentUser = document.data();
            currentUser.role = "incubator";
            initializeIncubatorNavigation();
            this.$store.dispatch("SET_INCUBATOR", currentUser);
            this.$store.dispatch("SHOW_CURRENT_USER", currentUser);
            await getCohortNames(currentUser.docId);
            await getPrograms(currentUser.docId);
            await getGlobalSectors(currentUser.docId);
          }

          if (currentUser.role === "mentor") {
            let document = await mentorsRef.doc(user.uid).get();
            currentUser = document.data();
            currentUser.role = "mentor";
            document = await incubatorsRef.doc(currentUser.incubatorId).get();
            initializeMentorNavigation();
            this.$store.dispatch("SET_INCUBATOR", document.data());
            this.$store.dispatch("SHOW_CURRENT_USER", currentUser);
            await getCohortNames(currentUser.incubatorId);
            await getPrograms(currentUser.incubatorId);
            await getGlobalSectors(currentUser.incubatorId);
          }

          if (currentUser.role === "startup") {
            let document = await startupsRef.doc(user.uid).get();
            currentUser = document.data();
            currentUser.role = "startup";
            document = await incubatorsRef.doc(currentUser.incubatorId).get();
            initializeStartupNavigation();
            this.$store.dispatch("SET_INCUBATOR", document.data());
            this.$store.dispatch("SHOW_CURRENT_USER", currentUser);
            await getCohortNames(currentUser.incubatorId);
            await getPrograms(currentUser.incubatorId);
            await getGlobalSectors(currentUser.incubatorId);
          }

          if (currentUser.role === "member") {
            let document = await membersRef.doc(user.uid).get();
            currentUser = document.data();
            currentUser.role = "member";
            document = await incubatorsRef.doc(currentUser.incubatorId).get();
            initializeMemberNavigation();
            this.$store.dispatch("SET_INCUBATOR", document.data());
            this.$store.dispatch("SHOW_CURRENT_USER", currentUser);
            await getCohortNames(currentUser.incubatorId);
            await getPrograms(currentUser.incubatorId);
            await getGlobalSectors(currentUser.incubatorId);
          }

          if (currentUser.role === "accountant") {
            let document = await usersRef.doc(user.uid).get();
            currentUser = document.data();
            currentUser.role = "accountant";
            document = await incubatorsRef.doc(currentUser.incubatorId).get();
            initializeAccountantNavigation();
            this.$store.dispatch("SET_INCUBATOR", document.data());
            this.$store.dispatch("SHOW_CURRENT_USER", currentUser);
          }

          if (currentUser.role === undefined) {
            await auth.signOut();
            this.$store.dispatch("SHOW_CURRENT_USER", null);
          }

          // if (
          //   this.$route.name !== "AddNewStartup" ||
          //   this.$route.name !== "EventRegister" ||
          //   this.$route.name !== "EventFeedback" ||
          //   this.$route.name !== "UpdateMentorAvailability" ||
          //   this.$route.name !== "UpdateStartupAvailability" ||
          //   this.$route.name !== "Feedback" ||
          //   this.$route.name !== "InReport"
          // )
          if (this.$route.path === "/") this.$router.push("/dashboard");
        });
      }
    });
    this.$store.dispatch("SHOW_LOADER", { isShowing: false });
  },
  methods: {
    dragover(event) {
      event.preventDefault();
      return;
    },
    drop(event) {
      var offset = event.dataTransfer.getData("Text").split(",");
      var dm = document.getElementById(offset[2]);
      dm.style.left = event.clientX + parseInt(offset[0], 10) + "px";
      dm.style.top = event.clientY + parseInt(offset[1], 10) + "px";
      event.preventDefault();
      return false;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap");

#app {
  background: #f2f2f2;
  font-family: "Roboto", sans-serif;
}

html,
body,
* {
  font-family: "Poppins", sans-serif !important;
  font-feature-settings: "lnum" 1;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateX(2em);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

>>> .v-btn {
  text-transform: capitalize;
  border-radius: 3px;
}

>>> .v-btn__content {
  letter-spacing: 0;
}

>>> .v-btn--is-elevated {
  box-shadow: none;
}

::-webkit-scrollbar {
  width: 6px;
}

::selection {
  color: #3aa959;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 1);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 1);
}

>>> .swal2-popup {
  font-family: "Poppins", sans-serif !important;
}
</style>
