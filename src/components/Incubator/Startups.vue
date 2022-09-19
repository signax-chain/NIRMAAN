<template>
  <div class="startups__list">
    <v-data-table
      mobile-breakpoint="0"
      :headers="headers"
      :items="filteredData"
      :search="search"
      class="elevation-1"
      v-if="!skeletonLoader"
      :items-per-page="50"
      :footer-props="{
        'items-per-page-options': [50, 80, 100, -1],
      }"
      @click:row="handleClick"
    >
      <template v-slot:[`item.logo`]="{ item }">
        <v-menu open-on-hover top offset-y>
          <template v-slot:activator="{ on, attrs }">
            <div v-bind="attrs" v-on="on">
              <img :src="item.photoURL" :alt="item.name" class="logo" />
              <v-chip
                class="status__chip"
                style="height: 15px !important"
                small
                :color="getColor(item.status)"
                dark
                >{{ getStatus(item.status).charAt(0) }}</v-chip
              >
            </div>
          </template>
          <startup-profile :data="item"></startup-profile>
        </v-menu>
      </template>
      <template v-slot:[`item.name`]="{ item }">
        <v-menu open-on-hover top offset-y>
          <template v-slot:activator="{ on, attrs }">
            <div v-bind="attrs" v-on="on">
              <span style="cursor: pointer">{{ item.name }}</span>
            </div>
          </template>
          <startup-profile :data="item"></startup-profile>
        </v-menu>
      </template>

      <!-- <template v-slot:[`item.cohortyear`]="{ item }">
        {{ item.cohort.year }}
      </template> -->

      <template v-slot:[`item.cohortname`]="{ item }">
        {{ item.cohort.name }} {{ item.cohort.year }}
      </template>

      <template v-slot:[`item.mentorsAssociated`]="{ item }">
        {{ getMentors(item._mentorsAssociated) }}
      </template>

      <template
        v-slot:[`item.stage`]="{ item }"
        v-if="currentUser.role !== 'startup'"
      >
        {{ getStage(item) }}
      </template>

      <template v-slot:[`item.fundingReceived`]="{ item }">
        Rs.
        {{
          item._funding === undefined
            ? 0
            : item._funding.received.toLocaleString()
        }}
      </template>

      <template v-slot:[`item.fundingUtilized`]="{ item }">
        Rs.
        {{
          item._funding === undefined
            ? 0
            : item._funding.utilized.toLocaleString()
        }}
      </template>

      <template v-slot:[`item.fundingBalance`]="{ item }">
        Rs.
        {{
          item._funding === undefined
            ? 0
            : item._funding.balance.toLocaleString()
        }}
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-menu offset-y v-if="currentUser.role !== 'startup'">
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on">mdi-dots-vertical</v-icon>
          </template>
          <v-list>
            <v-list-item
              @click="viewFunding(item.docId)"
              v-if="currentUser.role === 'accountant'"
            >
              <v-list-item-title> View</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="editFunding(item.name, item.docId)"
              v-if="currentUser.role === 'accountant'"
            >
              <v-list-item-title> Update</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="view(item.docId)"
              v-if="currentUser.role !== 'accountant'"
            >
              <v-list-item-title> View </v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="edit(item)"
              v-if="currentUser.role === 'member'"
            >
              <v-list-item-title> Edit </v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="notes(item.docId, item.name)"
              v-if="
                currentUser.role === 'incubator' ||
                  (currentUser.role === 'mentor' && mentorId)
              "
            >
              <v-list-item-title> Notes </v-list-item-title>
            </v-list-item>
            <!-- <v-list-item
              @click="establishConnection(item.docId)"
              v-if="currentUser.role === 'incubator'"
            >
              <v-list-item-title> Connect </v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="connect(item.docId, item.name, item.email)"
              v-if="currentUser.role === 'mentor'"
            >
              <v-list-item-title> Connect </v-list-item-title>
            </v-list-item> -->
            <v-list-item
              v-if="currentUser.role !== 'startup'"
              @click="handleMessage(item)"
            >
              <v-list-item-title> Message </v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="raiseConcern(item.docId, item.name)"
              v-if="currentUser.role === 'mentor' && mentorId"
            >
              <v-list-item-title> Raise a concern </v-list-item-title>
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
        <!-- <div class="d-flex" v-if="currentUser.role !== 'startup'">
          <v-btn icon @click="copyToClipboard(item.socialLinks.website)">
            <v-icon color="#b0b0b0">mdi-web</v-icon>
          </v-btn>
          <v-btn icon @click="copyToClipboard(item.phoneNumber)">
            <v-icon color="#b0b0b0">mdi-phone</v-icon>
          </v-btn>
          <v-btn icon @click="copyToClipboard(item.email)">
            <v-icon color="#b0b0b0">mdi-email</v-icon>
          </v-btn>
        </div> -->
        <div class="d-flex" v-if="currentUser.role === 'startup'">
          <v-btn
            color="traktor"
            dark
            class="mr-2"
            @click="viewProfile(item.docId)"
            >View</v-btn
          >
          <v-btn
            color="traktor"
            dark
            @click="connect(item.docId, item.name, item.email)"
            >Connect</v-btn
          >
        </div>
      </template>
      <template v-slot:top="">
        <div class="pa-5">
          <!-- <h3 class="heading">All Startups</h3> -->
          <v-row class="my-3" v-show="!mentorId">
            <v-col cols="12" md="6">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                placeholder="Search for startups"
                single-line
                hide-details
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <div
                class="d-flex float-right"
                v-if="currentUser.role === 'incubator'"
              >
                <v-btn color="traktor" dark to="/startup/new"
                  >Add new Startup</v-btn
                >
                <v-btn
                  color="grey"
                  icon
                  large
                  @click="registrationDialog = true"
                >
                  <v-icon>mdi-clipboard</v-icon>
                </v-btn>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <download-excel :data="exportingData">
                      <v-btn icon color="traktor" v-bind="attrs" v-on="on"
                        ><v-icon size="28">mdi-microsoft-excel</v-icon></v-btn
                      >
                    </download-excel>
                  </template>
                  <span>Export data</span>
                </v-tooltip>
                <v-menu
                  offset-y
                  :close-on-content-click="false"
                  v-model="filterMenu"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="grey" dark v-bind="attrs" v-on="on" text>
                      filters
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-text>
                      <v-row>
                        <v-col col="12" md="3">
                          <v-select
                            :items="filters.name"
                            label="Name"
                            @change="handleFilterName"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-autocomplete
                            label="Select a program"
                            :items="filters.programs"
                            v-model="activeFilters.program"
                            @change="handleProgramFilter"
                            multiple
                            clearable
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-dialog v-model="modal" persistent width="290px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                placeholder="Select Cohort"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                :value="formattedMonthAndYear"
                                clearable
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="cohorts"
                              type="month"
                              color="traktor"
                              scrollable
                              multiple
                            >
                              <v-spacer></v-spacer>
                              <v-btn text color="red" @click="modal = false">
                                Cancel
                              </v-btn>
                              <v-btn
                                text
                                color="traktor"
                                @click="handleFilters()"
                              >
                                OK
                              </v-btn>
                            </v-date-picker>
                          </v-dialog>
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-autocomplete
                            :items="filters.sector"
                            multiple
                            label="Sector"
                            v-model="activeFilters.sector"
                            clearable
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-autocomplete
                            :items="filters.status"
                            multiple
                            label="Status"
                            item-text="value"
                            item-value="key"
                            v-model="activeFilters.status"
                            clearable
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-autocomplete
                            :items="filter.mentorsAssociated"
                            item-text="name"
                            item-value="id"
                            label="Mentors associated"
                            multiple
                            v-model="activeFilters.mentorsAssociated"
                            clearable
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-autocomplete
                            :items="filters.stage"
                            label="Stage"
                            multiple
                            v-model="activeFilters.stage"
                            clearable
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="3">
                          <div class="d-flex mt-5">
                            <download-excel :data="filteredData">
                              <v-btn text color="traktor">Export</v-btn>
                            </download-excel>
                            <v-btn color="red" text @click="clearFilter()"
                              >Clear</v-btn
                            >
                            <v-btn color="traktor" dark @click="filterData()"
                              >Apply</v-btn
                            >
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </div>
              <div
                class="d-flex float-right"
                v-if="currentUser.role === 'sIncubator'"
              >
                <v-autocomplete
                  outlined
                  :items="regions"
                  label="Select Region"
                  multiple
                  dense
                  class="mr-2"
                ></v-autocomplete>
                <v-autocomplete
                  :items="incubators"
                  label="Select Incubator"
                  multiple
                  outlined
                  dense
                ></v-autocomplete>
              </div>
              <div
                class="d-flex float-right"
                v-if="currentUser.role === 'accountant'"
              >
                <v-btn color="traktor" dark @click="gotoFunding()"
                  >Update funding</v-btn
                >
              </div>
            </v-col>
          </v-row>
          <!-- <v-row>
            <v-col cols="12" md="12">
              <h3 class="heading">Programs</h3>
              <div class="d-flex align-center">
                <v-chip color="traktor" dark>All</v-chip>
                <v-chip
                  outlined
                  class="ma-2"
                  color="traktor"
                  v-for="(program, index) in programs"
                  :key="index"
                  v-show="index !== programs.length - 1"
                >
                  {{ program }}
                </v-chip>
              </div>
            </v-col>
          </v-row> -->
        </div>
      </template>
    </v-data-table>
    <data-table v-else />
    <startup-edit-modal />
    <progress-update />
    <Profile
      v-if="profileData"
      :modal.sync="showModal"
      :profileData="profileData"
    />
    <program
      :visible="programDialog"
      @close="closeAddNewProgramModal"
      @addNewProgram="addNewProgram"
    ></program>
    <raise-concern
      :visible="concernDialog"
      :startup="startup"
      @close="concernDialog = false"
    ></raise-concern>
    <registration-link
      :visible="registrationDialog"
      @close="registrationDialog = false"
    ></registration-link>
    <message-widget
      :visible="messagingDialog"
      :selectedConversationId="selectedConversationId"
      @close="messagingDialog = false"
    ></message-widget>
  </div>
