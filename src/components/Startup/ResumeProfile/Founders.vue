<template>
  <div class="wrapper">
    <div class="d-flex">
      <h2>Founders</h2>
      <v-spacer></v-spacer>
      <v-btn
        text
        color="traktor"
        @click="founderDialog = true"
        v-show="currentUser.role !== 'mentor'"
      >
        <v-icon>mdi-pencil</v-icon> Edit
      </v-btn>
    </div>
    <div class="founders__row">
      <v-expansion-panels accordion>
        <v-expansion-panel v-for="(founder, i) in startup.founders" :key="i">
          <v-expansion-panel-header>
            <h4 class="d-flex align-center">
              <span>{{ founder.name }}</span>
              <div v-show="founder.linkedIn">
                <a :href="founder.linkedIn" target="_blank"
                  ><v-icon class="ml-2">mdi-linkedin</v-icon></a
                >
              </div>
              <div v-show="founder.role" class="ml-2">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="black"
                      v-bind="attrs"
                      v-on="on"
                      v-show="founder.role === roles[1]"
                      >mdi-teach</v-icon
                    >
                    <v-icon
                      color="black"
                      v-bind="attrs"
                      v-on="on"
                      v-show="founder.role === roles[0]"
                      >mdi-school</v-icon
                    >
                    <v-icon
                      color="black"
                      v-bind="attrs"
                      v-on="on"
                      v-show="founder.role === roles[2]"
                      >mdi-account-arrow-right</v-icon
                    >
                    <v-icon
                      color="black"
                      v-bind="attrs"
                      v-on="on"
                      v-show="founder.role === roles[3]"
                      >mdi-account-star</v-icon
                    >
                  </template>
                  <span>{{ founder.role }}</span>
                </v-tooltip>
              </div>
            </h4>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="social__icons mt-2">
              <div v-show="founder.email">
                <v-icon class="mr-2">mdi-email</v-icon>
                <a @click="copyToClipboard(founder.email)">{{
                  founder.email
                }}</a>
              </div>
              <div v-show="founder.phoneNumber">
                <v-icon class="mr-2">mdi-phone</v-icon>
                <a @click="copyToClipboard(founder.phoneNumber)">{{
                  founder.phoneNumber
                }}</a>
              </div>
               <div v-show="founder.studentId">
                <v-icon class="mr-2">mdi-card-account-details</v-icon>
                <a @click="copyToClipboard(founder.studentId)">{{
                  founder.studentId
                }}</a>
              </div>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <!-- <div
        class="founder__col mr-3"
        v-for="(founder, i) in startup.founders"
        :key="i"
      >
        <h4 class="d-flex">
          {{ founder.name }}
          <div v-show="founder.linkedIn">
            <a :href="founder.linkedIn" target="_blank"
              ><v-icon class="ml-2">mdi-linkedin</v-icon></a
            >
          </div>
          <div v-show="founder.role">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  color="black"
                  v-bind="attrs"
                  v-on="on"
                  v-show="founder.role === roles[1]"
                  >mdi-teach</v-icon
                >
                <v-icon
                  color="black"
                  v-bind="attrs"
                  v-on="on"
                  v-show="founder.role === roles[0]"
                  >mdi-school</v-icon
                >
                <v-icon
                  color="black"
                  v-bind="attrs"
                  v-on="on"
                  v-show="founder.role === roles[2]"
                  >mdi-account-arrow-right</v-icon
                >
                <v-icon
                  color="black"
                  v-bind="attrs"
                  v-on="on"
                  v-show="founder.role === roles[3]"
                  >mdi-account-star</v-icon
                >
              </template>
              <span>{{ founder.role }}</span>
            </v-tooltip>
          </div>
        </h4>
        <span v-show="founder.studentId" style="font-size: 12px">{{
          founder.studentId
        }}</span>
        <div class="social__icons mt-2">
          <div v-show="founder.email">
            <v-icon class="mr-2">mdi-email</v-icon>
            <a @click="copyToClipboard(founder.email)">{{ founder.email }}</a>
          </div>
          <div v-show="founder.phoneNumber">
            <v-icon class="mr-2">mdi-phone</v-icon>
            <a @click="copyToClipboard(founder.phoneNumber)">{{
              founder.phoneNumber
            }}</a>
          </div>
        </div>
      </div> -->
    </div>
    <v-dialog v-model="founderDialog" persistent max-width="1350">
      <v-card>
        <v-card-title>
          Founders
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="founderDialog = false">
            Cancel
          </v-btn>
          <v-btn color="traktor" class="white--text" @click="save()">
            Update
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-5">
          <v-form>
            <div
              class="founder__row"
              v-for="(founder, index) in startup.founders"
              :key="index"
            >
              <div class="founders__col">
                <v-text-field
                  outlined
                  label="Name"
                  dense
                  v-model="founder.name"
                ></v-text-field>
              </div>
              <div class="founders__col">
                <v-text-field
                  outlined
                  label="Email"
                  dense
                  type="email"
                  v-model="founder.email"
                  :rules="emailRules"
                ></v-text-field>
              </div>
              <div class="founders__col">
                <v-text-field
                  outlined
                  label="Number"
                  dense
                  v-model="founder.phoneNumber"
                  @keypress="filterInput"
                ></v-text-field>
              </div>
              <div class="founders__col">
                <v-select
                  label="Gender"
                  :items="gender"
                  v-model="founder.gender"
                  outlined
                  dense
                ></v-select>
              </div>
              <div class="founders__col">
                <v-text-field
                  outlined
                  label="Student ID"
                  dense
                  v-model="founder.studentId"
                ></v-text-field>
              </div>
              <div class="founders__col">
                <v-text-field
                  outlined
                  label="LinkedIn"
                  dense
                  v-model="founder.linkedIn"
                ></v-text-field>
              </div>
              <div class="founders__col">
                <v-select
                  outlined
                  label="Role"
                  dense
                  v-model="founder.role"
                  :items="roles"
                ></v-select>
              </div>
              <div
                class="founders__col"
                v-if="startup.founders.length - 1 === index"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on"
                      ><v-icon color="traktor" @click="addFounder()"
                        >mdi-plus-circle</v-icon
                      ></v-btn
                    >
                  </template>
                  <span>Add new founder</span>
                </v-tooltip>
              </div>
              <div class="founders__col">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on"
                      ><v-icon color="red" @click="deleteFounder(index)"
                        >mdi-delete</v-icon
                      ></v-btn
                    >
                  </template>
                  <span>Delete founder</span>
                </v-tooltip>
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { startupsRef } from "../../../config/firebase_services";
import { mapState } from "vuex";
import _helpers from "../../../mixins/_helpers";
import copy from "copy-to-clipboard";
import activity from "../../../mixins/activity";

