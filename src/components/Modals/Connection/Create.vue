<template>
  <v-dialog v-model="show" persistent max-width="800">
    <v-card>
      <v-card-title class="headline"> Add new contact </v-card-title>
      <v-card-text class="mt-5">
        <v-form>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Name"
                outlined
                dense
                v-model="contact.name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Designation"
                outlined
                dense
                v-model="contact.designation"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Organisation"
                outlined
                dense
                v-model="contact.organisation"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Connect For?"
                outlined
                dense
                v-model="contact.connectFor"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Contact Number"
                outlined
                dense
                v-model="contact.phoneNumber"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Email Address"
                outlined
                dense
                type="email"
                v-model="contact.email"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="show = false"> Cancel </v-btn>
        <v-btn color="traktor" class="white--text" @click="add()"> Add </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { contactsRef, activityRef } from "../../../config/firebase_services";

export default {
  name: "Create",
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
  },
  data() {
    return {
      contact: {
        name: null,
        designation: null,
        organisation: null,
        connectFor: null,
        phoneNumber: null,
        email: null,
      },
    };
  },
  methods: {
    async add() {
      const obj = Object.keys(this.contact).find(
        (key) => this.contact[key] === null
      );
      if (obj !== undefined) {
        this.$toast.error("All fields are required!...", {
          position: "top",
        });
        return;
      }

      this.contact.incubatorId =
        this.$store.state.incubator.currentIncubator.docId;
      this.contact.createdAt = new Date();
      const activity = {
        createdAt: new Date(),
        incubatorId: this.$store.state.incubator.currentIncubator.docId,
        notification: false,
        type: "incubator",
        statement: `New contact ${this.contact.name} have been added.`,
        photoURL: this.$store.state.incubator.currentIncubator.photoURL,
      };

      try {
        await contactsRef.add(this.contact);
        await activityRef.add(activity);
        this.$toast.success(
          `New contact ${this.contact.name} added succesfully`,
          {
            position: "top",
          }
        );
        this.dialog = false;
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
  },
};
</script>

<style scoped>
</style>