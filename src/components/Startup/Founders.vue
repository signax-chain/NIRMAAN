<template>
  <v-container>
    <div class="d-flex">
      <h2>Founders</h2>
      <v-spacer></v-spacer>
      <v-btn
        icon
        color="grayFont"
        @click="founderDialog = true"
        v-show="currentUser.role !== 'mentor'"
      >
        <v-icon size="28">mdi-pencil</v-icon>
      </v-btn>
    </div>
    <v-list three-line>
      <template>
        <v-row>
          <v-col
            cols="12"
            md="6"
            v-for="(founder, index) in startup.founders"
            :key="index"
          >
            <v-list-item>
              <v-list-item-avatar size="54">
                <img
                  src="https://www.pngjoy.com/pngm/136/2750635_gray-circle-login-user-icon-png-transparent-png.png"
                  alt=""
                />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="founder__name">{{
                  founder.name
                }}</v-list-item-title>
                <v-list-item-subtitle>{{ founder.email }}</v-list-item-subtitle>
                <v-list-item-subtitle>{{
                  founder.phoneNumber
                }}</v-list-item-subtitle>
                <v-list-item-subtitle v-show="founder.studentId">
                  Student ID - {{ founder.studentId }}</v-list-item-subtitle
                >
                <v-list-item-subtitle v-show="founder.gender">
                  Gender - {{ founder.gender }}</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </template>
    </v-list>
    <v-row justify="center">
      <v-dialog v-model="founderDialog" persistent max-width="1000">
        <v-card>
          <v-card-title> Founders </v-card-title>
          <v-card-text class="mt-5">
            <v-form>
              <v-row v-for="(founder, index) in startup.founders" :key="index">
                <v-col cols="12" md="2">
                  <v-text-field
                    outlined
                    label="Name"
                    dense
                    v-model="founder.name"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                  <v-text-field
                    outlined
                    label="Email"
                    dense
                    type="email"
                    v-model="founder.email"
                    :rules="emailRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                  <v-text-field
                    outlined
                    label="Number"
                    dense
                    v-model="founder.phoneNumber"
                    @keypress="filterInput"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                  <v-select
                    label="Gender"
                    :items="gender"
                    v-model="founder.gender"
                    outlined
                    dense
                  ></v-select>
                </v-col>
                <v-col cols="12" md="2">
                  <v-text-field
                    outlined
                    label="Student ID"
                    dense
                    v-model="founder.studentId"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                  <v-text-field
                    outlined
                    label="LinkedIn"
                    dense
                    v-model="founder.linkedIn"
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                  md="1"
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
                </v-col>
                <v-col cols="12" md="1" v-if="startup.founders.length - 1 >= 1">
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
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click="founderDialog = false">
              Cancel
            </v-btn>
            <v-btn color="traktor" class="white--text" @click="save()">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import { startupsRef } from "../../config/firebase_services";
import { mapState } from "vuex";
import _helpers from "../../mixins/_helpers";

export default {
  name: "Founders",
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  mixins: [_helpers],
  data() {
    return {
      founderDialog: false,
      startup: null,
      startupId: null,
      gender: ["Male", "Female", "Others"],
    };
  },
  async created() {
    this.startupId =
      this.$route.params.id !== undefined
        ? this.$route.params.id
        : this.$store.state.user.currentUser.docId;

    const document = await startupsRef.doc(this.startupId).get();
    const data = document.data();
    if (data.founders.length === 0)
      data.founders = [
        { name: null, email: null, phoneNumber: null, photoURL: null },
      ];
    this.startup = data;
  },
  methods: {
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
          .doc(this.startupId)
          .set({ founders: this.startup.founders }, { merge: true });

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
.container {
  background: #fff;
}

.founder__name {
  color: #3aa959 !important;
  font-size: 18px;
  font-weight: bold;
}

.v-list-item__subtitle {
  font-feature-settings: "lnum" 1;
}

.v-btn {
  font-weight: bold !important;
  text-transform: capitalize;
}

>>> .v-dialog:not(.v-dialog--fullscreen) {
  border-radius: 10px;
}
</style>