<template>
  <v-dialog v-model="show" persistent max-width="600">
    <v-form ref="form" @submit.prevent="raise()">
      <v-card>
        <v-card-title class="heading"> Raise a concern </v-card-title>
        <v-card-text class="mt-5">
          <v-autocomplete
            :items="types"
            v-model="data.reason"
            outlined
            label="Select the concern type"
            :rules="rule"
          ></v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="show = false">Close</v-btn>
          <v-btn color="traktor" dark type="submit">Raise</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
import Swal from "sweetalert2";
import {
  activityRef,
  startupComplaintsRef,
} from "../../../config/firebase_services";

export default {
  name: "RaiseConcern",
  props: ["visible", "startup"],
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) return this.$emit("close");
      },
    },
  },
  data() {
    return {
      types: [
        "Startup is not responsive",
        "Slow progress",
        "Missed scheduled meeting with the mentor",
      ],
      rule: [(v) => !!v || "Reason cannot be empty!"],
      data: {
        reason: "",
        createdAt: "",
        startup: {},
        raisedBy: {},
      },
    };
  },
  methods: {
    raise() {
      if (this.$refs.form.validate()) {
        Swal.fire({
          title: `Are you sure?`,
          showCancelButton: true,
          confirmButtonColor: "#3aa959",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.data.createdAt = new Date();
            this.data.startup = this.startup;
            this.data.raisedBy = {
              name: this.currentUser.name,
              id: this.currentUser.docId,
            };
            const activity = {
              createdAt: new Date(),
              incubatorId: this.$store.state.incubator.currentIncubator.docId,
              notification: true,
              type: "mentor",
              statement: `${this.currentUser.name} has raised a concern about ${this.startup.name} saying ${this.data.reason}.`,
              photoURL: this.currentUser.photoURL,
              read: false,
            };

            try {
              await activityRef.add(activity);
              await startupComplaintsRef.add(this.data);
              this.$toast.success("Success.", {
                position: "top",
              });
              this.show = false;
            } catch (error) {
              this.$toast.error(error, {
                position: "top",
              });
            }
          }
        });
      }
    },
  },
};
</script>

<style>
</style>