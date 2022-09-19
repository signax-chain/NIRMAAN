<template>
  <div>
    <v-app-bar app elevation="1" color="white">
      <img
        :src="currentIncubator.photoURL"
        :width="isMobileScreen() ? 200 : 250"
        border="0"
        v-if="isMobileScreen()"
        :class="isMobileScreen() ? 'mobileImg' : ''"
      />
      <router-link to="/dashboard" v-if="!isMobileScreen()">
        <img
          src="../../assets/images/traktor.svg"
          alt="Traktor"
          style="display: block"
          v-show="toggleMini"
      /></router-link>
      <v-spacer v-if="!isMobileScreen()"></v-spacer>

      <v-tabs
        color="traktor"
        v-if="currentUser.role === 'incubator' && $route.path === '/dashboard'"
      >
        <v-tab @click="switchTab('overview')">Overview</v-tab>
        <v-tab @click="switchTab('startup')">Startups</v-tab>
        <v-tab @click="switchTab('mentors')">Mentors</v-tab>
        <v-tab @click="switchTab('funding')">Funding</v-tab>
        <!-- <v-tab @click="switchTab('events')">Events</v-tab> -->
      </v-tabs>
      <v-tabs
        color="traktor"
        v-if="currentUser.role === 'sIncubator' && $route.path === '/dashboard'"
      >
        <v-tab @click="switchTab('overview')">Overview</v-tab>
        <v-tab @click="switchTab('incubator')">Incubators</v-tab>
        <v-tab @click="switchTab('regions')">Regions</v-tab>
        <v-tab @click="switchTab('funding')">Funding</v-tab>
      </v-tabs>
      <div
        class="appbar-actions"
        :style="
          currentUser.role === 'incubator' ||
          (currentUser.role === 'sIncubator' && $route.path === '/dashboard')
            ? 'width: 120%;'
            : currentUser.role === 'accountant'
            ? 'width: 5%'
            : 'width: 60%'
        "
      >
        <v-menu offset-y bottom right>
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              dense
              placeholder="Search"
              prepend-inner-icon="mdi-magnify"
              outlined
              class="mt-6 mr-5"
              @click="searchDialog = true"
              v-bind="attrs"
              v-on="on"
              v-if="!isMobileScreen()"
              v-show="currentUser.role !== 'accountant'"
              @keyup="globalSearch"
              clearable
            ></v-text-field>
          </template>
          <search-palette
            :visible="searchDialog"
            :searchResult="searchResult"
            @close="searchDialog = false"
          ></search-palette>
        </v-menu>
        <v-badge color="error" offset-x="30" offset-y="20" content="0">
          <v-btn icon color="traktor" class="mr-5" @click="chatDialog = true">
            <v-icon size="36">mdi-chat-processing</v-icon>
          </v-btn>
        </v-badge>
        <v-btn
          color="traktor"
          class="mr-5"
          dark
          @click="handleAction()"
          v-if="!isMobileScreen()"
          v-show="currentUser.role !== 'accountant'"
        >
          <v-icon class="mr-2">mdi-progress-question</v-icon
          >{{
            currentUser.role === "incubator" ? "Actions" : "Raise a request"
          }}</v-btn
        >
        <v-menu offset-y left>
          <template v-slot:activator="{ on, attrs }">
            <v-badge
              color="red"
              :content="notificationCount.toString()"
              class="mr-5 mbl mt-3"
              v-show="currentUser.role !== 'accountant'"
            >
              <img
                src="../../assets/images/notification.svg"
                alt="Notifications"
                class=""
                v-bind="attrs"
                v-on="on"
                @click="notificationsDialog = true"
                v-show="currentUser.role !== 'accountant'"
              />
            </v-badge>
          </template>
          <notifications
            :visible="notificationsDialog"
            @close="notificationsDialog = false"
            @updateCount="updateNotificationsCount"
          ></notifications>
        </v-menu>
        <!-- <img
          src="../../assets/images/icons/question-circle.svg"
          alt=""
          class="mr-4"
        /> -->
        <!-- <img src="../../assets/images/icons/settings.svg" alt="" class="mr-4" /> -->
        <!-- <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              class="mr-2 mbl"
              color="traktor"
              v-if="currentUser.role === 'incubator'"
              ><v-icon size="28">mdi-cog</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              @click="website()"
              v-if="$store.state.incubator.currentIncubator.isWebsite"
            >
              <v-list-item-title>Website update</v-list-item-title>
            </v-list-item>
            <v-list-item @click="templateUpload()">
              <v-list-item-title>Template upload</v-list-item-title>
            </v-list-item>
            <v-list-item @click="formTemplates()">
              <v-list-item-title>Form Templates</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu> -->
        <v-menu transition="slide-x-transition" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <img
              src="../../assets/images/app-switcher.svg"
              alt=""
              class="products mr-2"
              v-bind="attrs"
              v-on="on"
              v-if="!isMobileScreen()"
              v-show="currentUser.role !== 'accountant'"
            />
          </template>
          <products></products>
        </v-menu>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              class="mr-2 mbl"
              color="traktor"
              v-if="currentUser.role === 'incubator'"
              ><v-icon size="28">mdi-account-circle</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="profile()">
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item>
            <v-list-item @click="goto('/settings')">
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout()">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-avatar
              v-bind="attrs"
              v-on="on"
              v-if="currentUser.role !== 'incubator'"
            >
              <img :src="currentUser.photoURL" :alt="currentUser.name" />
            </v-avatar>
          </template>
          <v-list>
            <v-list-item @click="logout()">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>
    <v-navigation-drawer
      v-model="sidebarMenu"
      app
      floating
      :permanent="sidebarMenu"
      :mini-variant.sync="mini"
    >
      <vue-scroll>
        <v-list dense color="white">
          <v-list-item class="px-0">
            <v-list-item-content class="py-3">
              <v-list-item-title>
                <img
                  src="../../assets/images/traktor.svg"
                  alt="Traktor"
                  style="display: block; margin: 0 auto"
                  v-show="!toggleMini"
                />
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list v-if="currentNavigation">
          <v-list-item class="pl-0" style="border-top: 1px solid #e5e5e5">
            <v-list-item-content>
              <v-list-item-title class="text-center">
                <img
                  :src="currentIncubator.photoURL"
                  alt=""
                  width="150"
                  border="0"
                  v-if="!isMobileScreen()"
                  v-show="!toggleMini"
                />
                <img
                  :src="currentIncubator.photoURLs.institutionLogo"
                  alt=""
                  v-show="toggleMini"
                  width="50px"
                />
                <p class="incubator-name" v-show="!toggleMini">
                  <b>{{ currentIncubator.name }}</b>
                </p>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-for="item in currentNavigation"
            :key="item.title"
            link
            :to="item.href"
            :id="item.id"
            :style="`height: 44px; ${
              !toggleMini && !isMobileScreen() ? 'padding: 0 3rem;' : ''
            }`"
          >
            <v-list-item-icon
              color="primary"
              class="mr-2"
              style="margin-top: 12px"
            >
              <v-tooltip right content-class="white tooltip-right">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="icon" v-bind="attrs" v-on="on">{{
                    item.icon
                  }}</v-icon>
                </template>
                <span>{{ item.title }}</span>
              </v-tooltip>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="primary--text"
                >{{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <NavigationItem v-else />
      </vue-scroll>
      <template v-slot:append>
        <div class="branding">
          <!-- <v-btn
            color="traktor"
            dark
            rounded
            class="mb-5"
            to="/raise-request"
            v-if="currentUser.role !== 'incubator' && !toggleMini"
          >
            <v-icon class="mr-2">mdi-progress-question</v-icon>
            Raise a Request</v-btn
          > -->
          <v-btn
            v-if="currentUser.role !== 'incubator' && toggleMini"
            color="traktor"
            icon
            to="/raise-request"
          >
            <v-icon size="30" class="mb-4">mdi-progress-question</v-icon>
          </v-btn>
          <h5 v-if="!toggleMini">Powered By</h5>
          <a href="https://thestartupreneur.co">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Website%2F1616421839599?alt=media&token=d1ad2575-a8df-47d8-ac5d-6ef26354cdb2"
              width="220"
              alt=""
              v-show="!toggleMini && !isMobileScreen()"
            />
            <img
              src="../../assets/images/icons/Favicon.svg"
              width="40px"
              alt=""
              v-if="toggleMini || isMobileScreen()"
            />
          </a>
          <p class="version">v.1.6.5</p>
        </div>
      </template>
      <img
        src="../../assets/images/icons/mini-variant-btn.svg"
        alt=""
        style="position: absolute; right: 0; top: 12%; cursor: pointer"
        @click="toggleMini = true"
        v-if="!toggleMini && !isMobileScreen()"
      />
      <img
        src="../../assets/images/icons/expand-sidebar-btn.svg"
        alt=""
        style="position: absolute; right: 0; top: 12%; cursor: pointer"
        @click="toggleMini = false"
        v-if="toggleMini"
      />
    </v-navigation-drawer>
    <profile />
    <create :visible="createDialog" @close="createDialog = false"></create>
    <message-widget
      :visible="chatDialog"
      @close="chatDialog = false"
    ></message-widget>
  </div>
</template>

<script>
import { auth } from "../../config/firebase_services";
import { mapState } from "vuex";
import NavigationItem from "@/components/Stateless/SkeletonLoader/NavigationItems";
import Profile from "@/components/Modals/Incubator/Profile";
import Create from "../Modals/Common/Create.vue";
import Products from "../Modals/Menus/Products.vue";
import SearchPalette from "../Modals/Menus/SearchPalette.vue";
import Notifications from "../Modals/Menus/Notifications.vue";
import { getAllStartups } from "../../services/Startups";
import { getMentorsByIncubatorId } from "../../services/Mentors";
import MessageWidget from "../Common/MessagingModule/MessageWidget.vue";

export default {
  name: "SideBar",
  components: {
    Profile,
    NavigationItem,
    Create,
    Products,
    SearchPalette,
    Notifications,
    MessageWidget,
  },
  computed: {
    mini() {
      return this.$vuetify.breakpoint.smAndDown || this.toggleMini;
    },
    currentRoute: function () {
      return this.$route.name;
    },
    ...mapState({
      currentNavigation: (state) => state.navigation.currentNavigation,
      currentIncubator: (state) => state.incubator.currentIncubator,
      currentUser: (state) => state.user.currentUser,
    }),
    sidebarMenu: function () {
      return screen.width <= 760 ? false : true;
    },
  },
  data: () => ({
    sidebarMenu: true,
    createDialog: false,
    toggleMini: false,
    searchDialog: false,
    notificationsDialog: false,
    notificationCount: 0,
    searchResult: {
      startups: [],
      mentors: [],
    },
    startups: [],
    mentors: [],
    chatDialog: false,
  }),
  created() {
    this.isMobile();
    this.initialize();
  },
  methods: {
    initialize() {
      const incubatorId = this.$store.state.incubator.currentIncubator.docId;
      this.getStartups(incubatorId);
      this.getMentors(incubatorId);
    },
    async getStartups(incubatorId) {
      this.startups = await getAllStartups(incubatorId);
    },
    async getMentors(incubatorId) {
      this.mentors = await getMentorsByIncubatorId(incubatorId);
    },
    globalSearch(event) {
      if (event.target.value.length >= 3) {
        this.getAllStartups(event.target.value);
        this.getAllMentors(event.target.value);
      } else {
        this.searchResult = {
          startups: [],
          mentors: [],
        };
      }
    },
    goto(path) {
      this.$router.push(path);
    },
    getAllStartups(query) {
      this.searchResult.startups = this.startups.filter((startup) => {
        return startup.name.toLowerCase().includes(query.toLowerCase());
      });
    },
    getAllMentors(query) {
      this.searchResult.mentors = this.mentors.filter((mentor) => {
        return mentor.name.toLowerCase().includes(query.toLowerCase());
      });
    },
    handleAction() {
      if (this.currentUser.role === "incubator") this.createDialog = true;
      if (this.currentUser.role === "startup")
        this.$router.push("/raise-request");
    },
    formTemplates() {
      this.$router.push("/form/templates");
    },
    website() {
      this.$router.push("/official-website");
    },
    templateUpload() {
      this.$router.push("/uploads");
    },
    back() {
      let path = null;
      const pathMap = {
        ResumeDashboard: "/startups",
        AddNewStartup: "/startups",
        AddNewMentor: "/mentors",
        MentorProfile: "/mentors",
        DEWorksheet: "/de",
        STimeline: "/startups",
        Startupship: "/startups",
        Mentorship: "/dashboard",
        Events: "/dashboard",
        Mentors: "/dashboard",
        Contacts: "/dashboard",
        Job: "/dashboard",
        Default: "/dashboard",
      };
      path = this.$route.name !== undefined ? this.$route.name : "Default";
      this.$router.push(pathMap[path]);
    },
    openNotes() {
      this.$router.push("/all-notes");
    },
    isMobile() {
      return screen.width <= 600
        ? (this.sidebarMenu = false)
        : (this.sidebarMenu = true);
    },
    isMobileScreen() {
      return screen.width <= 600 ? true : false;
    },
    async logout() {
      this.$store.dispatch("SHOW_LOADER", { isShowing: true });
      try {
        await auth.signOut();
        setTimeout(() => {
          this.$router.push(localStorage.getItem("loginRoute"));
          this.$store.dispatch("SHOW_LOADER", { isShowing: false });
          localStorage.removeItem("loginRoute");
          window.location.reload();
        }, 2000);
      } catch (e) {
        this.$store.dispatch("SHOW_LOADER", { isShowing: false });
        this.$toast.error(e, {
          position: "top",
        });
      }
    },
    profile() {
      this.$store.dispatch("SHOW_INCUBATOR_PROFILE", {
        isShowing: true,
        data: this.$store.state.incubator.currentIncubator,
      });
    },
    switchTab(tab) {
      this.$router.push({
        path: "/dashboard",
        query: {
          tab: tab,
        },
      });
    },
    updateNotificationsCount(count) {
      this.notificationCount = count;
    },
  },
};
</script>

<style scoped>
.v-application a {
  text-decoration: none;
  color: #000;
}

.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.v-application .v-list-item .primary--text {
  color: #b0b0b0 !important;
  font-size: 14px;
}

.v-application .v-list-item--active .primary--text,
.v-application .v-list-item--active {
  color: #3aa959 !important;
  font-weight: 400 !important;
}

>>> .v-navigation-drawer__content {
  overflow: hidden !important;
}

.v-application > .v-application--wrap > div > header {
  box-shadow: 0px 0px 24px rgba(229, 229, 229, 0.32) !important;
}

>>> nav > div > div > div > div > div {
  box-shadow: 0px 0px 24px rgba(229, 229, 229, 0.32) !important;
}

h3 {
  color: #4f4f4f !important;
  font-size: 24px;
  font-weight: 800 !important;
}

.v-btn {
  text-transform: none !important;
}

.icon {
  width: 30px;
}

.branding {
  text-align: center;
}

.branding > h5 {
  color: gray;
  font-size: 12px;
}

>>> .v-navigation-drawer__append {
  text-align: center !important;
}

.mobileImg {
  width: 150px;
  /* margin-left: 28px; */
}

.v-list {
  padding: 2px 0 !important;
}

.incubator-name {
  width: 240px;
  font-size: 12px;
  padding: 0 0.5rem;
  white-space: normal;
}

.version {
  color: #dbdbdb;
}

.appbar-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.products {
  cursor: pointer;
}

.v-tab {
  text-transform: capitalize;
  letter-spacing: 0;
  font-size: 12px;
  min-width: 80px;
}

.tooltip-right {
  color: #000;
  border: 1px solid #4f4f4f;
}

.tooltip-right::before {
  content: " ";
  position: absolute;
  top: 50%;
  right: 100%; /* To the left of the tooltip */
  margin-top: -8px;
  border-width: 8px;
  border-style: solid;
  border-top: solid 8px transparent;
  border-bottom: solid 8px transparent;
  border-left: solid 8px transparent;
  color: #fff;
}

@media only screen and (max-width: 600px) {
  >>> .v-toolbar__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .incubator__details {
    display: none;
  }

  .mbl {
    margin-top: 15px;
  }

  .appbar-actions {
    width: auto !important;
    /* width: 100% !important; */
  }

  >>> .v-menu__content {
    max-width: 100% !important;
    left: 0 !important;
  }
}
</style>
