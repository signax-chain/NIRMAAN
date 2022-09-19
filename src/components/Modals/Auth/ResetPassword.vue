<template>
  <v-container>
    <v-dialog persistent max-width="400" v-model="show">
      <v-form ref="form">
        <v-card>
          <v-card-title> Reset Password </v-card-title>
          <v-card-text class="mt-3">
            <v-text-field
              outlined
              label="Enter your email Address"
              :rules="emailRules"
              v-model="email"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="traktor" class="white--text" @click="reset()"
              >Reset My Password</v-btn
            >
            <v-btn color="red" text @click="show = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-container>
</template>

<script>
import { auth } from "../../../config/firebase_services";
export default {
  name: "ResetPassword",
  props: ["visible"],
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
      email: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
    };
  },
  methods: {
    async reset() {
      if (this.$refs.form.validate()) {
        try {
          await auth.sendPasswordResetEmail(this.email);
          this.$toast.success(`Reset Password email sent to ${this.email}`, {
            position: "top",
          });
          this.email = "";
          this.$emit("close");
        } catch (error) {
          this.$toast.error(error, {
            position: "top",
          });
        }
      }
    },
  },
};
</script>

<style scoped>
.v-btn {
  text-transform: capitalize;
}
</style>