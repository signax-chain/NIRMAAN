<template>
  <form-wizard color="#3AA95A" title="" subtitle="" finishButtonText="Submit">
    <tab-content
      title="Details of PI( Pricipanl Investigator)"
      icon="ti-info-alt"
    >
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
        <v-col cols="12" md="6">
          <v-text-field outlined dense label="Department"></v-text-field>
        </v-col>
      </v-row>
    </tab-content>
    <tab-content title="Team details" icon="ti-info-alt">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            outlined
            dense
            label="Name and other details of CO-PI"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            outlined
            dense
            label="Name of faculty guide"
          ></v-text-field>
        </v-col>
      </v-row>
    </tab-content>
    <tab-content title="Patents" icon="ti-settings">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field outlined dense label="IP Number"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field outlined dense label="Patent tile"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            outlined
            dense
            label="Number of patents(provisional or actual)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field outlined dense label="journal name"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field outlined dense label="Auther name"></v-text-field>
        </v-col>
      </v-row>
    </tab-content>
    <tab-content title="Documents" icon="ti-settings">
      <v-row>
        <v-col cols="12" md="6">
          <v-file-input outlined dense label="SIP offer letter"></v-file-input>
        </v-col>
        <v-col cols="12" md="6">
          <v-file-input outlined dense label="Thesis pitch"></v-file-input>
        </v-col>
        <v-col cols="12" md="6">
          <v-file-input outlined dense label="Project pitch"></v-file-input>
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
  name: "SIP",
  data() {
    return {
      associatedWith: ["Nirmaan", "SIP"],
    };
  },
};
</script>

<style>
</style>