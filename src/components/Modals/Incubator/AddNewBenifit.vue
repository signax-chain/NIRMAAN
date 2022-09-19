<template>
  <v-dialog v-model="show" persistent max-width="600px">
    <v-card>
      <v-card-title class="heading"
        >Add new perk
        <v-spacer></v-spacer>
        <v-btn icon color="red">
          <v-icon @click="show = false">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="mt-3">
        <v-row>
          <v-col cols="12" md="12">
            <v-text-field label="Name" outlined dense></v-text-field>
          </v-col>
          <v-col cols="12" md="12">
            <v-file-input label="Perk Image" outlined dense></v-file-input>
          </v-col>
          <v-col cols="12" md="12">
            <v-textarea label="Description" outlined dense></v-textarea>
          </v-col>
          <v-col cols="12" md="12">
            <v-select
              label="categories"
              :items="categories"
              outlined
              dense
            ></v-select>
          </v-col>
          <v-col cols="12" md="12">
            <v-textarea label="Benifits" outlined dense></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="traktor" dark @click="addPerk">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "BenifitForm",
  props: ["visible"],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) this.$emit("close");
      },
    },
  },
  data() {
    return {
      categories: [
        "Cloud",
        "Design",
        "Developer tools",
        "Domains",
        "Game development",
        "Infrastructure & APIs",
        "Internet of Things",
        "Learn",
        "Marketing",
        "Mobile",
        "Productivity",
        "Security & analytics",
        "Virtual Events",
      ],
    };
  },
};
</script>

<style scoped>
>>> .v-text-field__details {
  margin-bottom: 0px !important;
  display: none;
}

>>> .v-text-field > .v-input__control > .v-input__slot:before {
  border-style: none;
}

.col-md-6 {
  padding-top: 0px !important;
}
</style>