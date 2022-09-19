<template>
  <div>
    <credit-banner></credit-banner>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <h3 class="heading ml-5">
      <b> Dashboard </b>
    </h3>
    <div class="progress">
      <h3 class="heading">Your Progress</h3>
      <Progress></Progress>
    </div>
    <div class="edit-profile">
      <h3 class="heading d-flex justify-space-between align-center">
        Update Profile
        <!-- <v-btn icon class="edit-profile-icon" @click="edit()">
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn> -->
      </h3>
      <!-- <p class="px-4 description">
        {{ $store.state.user.currentUser.description }}
      </p> -->
      <profile :data="currentUser"></profile>
    </div>
    <!-- <div class="recent-activity-row">
      <recent-activity
        v-for="(activity, index) in recentActivities"
        :key="index"
        :activity="activity"
      ></recent-activity>
    </div> -->
    <div class="profile-row">
      <!-- <div class="your-profle">
        <h3 class="heading">Your Profile</h3>
        <div class="mx-4">
          <span class="text-muted">Complete your profile</span>
          <h2 class="title mt-2">Upload Pitch Deck</h2>
          <img src="../../assets/images/pitch-steps.png" alt="" class="my-5" />
          <img src="../../assets/images/pitch-step-1.png" alt="" />
          <v-btn
            color="traktor"
            dark
            class="ml-auto d-block"
            @click="goto('/de')"
            >Complete profile</v-btn
          >
        </div>
      </div> -->
      <div class="documents">
        <!-- <h3 class="heading">Documents</h3> -->
        <!-- <div class="document-actions d-flex justify-space-between">
          <v-col cols="12" md="6">
            <v-text-field
              outlined
              placeholder="Search for Documents"
              append-icon="mdi-magnify"
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-btn
              color="traktor"
              dark
              class="d-block ml-auto"
              @click="createNewDocumentDialog = true"
              >Upload Document</v-btn
            >
          </v-col>
        </div> -->
        <!-- <document-table></document-table> -->
        <documents :userId="currentUser.docId"></documents>
      </div>
      <div class="awards">
        <awards :data="currentUser"></awards>
      </div>
    </div>
    <div class="upcomings">
      <div class="upcoming-col">
        <h3 class="heading ml-0">Mentoring</h3>
        <upcoming-sessions></upcoming-sessions>
        <!-- <upcoming-events></upcoming-events> -->
      </div>
      <div class="upcoming-col">
        <h3 class="heading ml-0">Events</h3>
        <upcoming-events></upcoming-events>
        <!-- <upcoming-sessions></upcoming-sessions> -->
      </div>
    </div>
    <document-update
      :visible="createNewDocumentDialog"
      @close="createNewDocumentDialog = false"
    ></document-update>
    <startup-edit></startup-edit>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CreditBanner from "../../components/Benifits/AWS/CreditBanner.vue";
// import DocumentTable from "../../components/Documentation/DocumentTable.vue";
// import UpcomingEvents from "../../components/Events/UpcomingEvents.vue";
// import UpcomingSessions from "../../components/Mentorship/UpcomingSessions.vue";
import DocumentUpdate from "../../components/Modals/Documentation/DocumentUpdate.vue";
import StartupEdit from "../../components/Modals/StartupEdit.vue";
import Progress from "../../components/Startup/Progress.vue";
import Awards from "../../components/Startup/ResumeProfile/Awards.vue";
import Documents from "../../components/Startup/ResumeProfile/Documents.vue";
import Profile from "../../components/Startup/ResumeProfile/Profile.vue";
import UpcomingEvents from "../../components/TestComponents/Mentorship/UpcomingEvents.vue";
import UpcomingSessions from "../../components/TestComponents/Mentorship/UpcomingSessions.vue";
// import RecentActivity from "../../components/Startup/Cards/RecentActivity.vue";
import startupStats from "../../mixins/startupStats";

export default {
  components: {
    // RecentActivity,
    // UpcomingEvents,
    // UpcomingSessions,
    // DocumentTable,
    Progress,
    DocumentUpdate,
    UpcomingSessions,
    UpcomingEvents,
    StartupEdit,
    Profile,
    Documents,
    Awards,
    CreditBanner,
  },
  name: "DashboardV2",
  data() {
    return {
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
          href: "breadcrumbs_dashboard",
        },
      ],
      createNewDocumentDialog: false,
    };
  },
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  mixins: [startupStats],
  methods: {
    edit() {
      console.log(this.currentUser);
      this.$store.dispatch("SHOW_STARTUP_EDIT", {
        isShowing: true,
        basicDetails: this.currentUser,
      });
    },
    goto(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style scoped>
.recent-activity-row {
  display: flex;
  align-items: center;
  margin: 0 1rem;
  flex-wrap: wrap;
}

.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1rem;
  font-weight: 500;
  /* font-size: 24px; */
}

.text-muted {
  color: #bcbcbc;
}

.title {
  color: #3aa959;
  font-size: 26px !important;
}

.upcomings {
  display: flex;
  justify-content: space-between;
  /* align-items: center; */
  margin: 2rem 1rem;
}

.upcoming-col {
  width: 48%;
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  padding: 1rem;
}

.description {
  color: #747474;
  font-size: 18px;
  font-weight: 500;
}

.profile-row {
  display: flex;
  justify-content: space-between;
  margin: 2rem 1rem;
}

.profile-row > * {
  width: 48%;
}

.your-profle {
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  padding: 1rem;
}

.progress,
.edit-profile {
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  padding: 1rem;
  margin: 2rem 1rem;
}

.documents,
.awards {
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  /* margin: 1rem; */
}

@media only screen and (max-width: 600px) {
  .progress {
    height: 290px;
  }

  .upcoming-col {
    width: 100%;
    margin-bottom: 1rem;
  }

  .profile-row {
    flex-wrap: wrap;
    margin: 1rem;
  }

  .profile-row > * {
    width: 100%;
    margin-bottom: 1rem;
  }

  .upcomings {
    flex-wrap: wrap;
    margin: 1rem;
  }
}
</style>