<template>
  <div class="mb-5">
    <v-btn
      color="traktor"
      class="white--text d-block ml-auto"
      @click="dialog = true"
      >Upload <v-icon>mdi-plus-circle</v-icon></v-btn
    >
    <div class="card__row">
      <div class="card__col" v-for="(item, index) in partners" :key="index">
        <img :src="item.image" :alt="item.docId" />
        <div class="acions">
          <v-icon @click="_delete(item.docId)">mdi-delete</v-icon>
        </div>
      </div>
    </div>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="800">
        <v-card>
          <v-card-title class="headline">
            Upload partners logo
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="cancel()"> Cancel </v-btn>
            <v-btn color="traktor" class="white--text" @click="upload()">
              Upload
            </v-btn>
          </v-card-title>
          <v-card-text class="mt-3">
            <v-file-input
              label="Choose partner logos"
              outlined
              dense
              multiple
              v-model="images"
            ></v-file-input>
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
  name: "Partners",
  data() {
    return {
      dialog: false,
      partners: [],
      images: [],
    };
  },
  created() {
    this.getPartners();
  },
  methods: {
    getPartners() {
      firebase
        .firestore()
        .collection("website")
        .doc(this.$store.state.incubator.currentIncubator.docId)
        .collection("partners")
        .onSnapshot((snapshot) => {
          this.partners = [];
          snapshot.forEach(async (document) => {
            const data = document.data();
            data.docId = document.id;
            this.partners.push(data);
          });
        });
    },

    async upload() {
      if (this.images.length === 0) {
        this.$toast.error("Select atlest one file", {
          position: "top",
        });
        return;
      }

      let counter = 0;

      this.images.forEach(async (image) => {
        let partners = {};
        const imgPath = await uploadFile(image, "Website");
        partners.image = imgPath;

        try {
          firebase
            .firestore()
            .collection("website")
            .doc(this.$store.state.incubator.currentIncubator.docId)
            .collection("partners")
            .add(partners);

          counter++;

          if (this.images.length === counter) {
            this.$toast.success("Added", {
              position: "top",
            });
            this.dialog = false;
            this.images = [];
          }
        } catch (error) {
          this.$toast.error(error, {
            position: "top",
          });
        }
      });
    },

    cancel() {
      this.dialog = false;
      this.images = [];
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
              .collection("partners")
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
  width: 180px;
  height: 180px;
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