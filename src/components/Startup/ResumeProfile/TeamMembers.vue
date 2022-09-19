<template>
  <div class="wrapper">
    <div class="d-flex">
      <h2>Team Members</h2>
      <v-spacer></v-spacer>
      <v-btn
        text
        color="traktor"
        @click="memberDialog = true"
        v-show="currentUser.role !== 'mentor'"
      >
        <v-icon>mdi-pencil</v-icon> Edit
      </v-btn>
    </div>
    <div class="members__row">
      <v-expansion-panels accordion>
        <v-expansion-panel v-for="(member, i) in startup.teamMembers" :key="i">
          <v-expansion-panel-header>
            <h4 class="d-flex align-center">
              <span>{{ member.name }}</span>
            </h4>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="social__icons mt-2">
              <div v-show="member.email">
                <v-icon class="mr-2">mdi-email</v-icon>
                <a @click="copyToClipboard(member.email)">{{ member.email }}</a>
              </div>
              <div v-show="member.phoneNumber">
                <v-icon class="mr-2">mdi-phone</v-icon>
                <a @click="copyToClipboard(member.phoneNumber)">{{
                  member.phoneNumber
                }}</a>
              </div>
              <div v-show="member.designation">
                <v-icon class="mr-2">mdi-card-account-details</v-icon>
                <a>{{
                  member.designation
                }}</a>
              </div>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <!-- <div
        class="member__col mr-5"
        v-for="(member, i) in startup.teamMembers"
        :key="i"
      >
        <h4>{{ member.name }}</h4>
        <div class="social__icons mt-2">
          <div v-show="member.email">
            <v-icon class="mr-2">mdi-email</v-icon>
            <a @click="copyToClipboard(member.email)">{{ member.email }}</a>
          </div>
          <div v-show="member.phoneNumber">
            <v-icon class="mr-2">mdi-phone</v-icon>
            <a @click="copyToClipboard(member.phoneNumber)">{{
              member.phoneNumber
            }}</a>
          </div>
          <div v-show="member.designation">
            <v-icon class="mr-2">mdi-text</v-icon>
            <span>{{ member.designation }}</span>
          </div>
        </div>
      </div> -->
    </div>
    <v-dialog v-model="memberDialog" persistent max-width="850">
      <v-card>
        <v-card-title>
          Members
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="memberDialog = false"> Cancel </v-btn>
          <v-btn color="traktor" class="white--text" @click="save()">
            Update
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-5">
          <v-form>
            <div
              class="member__row"
              v-for="(member, index) in startup.teamMembers"
              :key="index"
            >
              <div class="members__col">
                <v-text-field
                  outlined
                  label="Name"
                  dense
                  v-model="member.name"
                ></v-text-field>
              </div>
              <div class="members__col">
                <v-text-field
                  outlined
                  label="Email"
                  dense
                  type="email"
                  v-model="member.email"
                  :rules="emailRules"
                ></v-text-field>
              </div>
              <div class="members__col">
                <v-text-field
                  outlined
                  label="Number"
                  dense
                  v-model="member.phoneNumber"
                  @keypress="filterInput"
                ></v-text-field>
              </div>
              <div class="members__col">
                <v-text-field
                  outlined
                  label="Designation"
                  dense
                  v-model="member.designation"
                ></v-text-field>
              </div>
              <div
                class="members__col"
                v-if="startup.teamMembers.length - 1 === index"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on"
                      ><v-icon color="traktor" @click="addMember()"
                        >mdi-plus-circle</v-icon
                      ></v-btn
                    >
                  </template>
                  <span>Add new member</span>
                </v-tooltip>
              </div>
              <div class="members__col">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on"
                      ><v-icon color="red" @click="deleteMember(index)"
                        >mdi-delete</v-icon
                      ></v-btn
                    >
                  </template>
                  <span>Delete member</span>
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
  name: "teamMembers",
  props: ["startup"],
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  mixins: [_helpers, activity],
  data() {
    return {
      memberDialog: false,
      gender: ["Male", "Female", "Others"],
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
    addMember() {
      this.startup.teamMembers.push({
        name: "",
        email: "",
        phoneNumber: "",
        linkedIn: "",
        photoURL: "",
      });
    },
    deleteMember(index) {
      this.startup.teamMembers.splice(index, 1);
    },
    async save() {
      const emptyName = this.startup.teamMembers
        .map((member) => member.name)
        .find((name) => name === "");

      if (emptyName !== undefined) {
        this.$toast.error("member name cannot be empty!", {
          position: "top",
        });
        return;
      }
      try {
        await startupsRef
          .doc(this.startup.docId)
          .set({ teamMembers: this.startup.teamMembers }, { merge: true });
        await this.updateActivity("has updated team members");
        this.$toast.success("Updated", {
          position: "top",
        });
        this.memberDialog = false;
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

.members__row {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
}

.member__row {
  display: flex;
  align-items: center;
}

.members__col {
  margin-right: 10px;
}

.member__col {
  margin-bottom: 1.5rem;
}

h4 {
  color: #3aa959;
}

@media only screen and (max-width: 600px) {
  .member__col {
    width: 100%;
    margin-bottom: 15px;
  }
}
</style>