</template>

<script>
import StartupEditModal from "@/components/Modals/StartupEdit";
import ProgressUpdate from "@/components/Modals/Startup/ProgressUpdate";
import DataTable from "@/components/Stateless/SkeletonLoader/DataTable";
import Profile from "@/components/Modals/Startup/Profile";
import { startupsRef } from "@/config/firebase_services";
import { mapState } from "vuex";
import Swal from "sweetalert2";
import {
  activityRef,
  internalConnectionsRef,
  notesRef,
} from "../../config/firebase_services";
import { getSectors, setPrograms, getStages } from "../../services/dynamics";
import Program from "../Modals/addNew/Program.vue";
import { getMentorsAssociated, getStartupById } from "../../services/Startups";
import RaiseConcern from "../Modals/Mentor/RaiseConcern.vue";
import moment from "moment";
import StartupProfile from "../Modals/Popovers/StartupProfile.vue";
import copy from "copy-to-clipboard";
import RegistrationLink from "../Modals/Startup/RegistrationLink.vue";
import fundingDetails from "../../mixins/accountant";
import MessageWidget from "../Common/MessagingModule/MessageWidget.vue";
import messagingMixin from "../../mixins/messaging";

export default {
  name: "List",
  components: {
    StartupEditModal,
    ProgressUpdate,
    DataTable,
    Profile,
    Program,
    RaiseConcern,
    StartupProfile,
    RegistrationLink,
    MessageWidget,
  },
  props: ["mentorId"],
  mixins: [fundingDetails, messagingMixin],
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
    headers: function() {
      return [
        { text: "", align: "center", sortable: false, value: "logo" },
        { text: "Name", value: "name", align: "center", sortable: true },
        // { text: "Program", value: "program", align: "center", sortable: true },
        {
          text: "Cohort",
          value: "cohortname",
          align: "center",
          sortable: true,
        },
        // {
        //   text: "Year",
        //   value: "cohortyear",
        //   align: "center",
        //   sortable: true,
        // },
      ];
    },
    formattedMonthAndYear() {
      return this.cohorts.map((cohort) =>
        cohort ? moment(cohort).format("MMM YYYY") : ""
      );
    },
  },
  data() {
    return {
      showModal: false,
      profileData: null,
      skeletonLoader: true,
      dialog: false,
      startups: [],
      search: null,
      cohorts: [],
      cohortnames: [],
      cohortyears: [
        2010,
        2011,
        2012,
        2013,
        2014,
        2015,
        2016,
        2017,
        2018,
        2019,
        2020,
        2021,
        2022,
        2023,
        2024,
        2025,
        2026,
        2027,
        2028,
        2029,
        2030,
      ],
      programDialog: false,
      addNewCohortModal: false,
      programs: [],
      program: "",
      startup: {},
      concernDialog: false,
      modal: false,
      activeFilters: {},
      filters: {
        name: ["A-Z", "Z-A"],
        status: [
          { key: "active", value: "Active" },
          { key: "droppedout", value: "Dropped Out" },
          { key: "graduated", value: "Graduated" },
        ],
        sector: [],
        stage: [],
        mentorsAssociated: [],
        programs: [],
      },
      filteredData: [],
      filterMenu: false,
      registrationDialog: false,
      statusMap: {
        active: "Active",
        droppedout: "Dropped Out",
        graduated: "Graduated",
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.prepareFilters();
    });
  },
  methods: {
    viewFunding(id) {
      this.$router.push(`/startups/${id}/funding`);
    },
    editFunding(name, id) {
      this.$router.push({
        name: "FundingForm",
        params: { item: { name: name, id: id } },
      });
    },
    establishConnection(id) {
      this.$router.push(`/startupship/${id}`);
    },
    updateHeaders(role) {
      if (role === "accountant") {
        this.headers.push(
          {
            text: "Funding Disbursed",
            align: "center",
            sortable: false,
            value: "fundingReceived",
          },
          {
            text: "Funding Utilized",
            align: "center",
            sortable: false,
            value: "fundingUtilized",
          },
          {
            text: "Balance",
            align: "center",
            sortable: false,
            value: "fundingBalance",
          }
        );
      }
      if (role !== "accountant") {
        this.headers.push(
          {
            text: "Sector",
            value: "sector",
            align: "center",
            sortable: true,
          },
          {
            text: "Mentor",
            value: "mentorsAssociated",
            align: "center",
            sortable: true,
          }
        );
      }
      if (role !== "startup" && role !== "accountant") {
        this.headers.push({
          text: "Current Stage",
          value: "stage",
          align: "center",
          sortable: true,
        });
      }

      this.headers.push({
        text: "Actions",
        value: "actions",
        align: "center",
        sortable: false,
      });
    },
    gotoFunding() {
      this.$router.push("/funding/create");
    },
    filterData() {
      let filterFrom = [];
      this.filteredData = [];
      Object.keys(this.activeFilters).forEach((key, index) => {
        if (this.activeFilters[key].length === 0) return;
        filterFrom = index === 0 ? this.startups : this.filteredData;
        let data = [];

        if (key === "mentorsAssociated") {
          this.activeFilters[key].forEach((v) => {
            const temp = filterFrom.filter((dt) => dt[key].includes(v));
            data = [...data, ...temp];
          });
          this.filteredData = data;
          return;
        }

        this.activeFilters[key].forEach((item) => {
          const temp = filterFrom.filter((dt) => dt[key] === item);
          data = [...data, ...temp];
        });
        this.filteredData = data;
      });
      this.filterMenu = false;
    },
    clearFilter() {
      this.activeFilters = {};
      const query = this.$route.query;
      if (query.sub !== undefined) {
        const data = [];
        const sub = query.sub;
        for (let index = 0; index < this.startups.length; index++) {
          const element = this.startups[index];
          const id = element.facultyOrStudentId;
          if (id !== null && id !== undefined && id !== "") {
            const facultyId = id.toUpperCase().substring(0, 2);
            if (sub === facultyId) {
              data.push(element);
            }
          }
        }
        this.filteredData = data;
      } else {
        this.filteredData = this.startups;
      }
    },
    handleFilterName(order) {
      if (order === "A-Z")
        return this.filteredData.sort((a, b) => (a.name > b.name ? 1 : -1));
      else return this.filteredData.sort((a, b) => (b.name > a.name ? 1 : -1));
    },
    getStage(item) {
      return item.progress === undefined
        ? "Not updated"
        : item.progress.currentStage;
    },
    de(docId) {
      this.$router.push(`/de/${docId}`);
    },
    async notes(docId, name) {
      const documents = await notesRef.where("startup.id", "==", docId).get();

      if (documents.size === 0) {
        Swal.fire({
          text:
            "There is no notes associated to this startup. Do you want to create one?",
          showCancelButton: true,
          confirmButtonColor: "#3aa959",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const data = {
                startup: { id: docId, name: name },
                notes: ["Type the notes here."],
                createdAt: new Date(),
                updatedAt: new Date(),
                user: this.$store.state.user.currentUser,
                incubatorId: this.$store.state.incubator.currentIncubator.docId,
                type: "general",
              };
              const document = await notesRef.add(data);
              this.$router.push(`/notes/${document.id}`);
              return;
            } catch (error) {
              this.$toast.error("Error while creating the notes!", {
                position: "top",
              });
            }
          }
        });
      }

      if (documents.size === 1) {
        documents.forEach((document) => {
          this.$router.push(`/notes/${document.id}`);
        });
      }
    },
    viewProfile(docId) {
      const obj = this.startups.find((startup) => startup.docId === docId);
      this.showModal = true;
      this.profileData = obj;
    },
    toggleAll(col) {
      this.activeFilters[col] = this.startups
        .map((d) => {
          return d[col];
        })
        .filter((value, index, self) => {
          return self.indexOf(value) === index;
        });
    },
    clearAll(col) {
      this.activeFilters[col] = [];
    },
    getColor(status) {
      if (status === "active" || status === null) return "traktor";
      else if (status === "droppedout") return "red";
      else return "blue";
    },
    getStatus(status) {
      if (status === "active" || status === null) return "Active";
      if (status === "graduated") return "Graduated";
      if (status === "droppedout") return "Dropped out";
    },
    getMentors(item) {
      if (item.length === 0) {
        return "Not associated";
      }

      let itm = "";
      item.forEach((it) => {
        itm += it.name + ", ";
      });

      return itm.slice(0, -2);
    },
    view(docId) {
      if (this.currentUser.role === "accountant") return;
      this.$router.push(`/startup/${docId}`);
    },
    handleClick(item) {
      if (this.currentUser.role === "accountant") return;
      this.$router.push(`/startup/${item.docId}`);
    },
    edit(item) {
      this.$store.dispatch("SHOW_STARTUP_EDIT", {
        isShowing: true,
        basicDetails: item,
      });
    },
    progress(item) {
      this.$store.dispatch("SHOW_STARTUP_PROGRESS_UPDATE", {
        isShowing: true,
        data: item,
      });
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
            await startupsRef
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
    filter() {
      this.startups.forEach((startup) => {
        startup.cohortname = startup.cohort.name;
        startup.cohortyear = startup.cohort.year;
        startup.stage = startup.progress?.currentStage;
      });

      for (let col in this.filters) {
        this.filters[col] = this.startups
          .map((d) => {
            return d[col];
          })
          .filter((value, index, self) => {
            return self.indexOf(value) === index;
          });
      }
      this.activeFilters = Object.assign({}, this.filters);
      this.skeletonLoader = false;
    },
    prepareJsonToExcelData() {
      this.exportingData = [];
      const fields = {
        name: "Name",
        sector: "Sector",
        mentorsAssociated: "Mentors Associated",
        phoneNumber: "Contact",
        stage: "Stage",
        email: "Email",
        founders: "Founders",
        cohortMonth: "Cohort Name",
        cohortYear: "Cohort Year",
        facultyOrStudentId: "Faculty Or Student ID",
        cinNumber: "CIN Number",
        website: "Website",
        linkedIn: "LinkedIn",
        description: "Description",
        status: "Status",
      };
      this.startups.forEach((startup) => {
        startup.cohortMonth = startup.cohort?.name;
        startup.cohortYear = startup.cohort?.year;
        startup.stage = startup.progress?.currentStage;
        const data = {};
        Object.keys(fields).forEach((key) => {
          startup[key] === undefined || startup[key] === null
            ? (data[fields[key]] = "")
            : (data[fields[key]] = startup[key]);

          if (key === "founders" || key === "mentorsAssociated")
            data[fields[key]] = this.getMentors(startup[key]);

          if (key === "status")
            data[fields[key]] = this.statusMap[startup[key]];
        });
        this.exportingData.push(data);
      });
      this.skeletonLoader = false;
      this.$emit("excelExport", this.exportingData);
    },
    prepareCohortNames() {
      this.cohortnames = this.$store.state.dynamics.cohortnames;
      this.programs = this.$store.state.dynamics.programs;
      this.filters.programs = this.programs;
    },
    handleProgram(program) {
      if (program === "Add new +") {
        this.programDialog = true;
      }
    },
    async addNewProgram(program) {
      this.programs.splice(this.programs.length - 1, 0, program).join();
      this.regProgram = program;
      this.program = program;
      this.programDialog = false;
      this.$store.dispatch("setPrograms", this.programs);
      await setPrograms(
        this.$store.state.incubator.currentIncubator.docId,
        this.programs
      );
    },
    closeAddNewProgramModal() {
      this.regProgram = this.programs[0];
      this.program = this.programs[0];
      this.programDialog = false;
    },
    async handleProgramFilter(program) {
      if (program === "Add new +") {
        this.programDialog = true;
        return;
      }

      this.activeFilters.program = program;
    },
    async connect(id, name, email) {
      Swal.fire({
        title: `Are you sure?`,
        showCancelButton: true,
        confirmButtonColor: "#3aa959",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const currentIncubator = this.$store.state.incubator.currentIncubator;
          const data = {
            incubator: {
              id: currentIncubator.docId,
              name: currentIncubator.name,
              email: currentIncubator.email,
            },
            startup: { id: id, name: name, email: email },
            // [this.currentUser.role]: { id: this.currentUser.docId, name: this.currentUser.name },
            createdAt: new Date(),
            requestedBy: this.currentUser.role,
          };

          const activity = {
            createdAt: new Date(),
            incubatorId: this.$store.state.incubator.currentIncubator.docId,
            notification: true,
            type: this.currentUser.role,
            statement: `${this.currentUser.role} ${this.$store.state.user.currentUser.name} have requested for a new connection with startup ${name}.`,
            photoURL: this.$store.state.user.currentUser.photoURL,
            read: false,
          };

          // const _activity = {
          //   createdAt: new Date(),
          //   incubatorId: this.$store.state.incubator.currentIncubator.docId,
          //   notification: true,
          //   type: "mentor",
          //   startupId: id,
          //   onlyStartup: true,
          //   statement: `Mentor ${this.$store.state.user.currentUser.name} requested to connect with you.`,
          //   photoURL: this.$store.state.user.currentUser.photoURL,
          //   read: false,
          // };

          try {
            await internalConnectionsRef.add(data);
            await activityRef.add(activity);
            // await activityRef.add(_activity);
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
    raiseConcern(id, name) {
      this.startup = {
        id: id,
        name: name,
      };
      this.concernDialog = true;
    },
    async prepareFilters() {
      const incubatorId = this.$store.state.incubator.currentIncubator.docId;
      this.filters.sector = await getSectors(incubatorId);
      this.filters.stage = await getStages(incubatorId);
      this.filter.mentorsAssociated = await getMentorsAssociated(incubatorId);
      const query = this.$route.query;
      if (query.sub !== undefined) {
        const data = [];
        const sub = query.sub;
        for (let index = 0; index < this.startups.length; index++) {
          const element = this.startups[index];
          const id = element.facultyOrStudentId;
          if (id !== null && id !== undefined && id !== "") {
            const facultyId = id.toUpperCase().substring(0, 2);
            if (sub === facultyId) {
              data.push(element);
            }
          }
        }
        this.filteredData = data;
      } else {
        this.filteredData = this.startups;
      }
      this.handleFormat();
    },
    handleFormat() {
      this.startups.forEach((startup) => {
        startup.cohortMonth = startup.cohort?.name;
        startup.cohortYear = startup.cohort?.year;
        startup.stage = startup.progress?.currentStage;
        startup._mentorsAssociated = startup.mentorsAssociated;
        startup.mentorsAssociated = startup?.mentorsAssociated
          ? startup.mentorsAssociated.map((mentor) => mentor.id)
          : null;
      });
      this.skeletonLoader = false;
    },
    async handleFilters() {
      const splitCohorts = this.formattedMonthAndYear.map((v) => v.split(" "));
      this.activeFilters.cohortMonth = [
        ...new Set(splitCohorts.map((v) => v[0])),
      ];
      this.activeFilters.cohortYear = [
        ...new Set(splitCohorts.map((v) => +v[1])),
      ];
      this.modal = false;
    },
    async filterByStatus() {
      const status = this.$route.query.status;
      if (status === null || status === "") {
        await startupsRef
          .where(
            "incubatorId",
            "==",
            this.$store.state.incubator.currentIncubator.docId
          )
          .where("isDeleted", "==", false)
          .where("status", "==", "active")
          .orderBy("cohort.year", "desc")
          .orderBy("cohort.name")
          .onSnapshot((snapshot) => {
            this.startups = [];
            snapshot.forEach((document) => {
              if (document.exists) {
                this.startups.push(document.data());
              }
            });
            this.prepareCohortNames();
            this.prepareJsonToExcelData();
          });
      } else if (status === "all" || status === undefined) {
        await startupsRef
          .where(
            "incubatorId",
            "==",
            this.$store.state.incubator.currentIncubator.docId
          )
          .where("isDeleted", "==", false)
          .orderBy("cohort.year", "desc")
          .orderBy("cohort.name")
          .onSnapshot((snapshot) => {
            this.startups = [];
            snapshot.forEach((document) => {
              if (document.exists) {
                this.startups.push(document.data());
              }
            });
            const sortedStartups = [];
            sortedStartups.push(this.getStartupsByStatus("active"));
            sortedStartups.push(this.getStartupsByStatus("graduated"));
            sortedStartups.push(this.getStartupsByStatus("droppedout"));
            this.startups = sortedStartups.flat();

            this.prepareCohortNames();
            this.prepareJsonToExcelData();
            if (this.$store.state.user.currentUser.role === "accountant")
              this.updateFunding();
          });
      } else {
        await startupsRef
          .where(
            "incubatorId",
            "==",
            this.$store.state.incubator.currentIncubator.docId
          )
          .where("isDeleted", "==", false)
          .where("status", "==", status)
          .orderBy("cohort.year", "desc")
          .onSnapshot((snapshot) => {
            this.startups = [];
            snapshot.forEach((document) => {
              if (document.exists) {
                this.startups.push(document.data());
              }
            });
            this.prepareCohortNames();
            this.prepareJsonToExcelData();
          });
      }
    },
    copyToClipboard(text) {
      if (
        text === "" ||
        text === null ||
        text === undefined ||
        text === "NA" ||
        text === "N/A" ||
        text === "No website"
      ) {
        this.$toast.warning("No data to copy.", {
          position: "top",
        });
        return;
      }
      copy(text);
      this.$toast.success(`Copied ${text} to clipboard.`, {
        position: "top",
      });
    },
    async updateFunding() {
      this.startups.forEach(async (startup) => {
        startup._funding = await this.getFundings(startup.docId);
      });
      this.$forceUpdate();
    },
    getStartupsByStatus(status) {
      return this.startups.filter((startup) => startup.status === status);
    },
  },
  async created() {
    const role = this.$store.state.user.currentUser.role;
    console.log(`current user role is ${role}`);
    this.updateHeaders(role);
    if (role === "mentor" || role === "startup" || role === "accountant") {
      if (this.mentorId !== undefined) {
        const startupIds = this.$store.state.user.currentUser.startupsAssociated.map(
          (startup) => startup.id
        );
        for (let id of startupIds) {
          const data = await getStartupById(id);
          if (data.status !== "droppedout") this.startups.push(data);
        }
        this.filterByStatus();
      } else {
        await startupsRef
          .where(
            "incubatorId",
            "==",
            this.$store.state.incubator.currentIncubator.docId
          )
          .where("isDeleted", "==", false)
          .orderBy("cohort.year", "desc")
          .orderBy("cohort.name")
          .onSnapshot((snapshot) => {
            this.startups = [];
            snapshot.forEach((document) => {
              if (document.exists) {
                this.startups.push(document.data());
              }
            });
            this.filterByStatus();
          });
      }
    }

    if (role === "incubator") {
      this.filterByStatus();
    }

    if (role === "accountant") {
      this.filterByStatus();
    }
  },
};
</script>

<style scoped>
.v-list--dense .v-list-item,
.v-list-item--dense {
  min-height: 20px !important;
  height: 2rem;
}

.heading {
  color: #4d4d4d;
  font-weight: 500;
}

.v-application--is-ltr .v-list-item__action:first-child,
.v-application--is-ltr .v-list-item__icon:first-child {
  margin-right: 0.5rem !important;
}

img {
  cursor: pointer;
}

.logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.v-btn {
  font-size: 12px;
  text-transform: capitalize;
  font-weight: bold;
}

>>> .v-data-table-header th.sortable {
  padding: 0px !important;
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
  font-size: 16px !important;
  font-weight: bold !important;
}

>>> td {
  font-weight: bold !important;
  font-size: 14px !important;
  font-weight: bold !important;
  color: #4f4f4f;
}

.card {
  border-radius: 10px !important;
}

.v-toolbar__title {
  font-size: 28px !important;
  font-weight: bold;
}

.status__chip {
  max-width: 15px;
  width: 15px !important;
  height: 15px !important;
  border-radius: 50% !important;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0;
  position: absolute;
  margin-left: 70px;
  margin-top: -20px;
  font-size: 10px !important;
}

>>> tr {
  box-shadow: 0px 0px 21.6294px rgba(219, 219, 219, 0.32);
  background: #ffffff;
  border: 1px solid #dbdbdb;
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem 0;
}

>>> .v-chip {
  background-color: #f5f5f5 !important;
  cursor: pointer;
  height: 28px !important;
  font-size: 12px !important;
}

@media only screen and (max-width: 600px) {
  .empty__col {
    display: none;
  }

  .status__chip {
    margin-top: -25px;
  }

  >>> .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    position: relative;
  }

  .startups__list {
    margin-bottom: 10%;
  }
}
</style>
