<template>
  <v-container>
    <v-form>
      <v-row>
        <v-col cols="12" md="6">
          <v-row>
            <v-text-field
              label="Annoncement title"
              outlined
              dense
              v-model="announcement.title"
            ></v-text-field>
          </v-row>
          <v-row>
            <!-- <v-textarea
              outlined
              dense
              label="Description"
              v-model="announcement.descriptions"
            ></v-textarea> -->
            <v-col cols="12" md="12">
              <vue-editor v-model="announcement.descriptions"></vue-editor>
            </v-col>
          </v-row>
          <v-row class="mt-5">
            <v-file-input
              label="Announcement banner"
              outlined
              dense
              v-model="announcement.banner"
              @change="handleBanner"
              accept="image/*"
            ></v-file-input>
          </v-row>
          <v-row>
            <v-checkbox
              v-model="announcement.isButton"
              label="Include external link button"
            ></v-checkbox>
          </v-row>
          <v-row v-if="announcement.isButton">
            <v-text-field
              label="Enter the URL"
              outlined
              dense
              v-model="announcement.btnLink"
            ></v-text-field>
          </v-row>
          <div class="d-flex mt-5 mx-auto">
            <v-btn color="traktor" class="mr-2" dark @click="dialog = true"
              >Preview</v-btn
            >
            <v-btn color="traktor" dark @click="update()" v-if="isEdit"
              >Update</v-btn
            >
            <v-btn color="traktor" dark @click="submit()" class="mr-2" v-else
              >Submit</v-btn
            >
            <v-btn color="red" text @click="cancel()" class="mr-2" v-if="isEdit"
              >Cancel</v-btn
            >
          </div>
        </v-col>
        <v-col cols="12" md="6">
          <h2 class="text-center">Announcements</h2>
          <div
            class="mt-2 mx-2 d-flex align-center justify-space-between"
            v-for="(item, index) in announcements"
            :key="index"
          >
            <v-alert type="info" class="alert">
              <marquee>{{ item.title }}</marquee>
            </v-alert>
            <div class="actions">
              <v-btn icon
                ><v-icon size="28" @click="edit(index)"
                  >mdi-pencil</v-icon
                ></v-btn
              >
              <v-btn icon @click="_delete(item.docId)"
                ><v-icon size="28">mdi-delete</v-icon></v-btn
              >
            </div>
          </div>
        </v-col>
      </v-row>
      <preview
        :data="announcement"
        :visible="dialog"
        @close="dialog = false"
        :srcObj="srcObj"
      ></preview>
    </v-form>
  </v-container>
</template>

<script>
import { websiteRef } from "../../config/firebase_services";
import { uploadFile } from "../../_helpers/FileUpload";
import Swal from "sweetalert2";
import Preview from "../Modals/Website/Announcement/Preview.vue";
import { VueEditor } from "vue2-editor";

export default {
  components: { Preview, VueEditor },
  name: "Announcement",
  data() {
    return {
      announcement: {
        title: "",
        descriptions: "",
        banner: "",
        isButton: false,
        btnLink: "",
        createdAt: "",
      },
      announcements: [],
      dialog: false,
      srcObj: "",
      isEdit: false,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async submit() {
      if (this.announcement.title === "") {
        this.$toast.error(`Title is required!`, {
          position: "top",
        });
        return;
      }

      if (this.announcement.descriptions === "") {
        this.$toast.error(`Description cannot be empty!`, {
          position: "top",
        });
        return;
      }

      if (this.announcement.isButton) {
        if (this.announcement.btnLink === "") {
          this.$toast.error(`External button URL is required!`, {
            position: "top",
          });
          return;
        }
      }

      try {
        this.announcement.createdAt = new Date();
        if (typeof this.announcement.banner === "object")
          this.announcement.banner = await uploadFile(
            this.announcement.banner,
            "Website"
          );

        await websiteRef
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .collection("announcements")
          .add(this.announcement);

        this.$toast.success("Created", {
          position: "top",
        });
        this.announcement = {
          title: "",
          descriptions: "",
          banner: "",
          isButton: false,
          btnLink: "",
          createdAt: "",
        };
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
    async update() {
      if (this.announcement.title === "") {
        this.$toast.error(`Title is required!`, {
          position: "top",
        });
        return;
      }

      if (this.announcement.descriptions === "") {
        this.$toast.error(`Description cannot be empty!`, {
          position: "top",
        });
        return;
      }

      if (this.announcement.isButton) {
        if (this.announcement.btnLink === "") {
          this.$toast.error(`External button URL is required!`, {
            position: "top",
          });
          return;
        }
      }

      try {
        this.announcement.createdAt = new Date();
        if (typeof this.announcement.banner === "object")
          this.announcement.banner = await uploadFile(
            this.announcement.banner,
            "Website"
          );

        await websiteRef
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .collection("announcements")
          .doc(this.announcement.docId)
          .set(this.announcement, { merge: true });
        this.isEdit = false;

        this.$toast.success("Updated", {
          position: "top",
        });
        this.announcement = {
          title: "",
          descriptions: "",
          banner: "",
          isButton: false,
          btnLink: "",
          createdAt: "",
        };
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
    getData() {
      websiteRef
        .doc(this.$store.state.incubator.currentIncubator.docId)
        .collection("announcements")
        .onSnapshot((snapshot) => {
          this.announcements = [];
          snapshot.forEach((document) => {
            const data = document.data();
            data.docId = document.id;
            this.announcements.push(data);
          });
        });
    },
    edit(index) {
      this.isEdit = true;
      const obj = this.announcements[index];
      this.announcement = obj;
    },
    cancel() {
      this.isEdit = false;
      this.announcement = {
        title: "",
        descriptions: "",
        banner: "",
        isButton: false,
        btnLink: "",
        createdAt: "",
      };
    },
    async _delete(docId) {
      Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3aa959",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await websiteRef
              .doc(this.$store.state.incubator.currentIncubator.docId)
              .collection("announcements")
              .doc(docId)
              .delete();
            this.$toast.success(`Deleted`, {
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
    handleBanner(img) {
      this.srcObj = URL.createObjectURL(img);
    },
  },
};
</script>

<style scoped>
.v-btn {
  text-transform: capitalize;
}

.alert {
  flex: 0.8;
}

.actions {
  flex: 0.1;
  display: flex;
}
</style>