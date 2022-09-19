<template>
  <v-container>
    <div class="d-flex">
      <h2>Awards & Recognitions</h2>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            color="traktor"
            @click="dialog = true"
            v-show="currentUser.role !== 'mentor'"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon size="28">mdi-plus-circle-outline</v-icon>
          </v-btn>
        </template>
        <span>Add new award</span>
      </v-tooltip>
    </div>
    <div class="awards__container mt-5 d-flex">
      <div class="award__card pa-2 mr-3" v-if="activeAward.idx !== undefined">
        <div class="top__section d-flex justify-space-between">
          <!-- <h3 class="award__name">{{ truncateParagraph(30, award.name) }}</h3> -->
          <v-autocomplete
            :items="awards"
            item-text="name"
            dense
            v-model="activeName"
            @change="handleAward"
          ></v-autocomplete>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="traktor" icon v-show="currentUser.role !== 'mentor'"
                ><v-icon v-bind="attrs" v-on="on"
                  >mdi-dots-vertical</v-icon
                ></v-btn
              >
            </template>
            <v-list>
              <v-list-item @click="view(activeAward)">
                <v-list-item-title> View </v-list-item-title>
              </v-list-item>
              <v-list-item @click="edit(activeAward.idx)">
                <v-list-item-title> Edit </v-list-item-title>
              </v-list-item>
              <v-list-item
                v-if="activeAward.document"
                @click="download(activeAward.document)"
              >
                <v-list-item-title> Download </v-list-item-title>
              </v-list-item>
              <v-list-item @click="_delete(activeAward.idx)">
                <v-list-item-title> Delete </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <h3 class="mt-1 given__by">
          {{ truncateParagraph(50, activeAward.givenBy) }}
        </h3>
        <p class="description mt-3">
          {{ truncateParagraph(80, activeAward.description) }}
        </p>
        <div class="card__footer">
          <span v-if="activeAward.money"
            >Prize money: {{ activeAward.money }}</span
          >
          <span class="">{{
            new Date(activeAward.date).toLocaleDateString("en-in")
          }}</span>
        </div>
      </div>
      <h4 v-else>No awards found</h4>
    </div>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="800">
        <v-card>
          <v-card-title class="headline">
            Add new Award/ Recognition
          </v-card-title>
          <v-card-text class="mt-5">
            <v-form>
              <v-row>
                <v-col cols="12" md="6">
                  <label>Award/ Recognition Name</label>
                  <v-text-field dense v-model="award.name"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <label>Award/ Recognition Org</label>
                  <v-text-field dense v-model="award.givenBy"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <label>Prize money (if any)</label>
                  <v-text-field
                    dense
                    v-model="award.money"
                    prefix="Rs."
                    @keypress="readOnlyNumbers"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <label>Awarded date</label>
                  <v-text-field
                    dense
                    type="date"
                    v-model="award.date"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <label>Description</label>
                  <v-textarea dense v-model="award.description"></v-textarea>
                </v-col>
                <v-col cols="12" md="6">
                  <label>Award/ Recognition document (if any)</label>
                  <v-file-input dense v-model="award.document"></v-file-input>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="dialog = false">
              Cancel
            </v-btn>
            <v-btn
              color="traktor"
              class="white--text"
              @click="add()"
              v-if="!editOption"
            >
              Add
            </v-btn>
            <v-btn color="traktor" class="white--text" @click="update()" v-else>
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <award
        :visible="awardDialog"
        :award="awardData"
        @close="awardDialog = false"
      ></award>
    </v-row>
  </v-container>
</template>

<script>
import { startupsRef } from "../../config/firebase_services";
import { mapState } from "vuex";
import { uploadFile } from "../../_helpers/FileUpload";
import Award from "../Modals/Startup/Award.vue";

