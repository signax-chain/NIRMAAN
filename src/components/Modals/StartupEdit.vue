<template>
  <v-row justify="center">
    <v-dialog v-model="StartupEditModal.isShowing" width="800">
      <vue-scroll>
        <v-card>
          <v-card-title class="heading">
            <v-spacer></v-spacer>
            <v-btn
              text
              class="ml-auto"
              @click="StartupEditModal.isShowing = false"
              color="red"
              >close</v-btn
            >
            <v-btn
              class="white--text mx-auto"
              color="traktor"
              @click="update()"
            >
              Update
            </v-btn>
          </v-card-title>
          <v-card-text>
            <img
              :src="StartupEditModal.basicDetails.photoURL"
              :alt="StartupEditModal.basicDetails.name"
              width="100px"
            />
            <span class="pa-auto mt-2 change__image" @click="$refs.file.click()"
              >Change picture</span
            >
            <input type="file" class="d-none" ref="file" @change="changeLogo" />
            <v-form class="mt-5">
              <v-row>
                <v-col cols="12" md="6">
                  <label>Name of the startup</label>
                  <v-text-field
                    dense
                    v-model="StartupEditModal.basicDetails.name"
                    @blur="handleNameChange"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <label>Mentors</label>
                  <v-autocomplete
                    multiple
                    :items="mentors"
                    item-text="name"
                    dense
                    v-model="StartupEditModal.basicDetails.mentorsAssociated"
                    return-object
                  ></v-autocomplete>
                </v-col>
                <!-- <v-col cols="12" md="6">
                  <label>Sector Categoty</label>
                  <v-autocomplete
                    :items="sectorsCategories"
                    dense
                    v-model="StartupEditModal.basicDetails.sectorsCategory"
                  ></v-autocomplete>
                </v-col> -->
                <v-col cols="12" md="6">
                  <label>Sector</label>
                  <v-autocomplete
                    :items="sectors"
                    dense
                    v-model="StartupEditModal.basicDetails.sector"
                    @change="handleSector"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6">
                  <label>Startup Type</label>
                  <v-autocomplete
                    v-model="StartupEditModal.basicDetails.startup_type"
                    :items="startupTypes"
                    dense
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6">
                  <label>Industry</label>
                  <v-autocomplete
                    v-model="StartupEditModal.basicDetails.startup_industry"
                    :items="startupIndustries"
                    dense
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6">
                  <label>Technology</label>
                  <v-autocomplete
                    v-model="StartupEditModal.basicDetails.startup_technology"
                    :items="startupTechnologies"
                    dense
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6">
                  <label>Website</label>
                  <v-text-field
                    dense
                    v-model="StartupEditModal.basicDetails.socialLinks.website"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <label>Contact Number</label>
                  <v-text-field
                    dense
                    v-model="StartupEditModal.basicDetails.phoneNumber"
                    @keypress="filterInput"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <label>Email ID</label>
                  <v-text-field
                    dense
                    v-model="StartupEditModal.basicDetails.email"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <label>Cohort</label>
                  <v-dialog
                    ref="dialog"
                    v-model="modal"
                    :return-value.sync="date"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :value="formattedMonthAndYear"
                        dense
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
                      <v-btn
                        text
                        color="traktor"
                        @click="handleCohortMonthAndYear"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                  <!-- <label>Cohort (Name)</label>
                  <v-autocomplete
                    :items="cohortnames"
                    dense
                    v-model="StartupEditModal.basicDetails.cohort.name"
                    @change="handleCohortName"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6">
                  <label>Cohort (Year)</label>
                  <v-autocomplete
                    :items="cohortyears"
                    dense
                    v-model="StartupEditModal.basicDetails.cohort.year"
                  ></v-autocomplete> -->
                </v-col>
                <v-col cols="12" md="6">
                  <label>Status</label>
                  <v-row>
                    <v-col cols="12" md="10">
                      <v-select
                        :items="status"
                        v-model="StartupEditModal.basicDetails.status"
                        item-text="value"
                        item-value="key"
                        dense
                        @change="handleStatus"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            @click="
                              handleStatus(StartupEditModal.basicDetails.status)
                            "
                            v-bind="attrs"
                            v-on="on"
                            color="traktor"
                            dark
                            outlined
                            icon
                            v-if="
                              StartupEditModal.basicDetails.status ===
                                'droppedout' ||
                              StartupEditModal.basicDetails.status ===
                                'graduated'
                            "
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                        <span>Edit Reason</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <!-- {{ StartupEditModal.basicDetails.status }} -->
                </v-col>
                <v-col cols="12" md="6">
                  <label>CIN/Registration Number</label>
                  <v-text-field
                    dense
                    v-model="StartupEditModal.basicDetails.cinNumber"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <label>LinkedIn Profile</label>
                  <v-text-field
                    dense
                    v-model="StartupEditModal.basicDetails.socialLinks.linkedIn"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <label>In Nirmaan since</label>
                  <v-text-field
                    dense
                    v-model="StartupEditModal.basicDetails.since"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                  <label>About the startup</label>
                  <v-textarea
                    v-model="StartupEditModal.basicDetails.description"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </vue-scroll>
    </v-dialog>
    <AddNewSector
      :visible="addNewSectorModal"
      @close="addNewSectorModal = false"
      @addNewSector="addNewSector"
    />
    <AddNewCohortName
      :visible="addNewCohortModal"
      @close="closeAddNewCohortModal"
      @addCohortName="addCohortName"
    />
    <status-reason
      :visible="statusReasonDialog"
      :status="selectedStatus"
      @close="handleStatusReasonClose"
      @save="handleStatusReasonSave"
    ></status-reason>
  </v-row>
