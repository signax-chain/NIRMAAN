<template>
  <v-container>
    <credit-banner
      class="mb-10"
      v-if="currentUser.role === 'startup'"
    ></credit-banner>
    <v-breadcrumbs
      :items="crumbs"
      v-if="currentUser.role !== 'startup'"
    ></v-breadcrumbs>
    <h3 class="heading" v-if="currentUser.role !== 'startup'">
      <v-btn icon color="traktor" to="/startups">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      Startup Profile
    </h3>
    <profile :data="data" class="item"></profile>
    <about :data="data" class="item"></about>
    <!-- <Progress
      :data="data"
      class="item"
      v-show="data.status !== 'active'"
    ></Progress> -->
    <v-row class="item">
      <v-col cols="12" md="6">
        <founders :startup="data"></founders>
      </v-col>
      <v-col cols="12" md="6">
        <team-members :startup="data"></team-members>
      </v-col>
    </v-row>
    <v-row class="item" v-show="currentUser.role !== 'mentor'">
      <v-col cols="12" md="12">
        <h2 class="d-flex">
          Funding
          <v-btn
            color="traktor"
            dark
            outlined
            class="ml-auto d-block"
            @click="fundingDialog = true"
            v-if="currentUser.role !== 'startup'"
          >
            <v-icon>mdi-pencil</v-icon>
            Edit
          </v-btn>
        </h2>
        <funding-overview class="mt-3"></funding-overview>
        <v-btn
          color="traktor"
          dark
          class="d-block ml-auto"
          @click="viewFunding = !viewFunding"
        >
          View {{ viewFunding ? "less" : "more" }}
          <v-icon v-if="!viewFunding">mdi-menu-down</v-icon>
          <v-icon v-else>mdi-menu-up</v-icon>
        </v-btn>

        <funding-statement v-if="viewFunding"></funding-statement>

        <!-- <fundings></fundings> -->
      </v-col>
    </v-row>
    <v-row class="item">
      <v-col cols="12" md="6">
        <documents :userId="startupId"></documents>
      </v-col>
      <v-col cols="12" md="6">
        <awards :data="data"></awards>
      </v-col>
    </v-row>
    <v-row class="item" v-if="currentUser.role !== 'startup'">
      <v-col cols="12" md="12">
        <activity :userId="startupId"></activity>
      </v-col>
    </v-row>
    <create-funding
      :visible="fundingDialog"
      @close="fundingDialog = false"
    ></create-funding>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import CreditBanner from "../../components/Benifits/AWS/CreditBanner.vue";
import Activity from "../../components/Documentation/Activity.vue";
import CreateFunding from "../../components/Modals/Accountant/CreateFunding.vue";
// import Fundings from "../../components/Startup/Fundings.vue";
// import Progress from "../../components/Startup/Progress.vue";
import About from "../../components/Startup/ResumeProfile/About.vue";
import Awards from "../../components/Startup/ResumeProfile/Awards.vue";
import Documents from "../../components/Startup/ResumeProfile/Documents.vue";
import Founders from "../../components/Startup/ResumeProfile/Founders.vue";
import Profile from "../../components/Startup/ResumeProfile/Profile.vue";
import TeamMembers from "../../components/Startup/ResumeProfile/TeamMembers.vue";
import { startupsRef } from "../../config/firebase_services";
import FundingOverview from "../Accountant/FundingOverview.vue";
import FundingStatement from "../Accountant/FundingStatement.vue";
export default {
  components: {
    Profile,
    About,
    Founders,
    // Fundings,
    Documents,
    Awards,
    TeamMembers,
    // Progress,
    Activity,
    FundingOverview,
    FundingStatement,
    CreateFunding,
    CreditBanner,
  },
  name: "ResumeDashboard",
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  data() {
    return {
      startupId: "",
      data: {},
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
        },
        {
          text: "Startups",
          disabled: true,
        },
        {
          text: "Profile",
          disabled: true,
        },
      ],
      fundingDialog: false,
      viewFunding: false,
    };
  },
  created() {
    this.startupId =
      this.$route.params.id !== undefined
        ? this.$route.params.id
        : this.$store.state.user.currentUser.docId;

    startupsRef.doc(this.startupId).onSnapshot((snapshot) => {
      const data = snapshot.data();
      if (data.teamMembers === undefined || data.teamMembers.length === 0)
        data.teamMembers = [
          { name: null, email: null, phoneNumber: null, designation: null },
        ];
      if (data.founders === undefined || data.founders.length === 0)
        data.founders = [
          {
            name: null,
            email: null,
            phoneNumber: null,
            gender: null,
            studentId: null,
            linkedIn: null,
            role: null,
          },
        ];
      this.data = data;
    });
  },
};
</script>

<style scoped>
.item {
  width: 96%;
  border: 1px solid #e5e5e5;
  margin: 0 auto;
  margin-bottom: 20px;
  border-radius: 5px;
  background-color: #fff;
}

.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}

@media only screen and (max-width: 600px) {
  .container {
    padding: 0 !important;
  }
}
</style>