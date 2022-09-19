<template>
  <div>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <h3 class="heading">Mentors</h3>

    <!-- <div class="wrapper">
      <v-row class="top__header">
        <v-col cols="12" class="d-flex">
          <h2 class="white--text">Mentors</h2>
          <div class="actions__items d-flex ml-auto">
            <v-tooltip
              top
              v-if="
                currentUser.role === 'incubator' ||
                currentUser.role === 'member'
              "
            >
              <template v-slot:activator="{ on, attrs }">
                <router-link to="/mentor/new"
                  ><v-btn icon color="#fff" v-bind="attrs" v-on="on"
                    ><v-icon size="28">mdi-plus-circle</v-icon></v-btn
                  ></router-link
                >
              </template>
              <span>Add new mentor</span>
            </v-tooltip>
            <v-tooltip
              top
              v-if="
                currentUser.role === 'incubator' ||
                currentUser.role === 'member'
              "
            >
              <template v-slot:activator="{ on, attrs }">
                <download-excel :data="exportingData">
                  <v-btn icon color="#fff" v-bind="attrs" v-on="on"
                    ><v-icon size="28">mdi-microsoft-excel</v-icon></v-btn
                  >
                </download-excel>
              </template>
              <span>Export data</span>
            </v-tooltip>
          </div>
        </v-col>
      </v-row>
    </div> -->
    <current-mentors v-if="currentUser.role === 'startup'" />

    <div class="mentors">
      <h3 class="heading ml-3">All Mentors</h3>
      <v-row class="mb-3 mx-1">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            outlined
            dense
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <div class="float-right">
            <v-btn
              color="traktor"
              dark
              to="/mentor/new"
              class="mr-2"
              v-if="currentUser.role === 'incubator'"
              >Add new mentor</v-btn
            >
            <v-btn
              color="traktor"
              dark
              @click="mentorHourModal = true"
              v-if="currentUser.role === 'startup'"
              >Add mentor hour</v-btn
            >
            <v-autocomplete
              outlined
              :items="regions"
              label="Select Region"
              multiple
              dense
              class="mr-2"
              v-if="currentUser.role === 'sIncubator'"
            ></v-autocomplete>
          </div>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="mentors"
        sort-by=""
        class="elevation-1 mx-4"
        :search="search"
        v-if="!skeletonLoader"
        :items-per-page="50"
        mobile-breakpoint="0"
        :footer-props="{
          'items-per-page-options': [50, 80, 100, -1],
        }"
        @click:row="handleClick"
      >
        <template v-slot:[`item.startupsAssociated`]="{ item }">
          {{ getStartups(item.startupsAssociated) }}
        </template>
        <template v-slot:[`item.logo`]="{ item }">
          <img :src="item.photoURL" :alt="item.name" class="logo" />
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-chip small :color="getColor(item.status)" dark>
            {{ item.status === undefined ? "Active" : item.status }}
          </v-chip>
        </template>
        <template
          v-slot:[`item.view`]="{ item }"
          v-if="currentUser.role === 'startup'"
        >
          <v-btn color="traktor" @click="view(item.docId)" class="white--text"
            >View</v-btn
          >
        </template>
        <template
          v-slot:[`item.request`]="{ item }"
          v-if="currentUser.role === 'startup'"
        >
          <v-btn
            color="traktor"
            @click="requestMentor(item)"
            class="white--text"
            >Request</v-btn
          >
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on">mdi-dots-vertical</v-icon>
            </template>
            <v-list>
              <v-list-item @click="view(item.docId)">
                <v-list-item-title> View </v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="connect(item.docId, item.name)"
                v-if="currentUser.role === 'mentor'"
              >
                <v-list-item-title> Connect </v-list-item-title>
              </v-list-item>
              <v-list-item @click="handleMessage(item)">
                <v-list-item-title> Message </v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="_delete(item.docId)"
                v-if="
                  currentUser.role === 'incubator' ||
                  currentUser.role === 'member'
                "
              >
                <v-list-item-title> Delete </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
      <data-table v-else />
    </div>
    <mentor-edit-modal />
    <progress-update />
    <mentor-hours
      :visible="mentorHourModal"
      @close="mentorHourModal = false"
    ></mentor-hours>
    <Profile
      v-if="profileData"
      :modal.sync="showModal"
      :profileData="profileData"
    />
    <v-dialog v-model="isMentoringRequest" width="400">
      <v-card>
        <v-card-title>Send mentoring request?</v-card-title>
        <v-card-text></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="isMentoringRequest = false">
            No
          </v-btn>
          <v-btn color="traktor" @click="request(mentorItem)" dark>Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <message-widget
      :visible="messagingDialog"
      :selectedConversationId="selectedConversationId"
      @close="messagingDialog = false"
    ></message-widget>
  </div>
