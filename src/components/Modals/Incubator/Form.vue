<template>
  <v-dialog v-model="show" persistent max-width="800px">
    <v-card>
      <v-card-title class="heading"
        >Add new Incubator
        <v-spacer></v-spacer>
        <v-btn icon color="red">
          <v-icon @click="show = false">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="mt-3">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field label="Name" outlined dense></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="Institution type"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Sector" outlined dense></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Email" outlined dense></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Contact number" outlined dense></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Website" outlined dense></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Linked In" outlined dense></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="CEO name" outlined dense></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="CEO email" outlined dense></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="CEO Contact number"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              label="Select region"
              outlined
              dense
            ></v-select>
          </v-col>
          <v-col cols="12" md="12">
            <v-textarea label="Description" outlined dense></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="traktor" dark @click="addIncubator">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "IncubatorForm",
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
};
</script>

<style scoped>
>>> .v-text-field__details {
  margin-bottom: 0px !important;
  display: none;
}

/* >>> .v-input__control {
  border-radius: 10px;
  border: 1px solid #dbdbdb;
  box-shadow: 0px 0px 24px rgba(219, 219, 219, 0.32);
  padding: 5px 5px 5px 10px;
} */

>>> .v-text-field > .v-input__control > .v-input__slot:before {
  border-style: none;
}

.col-md-6 {
  padding-top: 0px !important;
}
</style>