export default {
  components: { Award },
  name: "AwardsandRecognitions",
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  data() {
    return {
      dialog: false,
      award: {
        name: null,
        date: null,
        givenBy: null,
        description: null,
        document: null,
        money: null,
      },
      startupId: null,
      awards: [],
      editOption: false,
      awardDialog: false,
      awardData: "",
      activeAward: {},
      activeName: "",
    };
  },
  created() {
    this.startupId =
      this.$route.params.id !== undefined
        ? this.$route.params.id
        : this.$store.state.user.currentUser.docId;

    startupsRef.doc(this.startupId).onSnapshot((snapshot) => {
      this.awards =
        snapshot.data()["awards"] === undefined
          ? []
          : snapshot.data()["awards"];
      if (this.awards.length !== 0) {
        this.activeAward = this.awards[0];
        this.activeAward.idx = 0;
        this.activeName = this.activeAward.name;
      }
    });
  },
  methods: {
    getTotal() {
      if (this.awards.length === 0) return 0;
      const amounts = this.awards.map((award) => award.money);
      let filteredAmount = [];
      amounts.forEach((amount) => {
        filteredAmount.push(amount.replace(/[^0-9]/g, ""));
      });
      return filteredAmount.reduce((ac, amt) => parseInt(ac) + parseInt(amt));
    },
    readOnlyNumbers(e) {
      return e.charCode >= 48 && e.charCode <= 57
        ? e.target.value
        : e.preventDefault();
    },
    truncateParagraph(maxLength = 80, paragraph) {
      return paragraph.length <= maxLength
        ? paragraph
        : paragraph.substring(0, maxLength) + "...";
    },
    async add() {
      if (
        this.award.name === null ||
        this.award.date === null ||
        this.award.description === null
      ) {
        this.$toast.error("Looks like some fileds are missing", {
          position: "top",
        });
        return;
      }

      if (
        typeof this.award.document === "object" &&
        this.award.document !== null
      ) {
        this.award.document = await uploadFile(
          this.award.document,
          "awardsAndRecogntions"
        );

        this.uploadData();
      } else {
        this.uploadData();
      }
    },

    async uploadData() {
      try {
        this.awards.push(this.award);
        await startupsRef
          .doc(this.startupId)
          .set({ awards: this.awards }, { merge: true });
        this.dialog = false;
        this.$toast.success("Added", {
          position: "top",
        });

        this.award = {
          name: null,
          date: null,
          givenBy: null,
          description: null,
          document: null,
          money: null,
        };
      } catch (error) {
        this.dialog = false;

        this.$toast.error(error, {
          position: "top",
        });
      }
    },

    async update(index) {
      if (
        this.award.name === null ||
        this.award.date === null ||
        this.award.description === null
      ) {
        this.$toast.error("Looks like some fileds are missing", {
          position: "top",
        });
        return;
      }

      if (
        typeof this.award.document === "object" &&
        this.award.document !== null
      ) {
        this.award.document = await uploadFile(
          this.award.document,
          "awardsAndRecogntions"
        );

        this.updateData(index);
      } else {
        this.updateData(index);
      }
    },

    async updateData(index) {
      try {
        this.awards[index] = this.award;
        await startupsRef
          .doc(this.startupId)
          .set({ awards: this.awards }, { merge: true });
        this.dialog = false;
        this.$toast.success("Updated", {
          position: "top",
        });
        this.award = {
          name: null,
          date: null,
          givenBy: null,
          description: null,
          document: null,
          money: null,
        };
        this.editOption = false;
      } catch (error) {
        this.dialog = false;

        this.$toast.error(error, {
          position: "top",
        });
        this.editOption = false;
      }
    },
    download(document) {
      window.location.href = document;
    },

    handleAward(name) {
      const idx = this.awards.findIndex((award) => award.name === name);
      this.activeAward = this.awards[idx];
      this.activeAward.idx = idx;
    },

    view(award) {
      this.awardData = award;
      this.awardDialog = true;
    },

    edit(index) {
      this.editOption = true;
      this.award = this.awards[index];
      this.dialog = true;
    },

    async _delete(index) {
      this.awards.splice(index, 1);
      await startupsRef
        .doc(this.startupId)
        .set({ awards: this.awards }, { merge: true });
      this.$toast.success("Deleted", {
        position: "top",
      });
    },
  },
};
</script>

<style scoped>
.awards__container {
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  margin-bottom: 20px;
}

.award__card {
  width: 350px;
  border: 1px solid #3aa959;
  height: 190px;
  border-radius: 10px;
  position: relative;
  min-width: 55%;
}

.top__section > span {
  font-size: 12px;
}

.award__name {
  color: #3aa959;
  white-space: normal;
}

.given__by {
  font-size: 12px;
  /* white-space: normal; */
}

.award__card > p {
  font-size: 13px;
}

.award__card > span {
  font-size: 12px;
}

.actions {
  float: right;
}

.description {
  font-size: 12px;
  white-space: normal;
}

.card__footer {
  position: absolute;
  bottom: 2px;
  width: 92%;
  display: flex;
  justify-content: space-between;
}

.card__footer > span {
  color: #3aa959;
  font-weight: bold;
}

>>> .v-dialog:not(.v-dialog--fullscreen) {
  border-radius: 10px;
}

>>> .v-text-field__details {
  margin-bottom: 0px !important;
  display: none;
}

label {
  margin-left: 10px;
}

>>> .v-dialog {
  margin-left: 270px;
}

>>> .v-input__control {
  border-radius: 10px;
  border: 1px solid #dbdbdb;
  box-shadow: 0px 0px 24px rgba(219, 219, 219, 0.32);
  padding: 5px 5px 5px 10px;
}

>>> .v-text-field > .v-input__control > .v-input__slot:before {
  border-style: none;
}

.v-btn {
  text-transform: capitalize;
}

@media only screen and (max-width: 600px) {
  .award__card {
    width: 100%;
  }
}
</style>
