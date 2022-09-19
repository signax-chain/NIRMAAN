<template>
  <div class="text-center">
    <h2>Signup with</h2>
    <v-btn color="traktor" dark class="mt-5" @click="signup('google')">
      <v-icon>mdi-google</v-icon>
      Sign up with Google
    </v-btn>
    <br />
    <v-btn color="traktor" dark class="mt-3" @click="signup('linkedin')">
      <v-icon>mdi-linkedin</v-icon>
      Sign up with LinkedIn
    </v-btn>
  </div>
</template>

<script>
import { signUpWithGoogle } from "../../services/Auth/signup";

import { linkedInSSO } from "../../services/Auth/sso/linkedin";
export default {
  name: "SSO",
  methods: {
    async signup(type) {
      try {
        let user = {};
        if (type === "google") {
          user = await signUpWithGoogle();
        } else if (type === "linkedin") {
          let requestURL = linkedInSSO.getRedictUrl();
          window.open(requestURL, "_blank");
        }
        console.log(user.user);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
</style>