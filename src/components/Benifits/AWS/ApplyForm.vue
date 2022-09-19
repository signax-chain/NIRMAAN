<template>
  <div>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <v-form ref="form">
      <thank-you class="mx-5" v-if="isThankYou"></thank-you>
      <v-card class="elevation-0 mx-5" v-else>
        <v-card-title class="heading">AWS Credits Application</v-card-title>
        <v-card-text class="mt-5">
          <v-row>
            <v-col cols="12" md="6">
              <label>Startup Name</label>
              <v-text-field
                placeholder="Startup Name"
                v-model="currentUser.name"
                required
                outlined
                dense
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <label>Email</label>
              <v-text-field
                placeholder="Email"
                v-model="currentUser.email"
                required
                outlined
                dense
                disabled
              ></v-text-field>
            </v-col>
            <!-- <v-col cols="12" md="12">
              <label>Reason for Application</label>
              <v-select
                v-model="form.reason"
                :items="reasons"
                label="reason"
                outlined
                dense
                :rules="[(v) => !!v || 'Reason is required']"
              ></v-select>
            </v-col> -->
            <v-col cols="12" md="12">
              <label>Why would you like to apply?</label>
              <v-textarea
                v-model="form.description"
                outlined
                dense
                required
                placeholder="Description"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="traktor" class="mr-2" @click="cancel()" outlined large
            >Cancel</v-btn
          >
          <v-btn color="traktor" dark @click="apply()" large>Apply</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  activityRef,
  requestsRaisedRef,
} from "../../../config/firebase_services";
import ThankYou from "./ThankYou.vue";
export default {
  components: { ThankYou },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      currentIncubator: (state) => state.incubator.currentIncubator,
    }),
  },
  data() {
    return {
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
        },
        {
          text: "AWS Credits",
          disabled: true,
        },
        {
          text: "Apply",
          disabled: true,
        },
      ],
      form: {
        name: "",
        photoURL: "",
        email: "",
        // reason: "",
        description: "",
        status: "",
      },
      reasons: ["Reason 1", "Reason 2", "Reason 3", "Reason 4", "Reason 5"],
      isThankYou: false,
    };
  },
  methods: {
    cancel() {
      this.$router.push("/dashboard");
    },
    async apply() {
      try {
        if (this.$refs.form.validate()) {
          this.form.name = this.currentUser.name;
          this.form.photoURL = this.currentUser.photoURL;
          this.form.email = this.currentUser.email;
          this.form.status = "pending";

          const data = {
            incubatorId: this.currentIncubator.docId,
            type: "aws-credits",
            request: this.form,
            userId: this.currentUser.docId,
            createdAt: new Date(),
          };

          const activity = {
            createdAt: new Date(),
            userId: this.currentUser.docId,
            incubatorId: this.currentIncubator.docId,
            photoURL: this.currentUser.photoURL,
            notification: true,
            read: false,
            statement: `${this.currentUser.name} raised a request for AWS credits`,
            link: "/requests-raised",
          };

          await activityRef.add(activity);
          await requestsRaisedRef.add(data);
          // this.$toast.open({
          //   message: "Request submitted successfully",
          //   type: "error",
          //   position: "top",
          // });
          this.isThankYou = true;

          this.form = {
            name: "",
            photoURL: "",
            email: "",
            reason: "",
            description: "",
            startupId: "",
            incubatorId: "",
            createdAt: "",
            status: "",
          };
        }
      } catch (error) {
        this.$toast.open({
          message: error.message,
          type: "error",
          position: "top",
        });
        this.isThankYou = false;
      }
    },
  },
};
</script>

<style scoped>
label {
  margin-bottom: 2rem;
}
</style>