</template>

<script>
import MentorEditModal from "@/components/Modals/MentorEdit";
import ProgressUpdate from "@/components/Modals/Mentor/ProgressUpdate";
import DataTable from "@/components/Stateless/SkeletonLoader/DataTable";
import { mapState } from "vuex";
import Swal from "sweetalert2";
import { activityRef, mentorsRef } from "../../config/firebase_services";
import Profile from "@/components/Modals/Mentor/Profile";
import CurrentMentors from "@/components/Startup/CurrentMentors";
import { getStartupsByStatus } from "../../services/Startups";
import MentorHours from "../Modals/Mentorship/MentorHours.vue";
import MessageWidget from "../Common/MessagingModule/MessageWidget.vue";
import messagingMixin from "../../mixins/messaging";

export default {
  name: "List",
  components: {
    MentorEditModal,
    ProgressUpdate,
    DataTable,
    Profile,
    CurrentMentors,
    MentorHours,
    MessageWidget,
  },
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  mixins: [messagingMixin],
  data() {
    return {
      isMentoringRequest: false,
      mentorItem: {},
      showModal: false,
      profileData: null,
      skeletonLoader: true,
      singleSelect: false,
      selected: [],
      dialog: false,
      mentors: [],
      search: null,
      headers: [
        { text: "", align: "center", sortable: false, value: "logo" },
        { text: "Name", value: "name", align: "center", sortable: true },
        // {
        //   text: "Expertise",
        //   value: "areaOfExpertise",
        //   align: "center",
        //   sortable: true,
        // },
        {
          text: "Institution",
          value: "institution",
          align: "center",
          sortable: true,
        },
        {
          text: "Startups",
          value: "startupsAssociated",
          align: "center",
          sortable: true,
        },
      ],
      exportingData: [],
      startups: [],
      mentorsAssociated: [],
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
          href: "dashboard",
        },
        {
          text: "Mentors",
          disabled: true,
        },
      ],
      mentorHourModal: false,
    };
  },
  async created() {
    this.checkRole();
    this.fetchStartups();
    this.getMentors();
  },
  methods: {
    checkRole() {
      if (
        this.$store.state.user.currentUser.role === "incubator" ||
        this.$store.state.user.currentUser.role === "mentor" ||
        this.$store.state.user.currentUser.role === "member"
      ) {
        this.headers.push({
          text: "",
          value: "actions",
          align: "center",
          sortable: false,
        });
      }

      if (this.$store.state.user.currentUser.role === "startup") {
        this.headers.push({
          text: "",
          value: "view",
          align: "center",
          sortable: false,
        });
        this.headers.push({
          text: "",
          value: "request",
          align: "center",
          sortable: false,
        });
        this.mentorsAssociated =
          this.$store.state.user.currentUser.mentorsAssociated.map(
            (mentor) => mentor.id
          );
      }
    },
    getMentors() {
      mentorsRef
        .where(
          "incubatorId",
          "==",
          this.$store.state.incubator.currentIncubator.docId
        )
        .where("isDeleted", "==", false)
        .onSnapshot((snapshot) => {
          this.mentors = [];
          snapshot.forEach((document) => {
            if (
              document.id !== this.$store.state.user.currentUser.docId &&
              !this.mentorsAssociated.includes(document.id)
            )
              this.mentors.push(document.data());
          });
          this.skeletonLoader = false;
          this.prepareJsonToExcelData();
        });
    },
    getStartups(item) {
      if (item.length === 0) {
        return "Not associated";
      }

      let itm = "";
      item.forEach((it) => {
        if (this.startups.includes(it.name)) {
          itm += it.name + ", ";
        }
      });

      if (itm === "") return "-";
      return itm.slice(0, -2);
    },
    async fetchStartups() {
      this.startups = await getStartupsByStatus(
        "active",
        this.$store.state.incubator.currentIncubator.docId
      );
    },
    getColor(status) {
      if (status === "active") return "traktor";
      else if (status === "droppedout") return "red";
      else return "traktor";
    },
    view(docId) {
      if (this.currentUser.role === "startup") {
        const obj = this.mentors.find((mentor) => mentor.docId === docId);
        this.showModal = true;
        this.profileData = obj;
        return;
      }
      this.$router.push(`/mentor/${docId}`);
    },
    handleClick(item) {
      if (this.currentUser.role === "startup") {
        const obj = this.mentors.find((mentor) => mentor.docId === item.docId);
        this.showModal = true;
        this.profileData = obj;
        return;
      }
      this.$router.push(`/mentor/${item.docId}`);
    },
    edit(item) {
      this.$store.dispatch("SHOW_MENTOR_EDIT", {
        isShowing: true,
        basicDetails: item,
      });
    },
    progress(item) {
      this.$store.dispatch("SHOW_MENTOR_PROGRESS_UPDATE", {
        isShowing: true,
        data: item,
      });
    },
    prepareJsonToExcelData() {
      const fields = {
        name: "Name",
        designation: "Current Designation",
        startupsAssociated: "Startups Associated",
        phoneNumber: "Contact",
        yearOfPassing: "Year of passing",
        email: "Email",
        institution: "Institution",
        areaOfExpertise: "Expertise",
        linkedIn: "LinkedIn",
        description: "Description",
      };
      this.mentors.forEach((mentor) => {
        const data = {};
        Object.keys(fields).forEach((key) => {
          mentor[key] === undefined || mentor[key] === null
            ? (data[fields[key]] = "")
            : (data[fields[key]] = mentor[key]);

          if (key === "startupsAssociated")
            data[fields[key]] = this.getStartups(mentor[key]);
        });
        this.exportingData.push(data);
      });
    },
    requestMentor(item) {
      this.isMentoringRequest = true;
      this.mentorItem = item;
    },
    async request(item) {
      const activity = {
        createdAt: new Date(),
        photoURL: this.currentUser.photoURL,
        incubatorId: this.$store.state.incubator.currentIncubator.docId,
        notification: true,
        type: "incubator",
        statement: `Startup ${this.currentUser.name} has requested for mentoring session with the mentor ${item.name}`,
        startup: this.currentUser,
        mentor: item,
        read: false,
      };

      try {
        await activityRef.add(activity);
        this.$toast.success("Request sent", {
          position: "top",
        });
        this.isMentoringRequest = false;
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
    _delete(docId) {
      Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3aa959",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await mentorsRef
              .doc(docId)
              .set({ isDeleted: true }, { merge: true });

            this.$toast.success("Deleted", {
              position: "top",
            });
          } catch (error) {
            this.$toast.error(error, {
              position: "top",
            });
          }
        }
      });
    },
    async connect(id, name) {
      Swal.fire({
        title: `Are you sure?`,
        showCancelButton: true,
        confirmButtonColor: "#3aa959",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const activity = {
            createdAt: new Date(),
            incubatorId: this.$store.state.incubator.currentIncubator.docId,
            notification: true,
            type: "mentor",
            statement: `Mentor ${this.$store.state.user.currentUser.name} have requested for a new connection with ${name}.`,
            photoURL: this.$store.state.user.currentUser.photoURL,
            read: false,
          };

          const _activity = {
            createdAt: new Date(),
            incubatorId: this.$store.state.incubator.currentIncubator.docId,
            notification: true,
            type: "mentor",
            mentorId: id,
            onlyMentor: true,
            statement: `Mentor ${this.$store.state.user.currentUser.name} requested to connect with you.`,
            photoURL: this.$store.state.user.currentUser.photoURL,
            read: false,
          };

          try {
            await activityRef.add(activity);
            await activityRef.add(_activity);
            this.$toast.success("Request sent.", {
              position: "top",
            });
          } catch (error) {
            this.$toast.error(error, {
              position: "top",
            });
          }
        }
      });
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}

.logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.v-btn {
  font-size: 12px;
  text-transform: capitalize;
  font-weight: bold;
}

>>> .v-data-table-header th {
  white-space: nowrap;
  width: 120px;
}

>>> tr {
  cursor: pointer !important;
}

>>> th {
  color: #3aa95a !important;
  font-size: 17px !important;
}

>>> td {
  font-weight: bold !important;
  font-size: 14px !important;
}

.card {
  border-radius: 10px !important;
}

.v-toolbar__title {
  font-size: 28px !important;
  font-weight: bold;
}

.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: bold;
}

.mentors {
  background-color: #fff;
  padding: 1rem;
  border: 1px solid #e5e5e5;
  margin: 1rem 1rem;
}

@media only screen and (max-width: 600px) {
  .back__nav {
    display: none;
  }
}
</style>