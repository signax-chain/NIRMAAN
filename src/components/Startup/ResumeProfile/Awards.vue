<template>
  <div class="wrapper">
    <div class="d-flex">
      <h3 class="heading">Awards & Recognitions</h3>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="traktor"
            @click="dialog = true"
            v-show="currentUser.role !== 'mentor'"
            v-bind="attrs"
            v-on="on"
            outlined
            >Add
            <v-icon size="24">mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Add new award</span>
      </v-tooltip>
    </div>
    <div class="awards py-3" v-if="data.awards.length > 0">
      <ol v-for="(award, index) in data.awards" :key="index">
        <li class="mb-2">
          <div
            class="d-flex align-center justify-space-between"
            style="width: 100%"
          >
            <div>
              <p class="mb-1 award-name">{{ index + 1 }}. {{ award.name }}</p>
              <span class="grey--text ml-5">{{ award.description }}</span>
            </div>
            <span>{{ award.money }}</span>
          </div>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" icon class="float-right">
                <v-icon>mdi-dots-vertical</v-icon></v-btn
              >
            </template>
            <v-list>
              <v-list-item @click="view(award)">
                <v-list-item-title>View</v-list-item-title>
              </v-list-item>
              <v-list-item @click="edit(index)">
                <v-list-item-title>Edit</v-list-item-title>
              </v-list-item>
              <v-list-item @click="share(index)">
                <v-list-item-title
                  >Share
                  <v-icon color="#0e76a8"
                    >mdi-linkedin</v-icon
                  ></v-list-item-title
                >
              </v-list-item>
              <v-list-item
                v-show="award.document"
                @click="download(award.document)"
              >
                <v-list-item-title>Download</v-list-item-title>
              </v-list-item>
              <v-list-item @click="_delete(index)">
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </li>
        <v-divider class="mb-3"></v-divider>
      </ol>
    </div>
    <div v-else class="no-awards pb-5">
      <img src="../../../assets/images/no-awards.svg" alt="" />
      <h3>No Awards found</h3>
    </div>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="800">
        <v-card>
          <v-card-title class="headline">
            Add new Award/ Recognition
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
              Save
            </v-btn>
            <v-btn color="traktor" class="white--text" @click="update()" v-else>
              Update
            </v-btn>
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
        </v-card>
      </v-dialog>
      <award
        :visible="awardDialog"
        :award="awardData"
        @close="awardDialog = false"
      ></award>
      <linked-in
        :visible="linkedInModal"
        :award="awardData"
        @close="linkedInModal = false"
      ></linked-in>
    </v-row>
  </div>
</template>

<script>
import { startupsRef } from "../../../config/firebase_services";
import { mapState } from "vuex";
import { uploadFile } from "../../../_helpers/FileUpload";
import Award from "../../Modals/Startup/Award.vue";
import LinkedIn from "../../Modals/Socials/LinkedIn.vue";
import activity from "../../../mixins/activity";

export default {
  name: "Awards",
  components: { Award, LinkedIn },
  props: ["data"],
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  mixins: [activity],
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
      linkedInModal: false,
    };
  },
  methods: {
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
        this.data.awards.push(this.award);
        await startupsRef
          .doc(this.data.docId)
          .set({ awards: this.data.awards }, { merge: true });
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
        this.data.awards[index] = this.award;
        await startupsRef
          .doc(this.data.docId)
          .set({ awards: this.data.awards }, { merge: true });
        this.dialog = false;
        await this.updateActivity("has updated their awards and recognitions");
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

    view(award) {
      this.awardData = award;
      this.awardDialog = true;
    },

    edit(index) {
      this.editOption = true;
      this.award = this.data.awards[index];
      this.dialog = true;
    },

    share(index) {
      this.linkedInModal = true;
      this.awardData = this.data.awards[index];
    },

    async _delete(index) {
      this.data.awards.splice(index, 1);
      await startupsRef
        .doc(this.data.docId)
        .set({ awards: this.data.awards }, { merge: true });
      this.$toast.success("Deleted", {
        position: "top",
      });
    },
  },
};
</script>

<style scoped>
.wrapper {
  width: 100%;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.heading {
  color: #4f4f4f;
  font-weight: 500;
}

.no-awards {
  text-align: center;
}

.no-awards > img {
  width: 300px;
  opacity: 0.5;
}

.no-awards > h3 {
  color: #4f4f4f;
  font-size: 20px;
}

p {
  margin-bottom: 0;
}

.award-name {
  color: #3aa959;
  font-weight: bold;
}

@media only screen and (max-width: 600px) {
  h3 {
    font-size: 16px;
  }
}
</style>