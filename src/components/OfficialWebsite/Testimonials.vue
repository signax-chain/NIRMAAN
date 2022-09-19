<template>
  <div class="mb-5">
    <v-btn
      color="traktor"
      class="white--text d-block ml-auto"
      @click="dialog = true"
      >Add new <v-icon>mdi-plus-circle</v-icon></v-btn
    >
    <div class="card__row">
      <div class="card__col" v-for="(item, index) in testimonials" :key="index">
        <img :src="item.image" :alt="item.name" />
        <div class="acions">
          <v-icon @click="edit(item)">mdi-pencil</v-icon>
          <v-icon @click="_delete(item.docId)">mdi-delete</v-icon>
        </div>
        <h3>{{ item.name }}</h3>
        <h4>{{ item.designation }}</h4>
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
              :src="item.image"
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
            <v-text-field
              outlined
              dense
              label="Designation"
              v-model="item.designation"
            ></v-text-field>
            <v-textarea
              outlined
              dense
              label="Feedback"
              v-model="item.feedback"
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
  name: "Testimonials",
  computed: {
    cardTitle: function () {
      return this.isEdit ? "Edit testimonial" : "Add new testimonial";
    },
  },
  data() {
    return {
      testimonials: [],
      dialog: false,
      isEdit: false,
      image: null,
      item: {
        active: false,
        designation: null,
        feedback: null,
        name: null,
        image: null,
      },
    };
  },
  created() {
    this.getTestimonials();
  },
  methods: {
    getTestimonials() {
      firebase
        .firestore()
        .collection("website")
        .doc(this.$store.state.incubator.currentIncubator.docId)
        .collection("testimonials")
        .onSnapshot((snapshot) => {
          this.testimonials = [];
          snapshot.forEach(async (document) => {
            const data = document.data();
            data.docId = document.id;
            this.testimonials.push(data);
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
        this.item.feedback === null ||
        this.item.designation === null
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

      this.item.image = await uploadFile(this.image, "Website");

      try {
        firebase
          .firestore()
          .collection("website")
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .collection("testimonials")
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
        this.item.image = await uploadFile(this.image, "Website");
        this.updateData();
      } else this.updateData();
    },

    async updateData() {
      try {
        firebase
          .firestore()
          .collection("website")
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .collection("testimonials")
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
              .collection("testimonials")
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
      this.item.image = null;
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

.card__col:hover .acions {
  display: inline-block;
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

.v-icon {
  cursor: pointer;
}

>>> .v-dialog:not(.v-dialog--fullscreen) {
  max-height: 95% !important;
  border-radius: 10px !important;
}

h3 {
  color: #3aa95a;
}

@media only screen and (max-width: 600px) {
  .card__col {
    width: 100%;
  }

  img {
    object-fit: contain;
  }
}
</style>