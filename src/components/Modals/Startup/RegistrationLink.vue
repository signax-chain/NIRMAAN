<template>
  <v-dialog v-model="show" persistent max-width="550">
    <v-card>
      <v-card-title class="headline">
        Select program, cohort to generate the link
      </v-card-title>
      <v-card-text class="mt-5">
        <v-autocomplete
          v-model="regProgram"
          :items="programs"
          outlined
          label="Program"
          dense
          @change="handleProgram"
        ></v-autocomplete>
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
              readonly
              v-bind="attrs"
              v-on="on"
              :value="formattedMonthAndYear"
              outlined
              dense
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" type="month" color="traktor" scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="red" @click="modal = false"> Cancel </v-btn>
            <v-btn text color="traktor" @click="handleCohortMonthAndYear">
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
        <!-- <v-col cols="12" md="6">
            <v-autocomplete
              v-model="regCohortName"
              :items="cohortnames"
              outlined
              label="Cohort name"
              @change="handleCohortName"
              dense
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="regCohortYear"
              :items="cohortyears"
              outlined
              label="Cohort year"
              dense
            ></v-autocomplete>
          </v-col> -->
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="show = false"> Cancel </v-btn>
        <v-btn
          color="green darken-1"
          class="white--text"
          @click="copyToClipboard()"
        >
          Generate and copy
        </v-btn>
      </v-card-actions>
    </v-card>
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
  </v-dialog>
</template>

<script>
import AddNewCohortName from "../addNew/CohortName";
import Program from "../addNew/Program.vue";
import copy from "copy-to-clipboard";
const key = "real secret keys should be long and random";
import { encryptQueryParams } from "query-string-hash";
import { setCohortNames, setPrograms } from "../../../services/dynamics";
import moment from "moment";

export default {
  name: "RegistrationLink",
  components: {
    AddNewCohortName,
    Program,
  },
  props: ["visible"],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) return this.$emit("close");
      },
    },
    formattedMonthAndYear() {
      return this.date ? moment(this.date).format("MMM YYYY") : "";
    },
  },
  data() {
    return {
      programDialog: false,
      addNewCohortModal: false,
      regCohortName: null,
      regCohortYear: null,
      regProgram: null,
      cohortnames: [],
      cohortyears: [
        2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021,
        2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030,
      ],
      programs: [],
      date: new Date().toISOString().substr(0, 7),
      modal: false,
    };
  },
  created() {
    this.prepareCohortNamesAndPrograms();
  },
  methods: {
    handleCohortMonthAndYear() {
      this.$refs.dialog.save(this.date);
      const cohort = moment(this.date).format("MMM YYYY").split(" ");
      this.regCohortName = cohort[0];
      this.regCohortYear = cohort[1];
    },
    copyToClipboard() {
      if (this.regProgram === "" || this.regProgram === null) {
        this.$toast.error("Program cannot be empty!", {
          position: "top",
        });
        return;
      }

      if (this.regCohortName === "" || this.regCohortName === null) {
        this.$toast.error("Cohort Name cannot be empty!", {
          position: "top",
        });
        return;
      }

      if (this.regCohortYear === "" || this.regCohortYear === null) {
        this.$toast.error("Cohort Year cannot be empty!", {
          position: "top",
        });
        return;
      }

      const queryString = `incubatorId=${this.$store.state.incubator.currentIncubator.docId}&&cohortname=${this.regCohortName}&&cohortyear=${this.regCohortYear}&&program=${this.regProgram}`;
      const hash = encryptQueryParams(queryString, key);

      const path = `${location.protocol}//${location.hostname}/startup/new?hash=${hash}`;
      copy(path);
      this.$toast.success("Link copied to clipboard", {
        position: "top",
      });
      this.registrationLinkDialog = false;
    },
    prepareCohortNamesAndPrograms() {
      this.cohortnames = this.$store.state.dynamics.cohortnames;
      this.programs = this.$store.state.dynamics.programs;
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
    handleCohortName(cohortName) {
      if (cohortName === "Add new +") {
        this.addNewCohortModal = true;
      }
    },
    async addNewCohortName(cohortName) {
      this.cohortnames
        .splice(this.cohortnames.length - 1, 0, cohortName)
        .join();
      this.regCohortName = cohortName;
      this.addNewCohortModal = false;
      this.$store.dispatch("setCohortNames", this.cohortnames);
      await setCohortNames(
        this.$store.state.incubator.currentIncubator.docId,
        this.cohortnames
      );
    },
    closeAddNewCohortModal() {
      this.regCohortName = this.cohortnames[0];
      this.addNewCohortModal = false;
    },
  },
};
</script>

<style scoped>
</style>