<template>
  <v-dialog v-model="show" width="500">
    <v-card>
      <v-card-title class="heading"
        >Accept the Application
        <v-spacer></v-spacer>
        <v-btn color="red" icon @click="show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="mt-5">
        <v-form ref="form">
          <v-text-field
            v-model="creditsGranted"
            label="Credits Granted"
            outlined
            type="number"
            dense
            :rules="[(v) => !!v || 'Credits is required']"
          ></v-text-field>
          <v-text-field
            v-model="applicationLink"
            label="Application Link"
            outlined
            dense
            type="url"
            :rules="[
              (v) => !!v || 'Application Link is required',
              (v) =>
                /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(
                  v
                ) || 'Application Link is invalid',
            ]"
          ></v-text-field>
          <v-btn color="traktor" class="mx-auto d-block" dark @click="grant()">
            Grant Credits
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { requestsRaisedRef } from "../../../config/firebase_services";
export default {
  props: ["visible", "requestId"],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      },
    },
  },
  data() {
    return {
      creditsGranted: 0,
      applicationLink: null,
    };
  },
  methods: {
    async grant() {
      if (this.$refs.form.validate()) {
        try {
          await requestsRaisedRef.doc(this.requestId).set(
            {
              creditsGranted: parseInt(this.creditsGranted),
              applicationLink: this.applicationLink,
              request: {
                status: "granted",
              },
              grantedAt: new Date(),
            },
            { merge: true }
          );

          this.$toast.open({
            message: "Credits Granted",
            type: "success",
            position: "top",
          });
          this.$emit("close");
        } catch (error) {
          this.$toast.open({
            message: error.message,
            type: "error",
            position: "top",
          });
        }
      }
    },
  },
};
</script>

<style scoped>
</style>