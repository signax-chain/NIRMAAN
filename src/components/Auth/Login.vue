<template>
  <div class="login__container">
    <img
      src="../../assets/images/traktor.svg"
      alt=""
      v-if="$route.path === '/'"
      style="width: 250px"
      class="mb-8 product-img"
    />
    <h2 class="mb-3">Login</h2>
    <v-row class="mt-5">
      <v-col cols="12" md="8">
        <v-form ref="form" @submit.prevent="validateLogin()">
          <v-text-field
            label="Email address"
            prepend-inner-icon="mdi-email"
            type="email"
            v-model="credentials.email"
            :rules="[rules.required]"
            solo
          >
          </v-text-field>
          <v-text-field
            label="Password"
            prepend-inner-icon="mdi-lock"
            :rules="[rules.required]"
            :type="show ? 'text' : 'password'"
            v-model="credentials.password"
            @click:append="show = !show"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            solo
          >
          </v-text-field>
          <v-btn color="trakor" disabled v-if="isLoggingIn">
            Logging in...
            <v-progress-circular
              indeterminate
              color="green"
            ></v-progress-circular>
          </v-btn>
          <v-btn color="traktor" type="submit" class="white--text" v-else large
            >Login</v-btn
          >
          <a href="#" class="d-block mt-2 forgot" @click="dialog = true"
            ><b>Forgot Password?</b></a
          >
        </v-form>
      </v-col>
    </v-row>

    <reset-password :visible="dialog" @close="dialog = false"></reset-password>
  </div>
</template>

<script>
import {
  initializeIncubator,
  initializeMentor,
  initializeMember,
  initializeStartup,
  setCurrentIncubator,
} from "../../_helpers/Initializer";

import {
  initializeIncubatorNavigation,
  initializeMemberNavigation,
  initializeMentorNavigation,
  initializeStartupNavigation,
} from "../../_helpers/NavigationInitializer";

import { LoginService } from "../../services/Auth/LoginService";
import ResetPassword from "../Modals/Auth/ResetPassword.vue";
import { activityRef } from "../../config/firebase_services";

export default {
  components: { ResetPassword },
  name: "LoginComp",
  data() {
    return {
      credentials: {
        email: null,
        password: null,
      },
      show: false,
      rules: {
        required: (value) => !!value || "Required",
      },
      dialog: false,
      isLoggingIn: false,
    };
  },
  methods: {
    async validateLogin() {
      if (this.$refs.form.validate()) {
        this.isLoggingIn = true;
        const response = await LoginService(this.credentials);
        console.log(response);
        if (response.code !== null && response.code !== undefined) {
          this.$store.dispatch("SHOW_SNACKBAR", {
            showing: true,
            text: "Invalid password!",
            color: "error",
          });
          this.isLoggingIn = false;
          return;
        } else {
          this.isLoggingIn = false;
          this.$store.dispatch("SHOW_LOADER", { isShowing: true });

          if (response.role === "incubator") {
            await initializeIncubator(response);
            await setCurrentIncubator(response.userId);
            initializeIncubatorNavigation();
          }

          if (response.role === "mentor") {
            await initializeMentor(response);
            await setCurrentIncubator(response.incubatorId);
            initializeMentorNavigation();
            const activity = {
              incubatorId: response.incubatorId,
              photoURL: response.photoURL,
              statement: `Mentor ${response.name} has logged in.`,
              createdAt: new Date(),
              type: "mentor",
              notification: false,
              mentorId: response.userId,
            };

            await activityRef.add(activity);
          }

          if (response.role === "startup") {
            await initializeStartup(response);
            await setCurrentIncubator(response.incubatorId);
            initializeStartupNavigation();

            const activity = {
              incubatorId: response.incubatorId,
              photoURL: response.photoURL,
              statement: `Startup ${response.name} has logged in.`,
              createdAt: new Date(),
              type: "startup",
              notification: false,
              startupId: response.userId,
            };

            await activityRef.add(activity);
          }

          if (response.role === "member") {
            await initializeMember(response);
            await setCurrentIncubator(response.incubatorId);
            initializeMemberNavigation();
          }

          localStorage.setItem("loginRoute", this.$route.path);
          this.$router.push("/dashboard");
          this.$store.dispatch("SHOW_LOADER", { isShowing: false });
        }
      } else {
        this.$store.dispatch("SHOW_SNACKBAR", {
          showing: true,
          text: "please fill all the fields",
          color: "error",
        });
        this.$store.dispatch("SHOW_LOADER", { isShowing: false });
      }
    },
  },
};
</script>

<style scoped>
h2 {
  color: #5e5e5e !important;
}

.login__container {
  margin-top: 30%;
}

.v-btn {
  width: 150px;
  font-weight: bold;
  text-transform: capitalize;
  box-shadow: none;
  font-size: 18px;
}

>>> .v-icon,
>>> .v-text-field.v-text-field--solo .v-label {
  color: #b0b0b0 !important;
  font-weight: normal !important;
}

>>> .v-text-field.v-text-field--solo .v-input__prepend-inner {
  margin-right: 7px !important;
}

>>> .v-input__slot {
  background: #fff !important;
}

>>> .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)
  > .v-input__control
  > .v-input__slot {
  box-shadow: none !important;
}

a {
  text-decoration: none;
}

.tagline,
label {
  color: #b0b0b0;
}

>>> .checkbox > .v-input__control > .v-input__slot {
  background: transparent !important;
}

@media only screen and (max-width: 600px) {
  .v-btn {
    display: block;
    margin: 0 auto;
  }

  .login__container {
    margin-top: 0;
  }

  .forgot {
    text-align: center;
  }

  .product-img {
    display: none;
  }
}
</style>