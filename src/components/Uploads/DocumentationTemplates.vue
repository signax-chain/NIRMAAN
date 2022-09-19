<template>
  <div>
    <v-btn
      color="traktor"
      class="white--text d-block ml-auto mb-5"
      @click="dialog = true"
      v-if="currentUser.role === 'incubator'"
      >Add new resouce <v-icon>mdi-plus-circle</v-icon></v-btn
    >
    <v-data-table :headers="headers" :items="templates" mobile-breakpoint="0">
      <template v-slot:[`item.document`]="{ item }">
        <a :href="item.document">download</a>
      </template>
      <template v-slot:[`item.actions`]="{ item }" v-if="currentUser.role === 'incubator'">
        <div class="d-flex">
          <v-btn icon @click="edit(item)"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn icon @click="_delete(item.docId)"
            ><v-icon>mdi-delete</v-icon></v-btn
          >
        </div>
      </template>
    </v-data-table>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="800">
        <v-card>
          <v-card-title class="headline">
            {{ cardTitle }}
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="cancel()"> Cancel </v-btn>
            <v-btn
              color="traktor"
              class="white--text"
              @click="update()"
              v-if="isEdit"
            >
              Update
            </v-btn>
            <v-btn color="traktor" class="white--text" @click="addNew()" v-else>
              Add
            </v-btn>
          </v-card-title>
          <v-card-text class="mt-3">
            <v-text-field
              label="Template title"
              outlined
              dense
              v-model="template.title"
            ></v-text-field>
            <v-file-input
              :label="isEdit ? 'Change document' : 'Choose file'"
              outlined
              dense
              multiple
              v-model="document"
            ></v-file-input>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { uploadFile } from "../../_helpers/FileUpload";
import Swal from "sweetalert2";
import { uploadsRef } from "../../config/firebase_services";
import { mapState } from "vuex";

export default {
  name: "DocumentationTemplates",
  computed: {
    cardTitle: function () {
      return this.isEdit ? "Edit template" : "Add new template";
    },
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  data() {
    return {
      dialog: false,
      isEdit: false,
      document: null,
      template: {
        title: null,
        document: null,
      },
      templates: [],
      headers: [
        {
          text: "Title",
          align: "center",
          sortable: true,
          value: "title",
        },
        {
          text: "Template",
          align: "start",
          sortable: true,
          value: "document",
        },
        {
          text: "Actions",
          align: "start",
          sortable: false,
          value: "actions",
        },
      ],
    };
  },
  created() {
    this.getTemplates();
  },
  methods: {
    getTemplates() {
      uploadsRef
        .doc(this.$store.state.incubator.currentIncubator.docId)
        .collection("documentationTemplates")
        .onSnapshot((snapshot) => {
          this.templates = [];
          snapshot.forEach(async (document) => {
            const data = document.data();
            data.docId = document.id;
            this.templates.push(data);
          });
        });
    },
    async addNew() {
      if (this.document === null || this.template.title === null) {
        this.$toast.error("All fileds are required", {
          position: "top",
        });
        return;
      }

      this.template.document = await uploadFile(this.document, "Uploads");

      try {
        uploadsRef
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .collection("documentationTemplates")
          .add(this.template);

        this.$toast.success("Added", {
          position: "top",
        });
        this.dialog = false;
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },

    edit(item) {
      this.template = item;
      this.isEdit = true;
      this.dialog = true;
    },

    cancel() {
      this.dialog = false;
      this.isEdit = false;
      this.document = null;
    },

    async update() {
      if (this.document !== null && typeof this.document === "object") {
        this.template.document = await uploadFile(this.document, "Website");
        this.updateData();
      } else this.updateData();
    },

    async updateData() {
      try {
        uploadsRef
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .collection("documentationTemplates")
          .doc(this.template.docId)
          .set(this.template, { merge: true });

        this.$toast.success("Updated", {
          position: "top",
        });
        this.dialog = false;
        this.isEdit = false;
        this.document = null;
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },

    _delete(docId) {
      Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            uploadsRef
              .doc(this.$store.state.incubator.currentIncubator.docId)
              .collection("documentationTemplates")
              .doc(docId)
              .delete();

            this.$toast.success("Deleted", {
              position: "top",
            });
          } catch (error) {
            this.$toast.error(error, {
              position: "top",
            });
          }
        }
      });
    },
  },
};
</script>

<style scoped>
>>> th {
  color: #3aa95a !important;
  font-size: 17px !important;
  font-weight: bold !important;
}

a {
  text-decoration: none;
}

.v-btn {
  text-transform: capitalize;
}
</style>