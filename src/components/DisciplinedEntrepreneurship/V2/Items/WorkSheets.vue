<template>
  <section>
    <input type="file" @change="uploadItem" ref="file" style="display: none" />
    <v-row>
      <v-col
        cols="12"
        md="4"
        v-for="(sheet, i) in modules[index].sheets"
        :key="i"
      >
        <v-card>
          <v-card-text>
            <v-icon color="traktor">mdi-file-excel</v-icon>
            <div class="d-flex justify-space-between">
              <h4 class="mt-3">{{ sheet.title }}</h4>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon>
                    <v-icon dark>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    @click="downloadSheet(sheet.document)"
                    v-if="!$route.params.id"
                  >
                    <v-list-item-title> Download </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    @click="downloadAnswerSheet(sheet.answerSheet)"
                    v-if="currentUser.role === 'incubator'"
                  >
                    <v-list-item-title>
                      Download Answer Sheet</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item
                    @click="assignClick(i)"
                    v-if="currentUser.role === 'startup'"
                  >
                    <v-list-item-title> Upload </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    @click="deleteWorksheet(i)"
                    v-if="currentUser.role === 'incubator' && !$route.params.id"
                  >
                    <v-list-item-title> Delete </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="3"
        v-if="currentUser.role === 'incubator' && !$route.params.id"
      >
        <v-card>
          <v-card-text
            class="text-center"
            @click="worksheetDialog = true"
            style="cursor: pointer"
          >
            <v-icon color="traktor">mdi-plus-circle</v-icon>
            <h3 class="mt-3">Upload new</h3>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <new-item
      :visible="worksheetDialog"
      :title="title"
      @close="worksheetDialog = false"
      @result="addWorksheet"
    ></new-item>
    <progress-loader
      :visible="progressDialog"
      :loaderText="loaderText"
      @close="progressDialog = false"
    ></progress-loader>
  </section>
</template>

<script>
import { mapState } from "vuex";
import {
  activityRef,
  deResponsesV2Ref,
  dev2Ref,
  documentationRef,
} from "../../../../config/firebase_services";
import { uploadFileWithName } from "../../../../_helpers/FileUpload";
import NewItem from "../../../Modals/Dev2/NewItem.vue";
import ProgressLoader from "../../../Modals/Loaders/ProgressLoader.vue";
export default {
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      currentIncubator: (state) => state.incubator.currentIncubator,
    }),
  },
  components: { NewItem, ProgressLoader },
  props: ["modules", "index"],
  data() {
    return {
      worksheet: {},
      worksheetDialog: false,
      title: "Worksheet",
      sheetIndex: 0,
      progressDialog: false,
      loaderText: "Uploading worksheet",
    };
  },
  methods: {
    async addWorksheet(worksheet) {
      try {
        this.modules[this.index].sheets.push(worksheet);
        console.log(this.modules);
        await dev2Ref
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .update({
            modules: this.modules,
          });
        this.worksheetDialog = false;
        this.$toast.open({
          message: "Worksheet added",
          position: "top",
          type: "success",
        });
      } catch (error) {
        this.$toast.error(error.message);
      }
    },
    downloadSheet(document) {
      window.open(document, "_blank");
    },
    downloadAnswerSheet(document) {
      window.open(document, "_blank");
    },
    async deleteWorksheet(index) {
      try {
        this.modules[this.index].sheets.splice(index, 1);
        await dev2Ref.doc(this.$store.state.incubator.currentIncubator.docId).set(
          {
            modules: this.modules,
          },
          { merge: true }
        );
        this.$toast.open({
          message: "Worksheet deleted",
          position: "top",
          type: "success",
        });
      } catch (error) {
        this.$toast.error(error.message);
      }
    },
    assignClick(index) {
      this.$refs.file.click();
      this.sheetIndex = index;
    },
    async uploadItem() {
      try {
        this.progressDialog = true;
        this.modules[this.index].sheets[this.sheetIndex].answerSheet =
          await uploadFileWithName(
            this.$refs.file.files[0],
            "de-documents/answersheets"
          );
        await deResponsesV2Ref
          .doc(this.$store.state.user.currentUser.docId)
          .set(
            {
              modules: this.modules,
            },
            { merge: true }
          );
        await this.uploadToDocuments();
        this.progressDialog = false;
        this.$toast.open({
          message: "Worksheet uploaded",
          position: "top",
          type: "success",
        });
      } catch (error) {
        this.$toast.error(error.message);
        this.progressDialog = false;
      }
    },
    async uploadToDocuments() {
      try {
        const data = {
          createdAt: new Date(),
          document:
            this.modules[this.index].sheets[this.sheetIndex].answerSheet,
          incubatorId: this.$store.state.incubator.currentIncubator.docId,
          title: this.modules[this.index].sheets[this.sheetIndex].title,
          userId: this.$store.state.user.currentUser.docId,
          _type: "other",
        };
        const activity = {
          createdAt: new Date(),
          userId: this.currentIncubator.docId,
          incubatorId: this.currentIncubator.docId,
          photoURL: this.currentUser.photoURL,
          notification: true,
          read: false,
          statement: `${
            this.currentUser.name
          } has uploaded a de worksheet for ${
            this.modules[this.index].sheets[this.sheetIndex].title
          }`,
          link: `/startup/${this.currentUser.docId}`,
        };
        await activityRef.add(activity);
        await documentationRef.add(data);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.v-card {
  border: 1px solid #eee !important;
  border-radius: 5px;
  width: 200px;
  box-shadow: 0 4px 0 rgba(58, 169, 89, 1) !important;
}

.actions {
  display: none;
}

.text:hover .actions {
  display: block !important;
}
</style>