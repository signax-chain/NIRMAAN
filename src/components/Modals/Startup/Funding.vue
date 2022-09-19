<template>
  <v-dialog v-model="show" persistent max-width="700">
    <v-card>
      <v-card-title class="heading"
        >Edit Funding
        <v-spacer> </v-spacer>
        <v-btn text color="red" @click="show = false">Close</v-btn>
        <v-btn color="traktor" dark @click="update()">Update</v-btn>
      </v-card-title>
      <v-card-text class="mt-5">
        <v-row class="mt-3">
          <v-col cols="12" md="5">
            <h4>Funding Received</h4>
          </v-col>
          <v-col cols="12" md="7">
            <v-text-field
              prefix="Rs."
              dense
              v-model="funding.received"
              :readonly="currentUser.role !== 'incubator'"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mt-3">
          <v-col cols="12" md="5">
            <h4>Funding Utilized</h4>
          </v-col>
          <v-col cols="12" md="7">
            <v-text-field
              prefix="Rs."
              dense
              v-model="funding.utilized"
              :readonly="currentUser.role !== 'incubator'"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mt-3">
          <v-col cols="12" md="5">
            <h4>External Funding</h4>
          </v-col>
          <v-col cols="12" md="7">
            <v-text-field
              prefix="Rs."
              dense
              v-model="funding.external"
              readonly
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "FundingEdit",
  props: ["visible", "funding"],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) return this.$emit("close");
      },
    },
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  methods: {
    update() {
      this.$emit("updateFunding");
    },
  },
};
</script>

<style scoped>
</style>