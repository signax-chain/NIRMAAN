<template>
  <form-wizard color="#3AA95A" title="" subtitle="" finishButtonText="Submit">
    <tab-content title="Basic" icon="ti-info-alt">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field outlined dense label="Name"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field outlined dense label="Student ID"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field outlined dense label="Email ID"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            outlined
            dense
            label="Alternate Email ID"
          ></v-text-field>
        </v-col>
      </v-row>
    </tab-content>
    <tab-content title="Official" icon="ti-info-alt">
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            outlined
            dense
            label="Associated with"
            :items="associatedWith"
          ></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field outlined dense label="Department"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            outlined
            dense
            label="Date of joining for KGMG program"
          ></v-text-field>
        </v-col>
      </v-row>
    </tab-content>
    <tab-content title="Official" icon="ti-settings">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field outlined dense label="Tenure"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field outlined dense label="Project idea"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field outlined dense label="Brief description"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-file-input outlined dense label="Offer letter"></v-file-input>
        </v-col>
      </v-row>
    </tab-content>
    <tab-content title="Documents" icon="ti-settings">
      <v-row>
        <v-col cols="12" md="6">
          <v-file-input
            outlined
            dense
            label="Project recruitment letter from ICSR"
          ></v-file-input>
        </v-col>
        <v-col cols="12" md="6">
          <v-file-input outlined dense label="Projecr pitch"></v-file-input>
        </v-col>
        <v-col cols="12" md="6">
          <v-file-input
            outlined
            dense
            label="Progress review template"
          ></v-file-input>
        </v-col>
      </v-row>
    </tab-content>
  </form-wizard>
</template>

<script>
export default {
  name: "UGFIR",
  data() {
    return {
      associatedWith: ["Nirmaan", "CFI"],
    };
  },
};
</script>

<style>
</style>