export default {
  name: "Founders",
  props: ["startup"],
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  mixins: [_helpers, activity],
  data() {
    return {
      founderDialog: false,
      gender: ["Male", "Female", "Others"],
      roles: ["Student", "Faculty", "Outside IITM", "Project Staff"],
    };
  },
  methods: {
    copyToClipboard(text) {
      try {
        copy(text);
        this.$toast.success(`Copied ${text} to clipboard`, {
          position: "top",
        });
      } catch (error) {
        this.$toast.error("Error while copying!", {
          position: "top",
        });
      }
    },
    filterInput(e) {
      return e.charCode >= 48 && e.charCode <= 57
        ? e.target.value
        : e.preventDefault();
    },
    addFounder() {
      this.startup.founders.push({
        name: "",
        email: "",
        phoneNumber: "",
        linkedIn: "",
        photoURL: "",
      });
    },
    deleteFounder(index) {
      this.startup.founders.splice(index, 1);
    },
    async save() {
      const emptyName = this.startup.founders
        .map((founder) => founder.name)
        .find((name) => name === "");

      if (emptyName !== undefined) {
        this.$toast.error("Founder name cannot be empty!", {
          position: "top",
        });
        return;
      }
      try {
        await startupsRef
          .doc(this.startup.docId)
          .set({ founders: this.startup.founders }, { merge: true });

        await this.updateActivity("has updated founders section");
        this.$toast.success("Updated", {
          position: "top",
        });
        this.founderDialog = false;
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
.v-expansion-panel::before {
  box-shadow: none;
}

a {
  text-decoration: none;
  color: #000 !important;
}

.social__icons > * {
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
}

.founders__row {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  width: 100%;
}

.founder__col {
  width: 32%;
  margin-bottom: 3%;
}

.founder__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.founders__col {
  margin-right: 10px;
}

h4 {
  color: #3aa959;
}

@media only screen and (max-width: 600px) {
  .founder__col {
    width: 100%;
    margin-bottom: 15px;
  }
}
</style>