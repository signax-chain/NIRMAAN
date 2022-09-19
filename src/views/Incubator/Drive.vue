<template>
  <div>
    <div class="d-flex justify-space-between align-center">
      <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="traktor" dark v-bind="attrs" v-on="on">
            New
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="assignFolder()">
            <v-list-item-title>
              <v-icon>mdi-folder-plus</v-icon>
              New Folder
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="assignClick()">
            <v-list-item-title>
              <v-icon>mdi-file-plus</v-icon>
              New File
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div>
      <div class="mx-5 mt-5">
        <v-card elevation="0">
          <v-card-title v-if="parent">
            <v-btn color="traktor" dark text @click="back()">
              <v-icon>mdi-arrow-left</v-icon>
              Back</v-btn
            >
          </v-card-title>
          <v-card-text v-if="drive.length > 0">
            <v-list subheader two-line>
              <v-list-item v-for="item in drive" :key="item.id">
                <v-list-item-avatar>
                  <v-icon
                    class="grey lighten-1"
                    dark
                    v-if="item.type === 'folder'"
                  >
                    mdi-folder
                  </v-icon>
                  <v-icon class="grey lighten-1" dark v-else> mdi-file </v-icon>
                </v-list-item-avatar>

                <v-list-item-content @click="getDrive(item)">
                  <v-list-item-title>
                    {{ item.name }}
                  </v-list-item-title>

                  <v-list-item-subtitle>{{
                    Date(item.created_at)
                  }}</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="" icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        @click="assignClick(item.id)"
                        v-if="item.type === 'folder'"
                      >
                        <v-list-item-title>New File</v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        @click="assignFolder(item.id)"
                        v-if="item.type === 'folder'"
                      >
                        <v-list-item-title>New Folder</v-list-item-title>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>Rename</v-list-item-title>
                      </v-list-item>
                      <v-list-item v-if="item.type === 'file'">
                        <v-list-item-title>Download</v-list-item-title>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>Delete</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item-action>
              </v-list-item>
              <v-divider></v-divider>
            </v-list>
          </v-card-text>
          <v-card-text v-else>
            <v-alert
              type="info"
              icon="mdi-folder-information"
              v-if="parent"
              outlined
            >
              This folder is empty
            </v-alert>
          </v-card-text>
        </v-card>
      </div>
    </div>
    <new-folder
      :visible="createFolderDialog"
      @close="createFolderDialog = false"
      @createFolder="createFolder"
    ></new-folder>
    <input type="file" ref="file" style="display: none" @change="createFile" />
    <progress-loader
      :visible="progressLoader"
      loaderText="Uploading..."
      @close="progressLoader = false"
    ></progress-loader>
  </div>
</template>

<script>
import { mapState } from "vuex";
import NewFolder from "../../components/Modals/Drive/NewFolder.vue";
import ProgressLoader from "../../components/Modals/Loaders/ProgressLoader.vue";
import { driveRef } from "../../config/firebase_services";
import { uploadFileWithName } from "../../_helpers/FileUpload";
export default {
  components: {
    NewFolder,
    ProgressLoader,
  },
  data() {
    return {
      createFolderDialog: false,
      progressLoader: false,
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
        },
        {
          text: "Drive",
          disabled: true,
        },
      ],
      drive: [],
      parent: "",
    };
  },
  created() {
    this.getDrive();
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
  },
  methods: {
    back() {
      this.getDrive(this.parent);
    },
    assignFolder(id) {
      console.log(id);
      this.parent = id ? id : "";
      this.createFolderDialog = true;
    },
    async getDrive(item) {
      if (item !== undefined && item.type === "file") {
        window.open(item.filePath, "_blank");
        return;
      }
      this.parent = item && item.id ? item.id : "";
      this.drive = [];
      const documents = await driveRef
        .where("user_id", "==", this.$store.state.user.currentUser.docId)
        .where("parent", "==", this.parent)
        .get();

      documents.forEach((doc) => {
        this.drive.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      console.log(this.drive);
    },
    async createFolder(name) {
      try {
        const data = {
          name: name,
          type: "folder",
          parent: this.parent,
          created_at: new Date(),
          user_id: this.currentUser.docId,
        };
        await driveRef.add(data);
        this.$store.dispatch("SHOW_SNACKBAR", {
          showing: true,
          text: "Created",
          color: "success",
        });
        console.log(data);
        this.createFolderDialog = false;
      } catch (error) {
        this.$store.dispatch("SHOW_SNACKBAR", {
          showing: true,
          text: "Error",
          color: "error",
        });
        console.log(error);
      }
    },
    async createFile() {
      try {
        this.progressLoader = true;
        const filePath = await uploadFileWithName(
          this.$refs.file.files[0],
          "drive"
        );
        const data = {
          name: this.$refs.file.files[0].name,
          type: "file",
          filePath: filePath,
          parent: this.parent,
          created_at: new Date(),
          user_id: this.currentUser.docId,
        };
        await driveRef.add(data);
        this.progressLoader = false;
        this.$store.dispatch("SHOW_SNACKBAR", {
          showing: true,
          text: "Created",
          color: "success",
        });
        this.parent = "";
      } catch (error) {
        this.$store.dispatch("SHOW_SNACKBAR", {
          showing: true,
          text: "Error",
          color: "error",
        });
      }
    },
    assignClick(id) {
      console.log(id);
      this.parent = id ? id : "";
      this.$refs.file.click();
    },
  },
};
</script>

<style scoped>
>>> a {
  text-decoration: none !important;
}

.v-list-item {
  cursor: pointer;
}
</style>