<template>
  <div class="mb-5">
    <v-btn
      color="traktor"
      class="white--text d-block ml-auto"
      @click="dialog = true"
      >Add new <v-icon>mdi-plus-circle</v-icon></v-btn
    >
    <div class="card__row">
      <div class="card__col" v-for="(item, index) in boardMembers" :key="index">
        <img :src="item.photoURL" :alt="item.name" />
        <div class="acions">
          <v-icon @click="edit(item)">mdi-pencil</v-icon>
          <v-icon @click="_delete(item.docId)">mdi-delete</v-icon>
        </div>
        <h3>{{ item.name }}</h3>
      </div>
    </div>
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
            <img
              :src="item.photoURL"
              :alt="item.name"
              class="d-block mx-auto mb-3"
              v-if="isEdit"
            />
            <v-file-input
              :label="isEdit ? 'Change image' : 'Choose image'"
              outlined
              dense
              v-model="image"
            ></v-file-input>
            <v-text-field
              outlined
              dense
              label="Name"
              v-model="item.name"
            ></v-text-field>
            <v-textarea
              outlined
              dense
              label="Description"
              v-model="item.description"
            ></v-textarea>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import firebase from "firebase";
import { uploadFile } from "../../_helpers/FileUpload";
import Swal from "sweetalert2";

export default {
  name: "BoardMembers",
  computed: {
    cardTitle: function () {
      return this.isEdit ? "Edit member" : "Add new member";
    },
  },
  data() {
    return {
      boardMembers: [],
      dialog: false,
      isEdit: false,
      image: null,
      item: {
        name: null,
        description: null,
        photoURL: null,
      },
    };
  },
  created() {
    this.getBoardMembers();
  },
  methods: {
    getBoardMembers() {
      firebase
        .firestore()
        .collection("website")
        .doc(this.$store.state.incubator.currentIncubator.docId)
        .collection("boardMembers")
        .onSnapshot((snapshot) => {
          this.boardMembers = [];
          snapshot.forEach(async (document) => {
            const data = document.data();
            data.docId = document.id;
            this.boardMembers.push(data);
          });
        });
    },

    edit(item) {
      this.item = item;
      this.isEdit = true;
      this.dialog = true;
    },

    cancel() {
      this.dialog = false;
      this.isEdit = false;
      this.image = null;
      // this.setToNull();
    },

    async addNew() {
      if (
        this.image === null ||
        this.item.name === null ||
        this.item.description === null
      ) {
        this.$toast.error("All fileds are required", {
          position: "top",
        });
        return;
      }

      if (!this.checkFileType(this.image)) {
        this.$toast.error("File format is not supported", {
          position: "top",
        });
        return;
      }

      this.item.photoURL = await uploadFile(this.image, "Website");

      try {
        firebase
          .firestore()
          .collection("website")
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .collection("boardMembers")
          .add(this.item);

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

    checkFileType(file) {
      const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedImageTypes.includes(file.type)) return false;
      else return true;
    },

    async update() {
      if (this.image !== null && typeof this.image === "object") {
        if (!this.checkFileType(this.image)) {
          this.$toast.error("File format is not supported", {
            position: "top",
          });
          return;
        }
        this.item.photoURL = await uploadFile(this.image, "Website");
        this.updateData();
      } else this.updateData();
    },

    async updateData() {
      try {
        firebase
          .firestore()
          .collection("website")
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .collection("boardMembers")
          .doc(this.item.docId)
          .set(this.item, { merge: true });

        this.$toast.success("Updated", {
          position: "top",
        });
        this.dialog = false;
        this.isEdit = false;
        this.image = null;
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
            firebase
              .firestore()
              .collection("website")
              .doc(this.$store.state.incubator.currentIncubator.docId)
              .collection("boardMembers")
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

    setToNull() {
      this.item.name = null;
      this.item.description = null;
      this.item.photoURL = null;
    },
  },
};
</script>

<style scoped>
.card__row {
  display: flex;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
}

.card__col {
  width: 25%;
  margin-top: 20px;
  text-align: center;
}

img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.acions {
  position: absolute;
  display: none;
}

.card__col:hover .acions {
  display: inline-block;
}

.v-icon {
  cursor: pointer;
}

>>> .v-dialog:not(.v-dialog--fullscreen) {
  max-height: 95% !important;
  border-radius: 10px !important;
}

@media only screen and (max-width: 600px) {
  .card__col {
    width: 100%;
  }
}
</style>