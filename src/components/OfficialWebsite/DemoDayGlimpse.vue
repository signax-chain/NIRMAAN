<template>
  <div>
    <v-btn
      color="traktor"
      class="white--text ml-auto d-block"
      @click="dialog = true"
      >Add new <v-icon>mdi-plus-circle</v-icon></v-btn
    >
    <v-row>
      <v-col cols="12" md="12">
        <div class="d-flex flex-wrap justify-space-between">
          <div
            v-for="(src, index) in items"
            :key="index"
            class="pic mr-2 mt-3"
            @click="() => showImg(index)"
          >
            <img :src="src" width="200" />
          </div>
          <vue-easy-lightbox
            escDisabled
            moveDisabled
            :visible="visible"
            :imgs="items"
            :index="index"
            @hide="handleHide"
          ></vue-easy-lightbox>
        </div>
      </v-col>
    </v-row>
    <v-dialog persistent v-model="dialog" width="400">
      <v-card>
        <v-card-title>Add new Image</v-card-title>
        <v-card-text>
          <v-file-input
            label="Choose Image"
            outlined
            dense
            v-model="image"
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="red" @click="dialog = false">Close</v-btn>
          <v-btn color="traktor" class="white--text" @click="add()">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { websiteRef } from "../../config/firebase_services";
import { uploadFile } from "../../_helpers/FileUpload";
import VueEasyLightbox from "vue-easy-lightbox";

export default {
  name: "DemoDayGlimpse",
  components: {
    VueEasyLightbox,
  },
  data() {
    return {
      dialog: false,
      image: "",
      items: [],
      visible: false,
      index: 0, // default: 0
    };
  },
  created() {
    this.getImages();
  },
  methods: {
    showImg(index) {
      this.index = index;
      this.visible = true;
    },
    handleHide() {
      this.visible = false;
    },
    async getImages() {
      await await websiteRef
        .doc(this.$store.state.incubator.currentIncubator.docId)
        .collection("demoDayGlimpse")
        .onSnapshot((snapshot) => {
          this.items = [];
          snapshot.forEach((document) => {
            this.items.push(document.data()["image"]);
          });
        });
    },
    async add() {
      if (this.image === "") {
        this.$toast.error("Image cannot be empty!", {
          position: "top",
        });
        return;
      }

      try {
        this.image = await uploadFile(this.image, "Website");
        await websiteRef
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .collection("demoDayGlimpse")
          .add({ image: this.image });
        this.image = "";
        this.dialog = false;
        this.$toast.success("Added", {
          position: "top",
        });
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
.v-btn {
  text-transform: capitalize;
}

.pic {
  cursor: pointer;
}
</style>