</template>
<script>
import { mapState } from "vuex";
import { mentorsRef, startupsRef } from "../../config/firebase_services";
import AddNewSector from "../Modals/addNew/Sector";
import AddNewCohortName from "../Modals/addNew/CohortName";
import { uploadFile } from "../../_helpers/FileUpload";
import { validateLogoType } from "../../_helpers/checkLogoType";
import { setCohortNames } from "../../services/dynamics";
import StatusReason from "./Startup/StatusReason.vue";
import moment from "moment";
import activity from "../../mixins/activity";

export default {
  name: "StartupEditModal",
  components: {
    AddNewSector,
    AddNewCohortName,
    StatusReason,
  },
  mixins: [activity],
  data() {
    return {
      dialog: false,
      sectors: [
        "Advertising",
        "Aerospace",
        "Agritech",
        "Art",
        "Automotive",
        "AI/ML",
        "AR/VR",
        "Blockchain",
        "Big Data",
        "Clean Technology",
        "Construction",
        "Cloud",
        "Cyber Security",
        "Consulting",
        "Design",
        "Digital Marketing",
        "Ecommerce",
        "Edtech",
        "Energy",
        "Entertainment",
        "Fashion",
        "Fintech",
        "Health and Wellness",
        "Health Tech",
        "Hospitality",
        "Human Resources",
        "Information Technology",
        "Hardware/Internet of Things (IoT)",
        "Life Sciences",
        "Logistics",
        "Manufacturing",
        "Media",
        "Mobile Application",
        "Nonprofits",
        "Platforms",
        "Retail",
        "Sports",
        "Travel",
        "Waste Management",
        "Ventures for Goods",
        "Add new +",
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
      cohortnames: [],
      cohortyears: [
        2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021,
        2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030,
      ],
      status: [
        { key: "active", value: "Active" },
        { key: "graduated", value: "Graduated" },
        { key: "droppedout", value: "Dropped Out" },
      ],
      mentors: [],
      addNewSectorModal: false,
      addNewCohortModal: false,
      statusReasonDialog: false,
      sectorsCategories: ["AL/ML", "AR/VR"],
      selectedStatus: null,
      date: new Date().toISOString().substr(0, 7),
      modal: false,
      oldName: "",
    };
  },
  mounted() {
    this.oldName = this.StartupEditModal.basicDetails.name;
  },
  async created() {
    const documents = await mentorsRef
      .where(
        "incubatorId",
        "==",
        this.$store.state.incubator.currentIncubator.docId
      )
      .where("isDeleted", "==", false)
      .get();
    documents.forEach((document) => {
      const data = document.data();
      if (document.exists) {
        this.mentors.push({ id: data.docId, name: data.name });
      }
    });
    this.prepareCohortNames();
  },
  computed: {
    ...mapState(
      { StartupEditModal: (state) => state.modals.StartupEditModal },
      { currentUser: (state) => state.user.currentUser }
    ),
    formattedMonthAndYear() {
      return this.StartupEditModal.basicDetails.cohort.name
        ? this.StartupEditModal.basicDetails.cohort.name +
            " " +
            this.StartupEditModal.basicDetails.cohort.year
        : "";
    },
  },
  methods: {
    async handleNameChange(e) {
      console.log(this.oldName);
      if (this.StartupEditModal.basicDetails.nameChangeLogs === undefined) {
        this.StartupEditModal.basicDetails.nameChangeLogs = [];
      }

      if (this.oldName !== e.target.value) {
        this.StartupEditModal.basicDetails.nameChangeLogs.push({
          date: new Date().toISOString(),
          newValue: e.target.value,
        });
      }
      await startupsRef
        .doc(this.StartupEditModal.basicDetails.docId)
        .set(this.StartupEditModal.basicDetails, { merge: true });
    },
    handleCohortMonthAndYear() {
      this.$refs.dialog.save(this.date);
      const cohort = moment(this.date).format("MMM YYYY").split(" ");
      this.StartupEditModal.basicDetails.cohort.name = cohort[0];
      this.StartupEditModal.basicDetails.cohort.year = cohort[1];
    },
    prepareCohortNames() {
      this.cohortnames = this.$store.state.dynamics.cohortnames;
    },
    handleCohortName(cohortName) {
      if (cohortName === "Add new +") {
        this.addNewCohortModal = true;
      }
    },
    async addCohortName(cohortName) {
      this.cohortnames
        .splice(this.cohortnames.length - 1, 0, cohortName)
        .join();
      this.StartupEditModal.basicDetails.cohort.name = cohortName;
      this.addNewCohortModal = false;
      this.$store.dispatch("setCohortNames", this.cohortnames);
      await setCohortNames(
        this.$store.state.incubator.currentIncubator.docId,
        this.cohortnames
      );
    },
    closeAddNewCohortModal() {
      this.StartupEditModal.basicDetails.cohort.name = this.cohortnames[0];
      this.addNewCohortModal = false;
    },
    filterInput(e) {
      return e.charCode >= 48 && e.charCode <= 57
        ? e.target.value
        : e.preventDefault();
    },
    async update() {
      try {
        await startupsRef
          .doc(this.StartupEditModal.basicDetails.docId)
          .set(this.StartupEditModal.basicDetails, { merge: true });
        this.StartupEditModal.isShowing = false;
        await this.updateActivity(`has updated their basic details`);
        this.$toast.success("Updated", {
          position: "top",
        });
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
    handleSector(sector) {
      if (sector === "Add new +") {
        this.addNewSectorModal = true;
      }
    },
    addNewSector(sector) {
      this.sectors.push(sector);
      this.StartupEditModal.basicDetails.sector = sector;
      this.addNewSectorModal = false;
    },
    async changeLogo(e) {
      const fileObj = e.target.files[0];
      if (!validateLogoType(fileObj.type)) {
        this.$toast.error(
          "Only jpeg, jpg, png and svg formats are supported!",
          {
            position: "top",
          }
        );
        return;
      }
      const downloadURL = await uploadFile(fileObj, "Logos/startups");
      this.StartupEditModal.basicDetails.photoURL = downloadURL;
      await startupsRef
        .doc(this.StartupEditModal.basicDetails.docId)
        .set({ photoURL: downloadURL }, { merge: true });
      await this.updateActivity(`has updated their logo`);
      this.$toast.success("Updated", {
        position: "top",
      });
    },
    handleStatus(status) {
      if (status === "droppedout" || status === "graduated") {
        this.selectedStatus = status;
        this.statusReasonDialog = true;
      }
    },
    handleStatusReasonClose() {
      this.statusReason = null;
      this.StartupEditModal.basicDetails.status = this.status[0];
      this.statusReasonDialog = false;
    },
    handleStatusReasonSave(reason, description) {
      this.StartupEditModal.basicDetails.statusReason = reason;
      this.StartupEditModal.basicDetails.statusDescription = description;
      this.statusReasonDialog = false;
    },
  },
};
</script>

<style scoped>
>>> .v-dialog:not(.v-dialog--fullscreen) {
  border-radius: 10px !important;
}

img {
  display: block;
  margin: 0 auto;
}

.logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.change__image {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 150px;
  border: 1px solid #3aa959;
  border-radius: 20px;
  text-align: center;
  color: #3aa959;
  cursor: pointer;
}

>>> .v-text-field__details {
  margin-bottom: 0px !important;
  display: none;
}

.v-btn {
  text-transform: capitalize;
}

label {
  margin-left: 10px;
}

.col-md-6 {
  padding-top: 0px !important;
}

>>> .v-dialog {
  /* margin-left: 270px; */
}

>>> .v-input__control {
  border-radius: 10px;
  border: 1px solid #dbdbdb;
  box-shadow: 0px 0px 24px rgba(219, 219, 219, 0.32);
  padding: 5px 5px 5px 10px;
}

>>> .v-text-field > .v-input__control > .v-input__slot:before {
  border-style: none;
}

@media only screen and (max-width: 600px) {
  >>> .v-dialog {
    margin: 24px;
  }
}
</style>