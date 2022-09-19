<template>
  <div>
    <v-btn
      color="traktor"
      class="white--text ml-auto d-block"
      @click="dialog = true"
      >Add new <v-icon>mdi-plus-circle</v-icon></v-btn
    >
    <v-row>
      <v-col cols="12" md="6" class="d-flex flex-wrap justify-space-between">
        <div v-for="(item, index) in items" :key="index">
          <img
            :src="item.image"
            :alt="item.title"
            width="250"
            height="150"
            class="mt-5"
          />
          <h3>{{ item.title }}</h3>
        </div>
      </v-col>
      <v-col cols="12" md="6" class="align-center d-flex">
        <v-carousel
          cycle
          height="300"
          hide-delimiter-background
          show-arrows-on-hover
        >
          <v-carousel-item
            v-for="(slide, i) in items"
            :key="i"
            :src="slide.image"
            reverse-transition="fade-transition"
            transition="fade-transition"
          >
            <v-row class="fill-height" align="center" justify="center">
              <div class="display-3">{{ slide.title }}</div>
            </v-row>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
    <v-dialog persistent v-model="dialog" width="500">
      <v-card>
        <v-card-title
          >Add new Image
          <v-spacer></v-spacer>
          <v-btn text color="red" @click="dialog = false">Close</v-btn>
          <v-btn color="traktor" class="white--text" @click="add()">Add</v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field
            label="Title"
            outlined
            dense
            v-model="item.title"
          ></v-text-field>
          <v-file-input
            label="Choose Image"
            outlined
            dense
            v-model="item.image"
          ></v-file-input>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { websiteRef } from "../../config/firebase_services";
import { uploadFile } from "../../_helpers/FileUpload";
export default {
  name: "SecondSlider",
  data() {
    return {
      dialog: false,
      item: {
        title: "",
        image: "",
      },
      items: [],
    };
  },
  created() {
    this.getImages();
  },
  methods: {
    async getImages() {
      await await websiteRef
        .doc(this.$store.state.incubator.currentIncubator.docId)
        .collection("secondSlider")
        .onSnapshot((snapshot) => {
          this.items = [];
          snapshot.forEach((document) => {
            this.items.push(document.data());
          });
        });
    },
    async add() {
      const nullField = Object.keys(this.item).find(
        (key) => this.item[key] === ""
      );
      if (nullField !== undefined) {
        this.$toast.error(`${nullField} cannot be empty!`, {
          position: "top",
        });
        return;
      }

      try {
        this.item.image = await uploadFile(this.item.image, "Website");
        await websiteRef
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .collection("secondSlider")
          .add(this.item);
        this.item = { title: "", image: "" };
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
</style>