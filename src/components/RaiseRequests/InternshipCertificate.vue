<template>
  <div>
    <v-text-field
      label="Candidate Name"
      outlined
      dense
      v-model="name"
    ></v-text-field>
    <v-text-field
      label="Candidate College/ Organization"
      outlined
      dense
      v-model="organization"
    ></v-text-field>
    <v-select
      label="Select Position"
      outlined
      dense
      :items="jobs"
      item-text="role"
      return-object
      v-model="position"
    ></v-select>
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="dateRangeText"
          label="Internship start and end date"
          readonly
          v-bind="attrs"
          v-on="on"
          outlined
          dense
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="dateRange"
        @input="menu = false"
        range
      ></v-date-picker>
    </v-menu>
  </div>
</template>

<script>
import { getJobPositions } from "../../services/raise-request";

export default {
  props: ["candidateName", "role", "dates", 'college'],
  created() {
    this.getJobs();
  },
  data() {
    return {
      menu: false,
      jobs: [],
    };
  },
  computed: {
    dateRangeText() {
      return this.dates.join(" to ");
    },
    name: {
      get() {
        return this.candidateName;
      },
      set(value) {
        this.$emit("update:candidateName", value);
      },
    },
    organization: {
      get() {
        return this.college;
      },
      set(value) {
        this.$emit("update:college", value);
      },
    },
    position: {
      get() {
        return this.role;
      },
      set(value) {
        this.$emit("update:role", value);
      },
    },
    dateRange: {
      get() {
        return this.dates;
      },
      set(value) {
        this.$emit("update:dates", value);
      },
    },
  },
  methods: {
    async getJobs() {
      this.jobs = await getJobPositions();
    },
  },
};
</script>

<style scoped>
</style>