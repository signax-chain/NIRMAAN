<template>
  <v-container>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <v-row>
      <v-col cols="12" md="4">
        <h3 class="heading">Add new Startup</h3>
      </v-col>
      <v-col cols="12" md="4"></v-col>
      <v-col cols="12" md="4">
        <v-select
          label="Select the program"
          dense
          outlined
          :items="programs"
          v-model="startup.program"
        ></v-select>
      </v-col>
    </v-row>

    <v-card>
      <form-wizard
        @on-complete="onComplete"
        color="#3AA95A"
        title=""
        subtitle=""
        finishButtonText="Submit"
        v-if="startup.program === 'Nirmaan' || startup.program === null"
      >
        <tab-content title="Basic" icon="ti-info-alt">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                outlined
                label="Name of the startup"
                dense
                v-model="startup.name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                outlined
                label="Sector"
                dense
                v-model="startup.sector"
                :items="sectors"
                @change="handleSector"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                label="Startup Type"
                v-model="startup.startup_type"
                :items="startupTypes"
                outlined
                dense
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                label="Startup Industry"
                v-model="startup.startup_industry"
                :items="startupIndustries"
                outlined
                dense
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                label="Startup Technology"
                v-model="startup.startup_technology"
                :items="startupTechnologies"
                outlined
                dense
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                outlined
                label="Program"
                dense
                v-model="startup.program"
                :disabled="$route.query.hash !== undefined"
                :items="programs"
                @change="handleProgram"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-dialog
                ref="dialog"
                v-model="modal"
                :return-value.sync="date"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    label="Cohort"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :value="formattedMonthAndYear"
                    outlined
                    dense
                    :disabled="$route.query.hash !== undefined"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  type="month"
                  color="traktor"
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="red" @click="modal = false">
                    Cancel
                  </v-btn>
                  <v-btn text color="traktor" @click="$refs.dialog.save(date)">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>
            <!-- <v-col cols="12" md="4">
              <v-autocomplete
                outlined
                label="Cohort (Name)"
                dense
                v-model="startup.cohort.name"
                :disabled="$route.query.hash !== undefined"
                :items="cohortnames"
                @change="handleCohortName"
              ></v-autocomplete>
            </v-col> -->
            <!-- <v-col cols="12" md="4">
              <v-autocomplete
                outlined
                label="Cohort (Year)"
                dense
                v-model="startup.cohort.year"
                :disabled="$route.query.hash !== undefined"
                :items="cohortyears"
              ></v-autocomplete>
            </v-col> -->
          </v-row>
        </tab-content>
        <tab-content title="Official" icon="ti-settings">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                outlined
                label="Official Contact Number"
                dense
                v-model="startup.phoneNumber"
                @keypress="filterInput"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                outlined
                label="Official Email Address"
                type="email"
                dense
                v-model="startup.email"
                :rules="[(v) => /.+@.+\..+/.test(v) || 'E-mail must be valid']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                outlined
                label="Website link"
                dense
                v-model="startup.socialLinks.website"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                outlined
                label="LinkedIn ID"
                dense
                v-model="startup.socialLinks.linkedIn"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                outlined
                label="Mentor Associated"
                dense
                multiple
                v-model="selectedMentors"
                :items="mentors"
                item-text="name"
              ></v-autocomplete>
            </v-col>
            <!-- <v-col cols="12" md="6">
              <v-text-field
                outlined
                label="Student /Faculty ID"
                dense
                v-model="startup.facultyOrStudentId"
              ></v-text-field>
            </v-col> -->
            <v-col cols="12" md="6">
              <v-text-field
                outlined
                label="CIN/ Registration Number"
                dense
                v-model="startup.cinNumber"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                outlined
                label="Password"
                dense
                v-model="password"
              ></v-text-field>
            </v-col>
          </v-row>
        </tab-content>
        <tab-content title="Founder" icon="ti-direction-alt">
          <v-row v-for="(founder, index) in startup.founders" :key="index">
            <v-col cols="12" md="2">
              <v-text-field
                outlined
                label="Name"
                dense
                v-model="founder.name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                outlined
                label="Email"
                dense
                type="email"
                v-model="founder.email"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                outlined
                label="Number"
                dense
                v-model="founder.phoneNumber"
                @keypress="filterInput"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                label="Gender"
                :items="gender"
                v-model="founder.gender"
                outlined
                dense
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                outlined
                label="Student ID"
                dense
                v-model="founder.studentId"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                outlined
                label="LinkedIn"
                dense
                v-model="founder.linkedIn"
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="1"
              v-if="startup.founders.length - 1 === index"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on"
                    ><v-icon color="traktor" @click="addFounder()"
                      >mdi-plus-circle</v-icon
                    ></v-btn
                  >
                </template>
                <span>Add new founder</span>
              </v-tooltip>
            </v-col>
            <v-col cols="12" md="1" v-if="startup.founders.length - 1 >= 1">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on"
                    ><v-icon color="red" @click="deleteFounder(index)"
                      >mdi-delete</v-icon
                    ></v-btn
                  >
                </template>
                <span>Delete founder</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </tab-content>
        <tab-content title="Description" icon="ti-comments">
          <v-row>
            <v-col cols="12" md="2">
              <v-img :src="startup.photoURL" class="logo"></v-img>
            </v-col>
            <v-col cols="12" md="6">
              <v-file-input
                @change="preview()"
                v-model="image"
                label="Choose logo"
                outlined
              >
              </v-file-input>
            </v-col>
            <v-col cols="12" md="12">
              <v-textarea
                label="Description"
                outlined
                v-model="startup.description"
              ></v-textarea>
            </v-col>
          </v-row>
        </tab-content>
      </form-wizard>
      <KGMG v-if="startup.program === 'KGMG'"></KGMG>
      <UGFIR v-if="startup.program === 'UGFIR'"></UGFIR>
      <SIP v-if="startup.program === 'SIP'"></SIP>
    </v-card>
    <v-dialog v-model="addNewDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline"> Add new </v-card-title>
        <v-card-text>
          <v-text-field
            outlined
            label="Add new"
            v-model="addNewValue"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="addNewDialog = false">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="add()"> Add </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <StartupBulkAdd
      v-if="currentUser !== null && typeof currentUser === 'object'"
    />
    <sector
      :visible="addNewSectorModal"
      @close="closeAddNewSectorModal"
      @addNewSector="addNewSector"
    ></sector>
    <AddNewCohortName
      :visible="addNewCohortModal"
      @close="closeAddNewCohortModal"
      @addNewCohortName="addNewCohortName"
    />
    <program
      :visible="programDialog"
      @close="closeAddNewProgramModal"
      @addNewProgram="addNewProgram"
    ></program>
  </v-container>
</template>

<script>
import StartupBulkAdd from "./StartupBulkAdd";
import { mapState } from "vuex";
import {
  auth,
  mentorsRef,
  startupsRef,
  activityRef,
  incubatorsRef,
} from "../../config/firebase_services";
import { uploadFile } from "../../_helpers/FileUpload";
import { validateLogoType } from "../../_helpers/checkLogoType";

const key = "real secret keys should be long and random";
import { decryptQueryParams } from "query-string-hash";
import Sector from "../Modals/addNew/Sector.vue";
import {
  setCohortNames,
  setPrograms,
  getCohortNames,
  getPrograms,
} from "../../services/dynamics";
import AddNewCohortName from "../Modals/addNew/CohortName";
import Program from "../Modals/addNew/Program.vue";
import moment from "moment";
import KGMG from "./Programs/KGMG.vue";
import UGFIR from "./Programs/UGFIR.vue";
import SIP from "./Programs/SIP.vue";

export default {
  name: "AddNewStartup",
  components: {
    StartupBulkAdd,
    Sector,
    AddNewCohortName,
    Program,
    KGMG,
    UGFIR,
    SIP,
  },
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
    formattedMonthAndYear() {
      return this.date ? moment(this.date).format("MMM YYYY") : "";
    },
  },
  data() {
    return {
      password: null,
      addNewDialog: false,
      addNewValue: null,
      startup: {
        docId: null,
        name: null,
        // facultyOrStudentId: null,
        cinNumber: null,
        cohort: {
          name: null,
          year: null,
        },
        program: null,
        description: null,
        email: null,
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Logos%2Fstartups%2Fnoun_startup_1561106%20(1).png?alt=media&token=c293be6c-8f57-46d8-a38b-c5eb248259d4",
        incubatorId: null,
        mentorsAssociated: [],
        phoneNumber: null,
        sector: null,
        startup_type: null,
        startup_industry: null,
        startup_technology: null,
        status: "active",
        stage: null,
        socialLinks: {
          linkedIn: "",
          website: "",
        },
        founders: [
          {
            name: null,
            email: null,
            phoneNumber: null,
            gender: null,
            linkedIn: null,
            studentId: "",
            photoURL: null,
          },
        ],
        awards: [],
        fundings: [],
        isDeleted: false,
        createdAt: null,
        lastLogin: null,
      },
      image: null,
      selectedMentors: [],
      mentors: [],
      sectors: [],
      cohortnames: [],
      cohortyears: [
        2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021,
        2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030,
      ],
      programs: [],
      gender: ["Male", "Female", "Others"],
      addNewSectorModal: false,
      programDialog: false,
      addNewCohortModal: false,
      currentIncubator: null,
      date: new Date().toISOString().substr(0, 7),
      modal: false,
      crumbs: [
        {
          text: "Startups",
          disabled: true,
          href: "",
        },
        {
          text: "Add new startup",
          disabled: true,
        },
      ],
      startupTypes: ["Hardware", "Software", "Hybrid", "Service"],
      startupIndustries: [
        "Aerospace & Drones Applications",
        "Agriculture & Allied Industries",
        "Apparels, Fashion & Personal Gadgets",
        "Arts, Culture & Traditions",
        "Automobiles & Self-Driving Assistances",
        "Banking, Finance Services & Insurance (BFSI)",
        "Central & State Government Agencies",
        "Defense & Security Systems",
        "E-Commerce Platform",
        "Education & Research",
        "Health, Wellness & Allied Industries",
        "Human Resources Management",
        "Logistics & Transportation",
        "Manufacturing & Processing",
        "Marketing, Social Media & Sales",
        "Space Exploration Satellite ",
        "Others",
      ],
      startupTechnologies: [
        "3D Printing & Fabrication",
        "App Development",
        "Artificial Intelligence (AI) & Machine Learning (ML)",
        "Augmented Reality (AR) & Virtual Reality (VR)",
        "BioMimicry Applications",
        "Blockchain",
        "Deep Technology (Anything with a deep technical expertise)",
        "Internet of Things (IoT)",
        "Others",
      ],
    };
  },
  async created() {
    const hash = this.$route.query.hash;
    if (hash !== undefined) {
      const queryString = decryptQueryParams(this.$route.query.hash, key);
      await getCohortNames(queryString.incubatorId);
      await getPrograms(queryString.incubatorId);
      this.startup.incubatorId = queryString.incubatorId;
      this.date = moment(
        `${queryString.cohortname}' '${queryString.cohortyear}`
      ).format("YYYY-MM");
      this.startup.cohort.name = queryString.cohortname;
      this.startup.cohort.year = parseInt(queryString.cohortyear);
      this.startup.program = queryString.program;
      const document = await incubatorsRef.doc(this.startup.incubatorId).get();
      this.currentIncubator = document.data();
    } else {
      this.password = "nirmaan";
      this.startup.incubatorId = this.$store.state.user.currentUser.docId;
      this.currentIncubator = this.$store.state.incubator.currentIncubator;
    }

    const documents = await mentorsRef
      .where("incubatorId", "==", this.startup.incubatorId)
      .get();
    documents.forEach((document) => {
      const data = document.data();
      if (document.exists) {
        this.mentors.push({ id: data.docId, name: data.name });
      }
    });
    this.setCohortAndPrograms();
  },
  methods: {
    handleSector(sector) {
      if (sector === "Add new +") {
        this.addNewSectorModal = true;
      }
    },
    closeAddNewSectorModal() {
      this.startup.sector = this.sectors[0];
      this.addNewSectorModal = false;
    },
    setCohortAndPrograms() {
      this.cohortnames = this.$store.state.dynamics.cohortnames;
      this.programs = this.$store.state.dynamics.programs;
      this.sectors = this.$store.state.dynamics.sectors;
    },
    addNewSector(sector) {
      this.sectors.splice(this.sectors.length - 1, 0, sector);
      this.startup.sector = sector;
      this.addNewSectorModal = false;
    },
    handleProgram(program) {
      if (program === "Add new +") {
        this.programDialog = true;
      }
    },
    async addNewProgram(program) {
      this.programs.splice(this.programs.length - 1, 0, program).join();
      this.startup.program = program;
      this.programDialog = false;
      this.$store.dispatch("setPrograms", this.programs);
      await setPrograms(
        this.$store.state.incubator.currentIncubator.docId,
        this.programs
      );
    },
    closeAddNewProgramModal() {
      this.startup.program = this.programs[0];
      this.programDialog = false;
    },
    handleCohortName(cohortName) {
      if (cohortName === "Add new +") {
        this.addNewCohortModal = true;
      }
    },
    async addNewCohortName(cohortName) {
      this.cohortnames
        .splice(this.cohortnames.length - 1, 0, cohortName)
        .join();
      this.startup.cohort.name = cohortName;
      this.addNewCohortModal = false;
      this.$store.dispatch("setCohortNames", this.cohortnames);
      await setCohortNames(
        this.$store.state.incubator.currentIncubator.docId,
        this.cohortnames
      );
    },
    closeAddNewCohortModal() {
      this.startup.cohort.name = this.cohortnames[0];
      this.addNewCohortModal = false;
    },
    filterInput(e) {
      return e.charCode >= 48 && e.charCode <= 57
        ? e.target.value
        : e.preventDefault();
    },
    onComplete: function () {
      if (this.startup.name === null || this.startup.name === "") {
        this.$store.dispatch("SHOW_SNACKBAR", {
          showing: true,
          text: "Startup name cannot be empty!",
          color: "error",
        });
        return;
      }

      if (this.startup.email === null || this.startup.email === "") {
        this.$store.dispatch("SHOW_SNACKBAR", {
          showing: true,
          text: "Email cannot be empty!",
          color: "error",
        });
        return;
      }

      if (this.startup.program === null || this.startup.program === "") {
        this.$store.dispatch("SHOW_SNACKBAR", {
          showing: true,
          text: "Program cannot be empty!",
          color: "error",
        });
        return;
      }

      if (
        this.startup.phoneNumber === null ||
        this.startup.phoneNumber === ""
      ) {
        this.$store.dispatch("SHOW_SNACKBAR", {
          showing: true,
          text: "Mobile number cannot be empty!",
          color: "error",
        });
        return;
      }

      if (this.password === null || this.password.length < 6) {
        this.$store.dispatch("SHOW_SNACKBAR", {
          showing: true,
          text: "Password must be 6 characters long!",
          color: "error",
        });
        return;
      }

      if (
        this.startup.description === null ||
        this.startup.description === ""
      ) {
        this.$store.dispatch("SHOW_SNACKBAR", {
          showing: true,
          text: "Description cannot be empty!",
          color: "error",
        });
        return;
      }

      const cohort = moment(this.date).format("MMM YYYY").split(" ");
      this.startup.cohort.name = cohort[0];
      this.startup.cohort.year = +cohort[1];

      this.$store.dispatch("SHOW_LOADER", { isShowing: true });
      this.startup.createdAt = new Date();
      this.startup.password = this.password;
      this.selectedMentors.forEach((sm) => {
        const obj = this.mentors.find((mentor) => mentor.name === sm);
        this.startup.mentorsAssociated.push(obj);
      });

      auth
        .createUserWithEmailAndPassword(
          this.startup.email.trim(),
          this.password
        )
        .then(async (user) => {
          this.startup.docId = user.user.uid;

          if (typeof this.image === "object" && this.image !== null) {
            this.startup.photoURL = await uploadFile(
              this.image,
              "Logos/startups"
            );

            await startupsRef.doc(this.startup.docId).set(this.startup);

            const activity = {
              incubatorId: this.startup.incubatorId,
              statement: `Startup ${this.startup.name} joined ${this.currentIncubator.name} on ${this.startup.createdAt}`,
              startup: this.startup,
              createdAt: new Date(),
              type: "startup",
              notification: false,
              photoURL: this.startup.photoURL,
            };

            await activityRef.add(activity);

            this.$store.dispatch("SHOW_LOADER", { isShowing: false });
            this.$store.dispatch("SHOW_SNACKBAR", {
              showing: true,
              text: "Registration successful",
              color: "success",
            });
            // window.location.reload();
            this.$router.push("/startups");
          } else {
            await startupsRef.doc(this.startup.docId).set(this.startup);

            const activity = {
              incubatorId: this.startup.incubatorId,
              statement: `Startup ${this.startup.name} joined ${this.currentIncubator.name} on ${this.startup.createdAt}`,
              startup: this.startup,
              createdAt: new Date(),
              type: "startup",
              notification: false,
              photoURL: this.startup.photoURL,
            };

            await activityRef.add(activity);

            this.$store.dispatch("SHOW_LOADER", { isShowing: false });
            this.$store.dispatch("SHOW_SNACKBAR", {
              showing: true,
              text: "Registration successful",
              color: "success",
            });
            // window.location.reload();
            this.$router.push("/startups");
          }
        })
        .catch((error) => {
          this.$store.dispatch("SHOW_LOADER", { isShowing: false });
          this.$store.dispatch("SHOW_SNACKBAR", {
            showing: true,
            text: error.message,
            color: "error",
          });
        });
    },
    addFounder() {
      this.startup.founders.push({
        name: "",
        email: "",
        phoneNumber: "",
        linkedIn: "",
        photoURL: "",
      });
    },
    deleteFounder(index) {
      this.startup.founders.splice(index, 1);
    },
    preview() {
      if (!validateLogoType(this.image.type)) {
        this.$toast.error(
          "Only jpeg, jpg, png and svg formats are supported!",
          {
            position: "top",
          }
        );
        this.image = null;
        this.startup.photoURL = this.$defaultStartupPhotoURL;
        return;
      }
      this.startup.photoURL = URL.createObjectURL(this.image);
    },
  },
};
</script>

<style scoped>
.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}

.top__header {
  background: #3aa95a;
  height: 60px;
  width: 100%;
  margin: 0 auto;
  border-radius: 20px;
  margin-bottom: 25px;
}

.logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.v-card {
  border-radius: 15px !important;
}

>>> .vue-form-wizard .wizard-title {
  font-weight: bold !important;
  font-size: 20px !important;
}
</style>
