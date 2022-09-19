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
        <draggable
          class="d-flex flex-wrap"
          :list="items"
          group="banner"
          @end="onEnd"
        >
          <div v-for="(item, index) in items" :key="index" class="img__block">
            <img
              :src="item.image"
              :alt="item.title"
              width="250"
              height="150"
              class="mt-5"
            />
            <div class="actions">
              <v-icon @click="edit(item)">mdi-pencil</v-icon>
              <v-icon @click="_delete(item.docId)">mdi-delete</v-icon>
            </div>
            <h3>{{ item.title }}</h3>
          </div>
        </draggable>
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
            :src="isMobile ? slide.mblImage : slide.image"
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
    <v-dialog persistent v-model="dialog" width="1000">
      <v-card>
        <v-card-title
          >{{ dialogTitle }}
          <v-spacer></v-spacer>
          <v-btn text color="red" @click="close()">Close</v-btn>
          <v-btn color="traktor" class="white--text" disabled v-if="uploading"
            >Uploading...</v-btn
          >
          <v-btn
            color="traktor"
            class="white--text"
            @click="isEdit ? update() : add()"
            v-else
            >{{ dialogBtnTitle }}</v-btn
          >
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="12">
              <v-text-field
                label="Title"
                outlined
                dense
                v-model="item.title"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-file-input
                label="Banner desktop image"
                outlined
                dense
                v-model="item.image"
              ></v-file-input>
            </v-col>
            <v-col cols="12" md="6">
              <v-file-input
                label="Banner mobile image"
                outlined
                dense
                v-model="item.mblImage"
              ></v-file-input>
            </v-col>
          </v-row>
          <v-checkbox
            v-model="item.isButton"
            label="Include know more button"
          ></v-checkbox>
          <v-row v-if="item.isButton">
            <v-col cols="12" md="12">
              <v-file-input
                label="Landing page banner"
                outlined
                dense
                v-model="item.landingImage"
              ></v-file-input>
              <!-- <v-textarea
                outlined
                dense
                label="Landing page description"
                v-model="item.descriptions"
              ></v-textarea> -->
              <vue-editor v-model="item.descriptions"></vue-editor>

              <v-row class="mt-3">
                <v-col cols="12" md="4">
                  <v-checkbox
                    v-model="item.isExploreBtn"
                    label="Include link"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" md="4" v-if="item.isExploreBtn">
                  <v-text-field
                    outlined
                    dense
                    label="External URL for explore more"
                    v-model="item.exploreMoreURL"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { websiteRef } from "../../config/firebase_services";
import { uploadFile } from "../../_helpers/FileUpload";
import draggable from "vuedraggable";
import { VueEditor } from "vue2-editor";

export default {
  name: "MainSlider",
  components: {
    draggable,
    VueEditor,
  },
  computed: {
    dialogTitle: function () {
      return this.isEdit ? "Edit Banner" : "Add new Banner";
    },
    dialogBtnTitle: function () {
      return this.isEdit ? "Update" : "Add";
    },
  },
  data() {
    return {
      dialog: false,
      item: {
        title: "",
        image: "",
        mblImage: "",
        isButton: false,
        order: "",
        landingImage: "",
        descriptions: "",
        isExploreBtn: false,
        exploreMoreURL: "",
        to: "",
      },
      items: [],
      uploading: false,
      isEdit: false,
    };
  },
  created() {
    this.getImages();
  },
  mounted() {
    addEventListener("resize", this.isMobile);
  },
  methods: {
    isMobile() {
      return screen.width <= 600 ? true : false;
    },
    async getImages() {
      websiteRef
        .doc(this.$store.state.incubator.currentIncubator.docId)
        .collection("mainSlider")
        .orderBy("order")
        .onSnapshot((snapshot) => {
          this.items = [];
          snapshot.forEach((document) => {
            const data = document.data();
            data.docId = document.id;
            this.items.push(data);
          });
        });
    },
    close() {
      this.item = {
        title: "",
        image: "",
        mblImage: "",
        isButton: false,
        order: "",
        landingImage: "",
        descriptions: "",
        isExploreBtn: false,
        exploreMoreURL: "",
        to: "",
      };
      this.dialog = false;
      this.isEdit = false;
    },
    async add() {
      if (this.item.image === "") {
        this.$toast.error(`Desktop image cannot be empty!`, {
          position: "top",
        });
        return;
      }

      if (this.item.mblImage === "") {
        this.$toast.error(`Mobile image cannot be empty!`, {
          position: "top",
        });
        return;
      }

      if (this.item.isButton) {
        if (this.item.landingImage === "") {
          this.$toast.error(`Landing image cannot be empty!`, {
            position: "top",
          });
          return;
        }

        if (this.item.descriptions === "") {
          this.$toast.error(`Description cannot be empty!`, {
            position: "top",
          });
          return;
        }

        if (this.item.isExploreBtn) {
          if (this.item.exploreMoreURL === "") {
            this.$toast.error(`Explore button URL is required!`, {
              position: "top",
            });
            return;
          }
        }
      }

      try {
        this.uploading = true;
        this.item.order = parseInt(this.items.length + 1);
        this.item.image = await uploadFile(this.item.image, "Website");
        this.item.mblImage = await uploadFile(this.item.mblImage, "Website");

        if (typeof this.item.landingImage === "object") {
          this.item.landingImage = await uploadFile(
            this.item.landingImage,
            "Website"
          );
        }
        this.item.createdAt = new Date();
        await websiteRef
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .collection("mainSlider")
          .add(this.item);
        this.item = { title: "", image: "" };
        this.dialog = false;
        this.$toast.success("Added", {
          position: "top",
        });
        this.uploading = false;

        this.item = {
          title: "",
          image: "",
          mblImage: "",
          isButton: false,
          order: "",
          landingImage: "",
          descriptions: "",
          isExploreBtn: false,
          exploreMoreURL: "",
          to: "",
        };
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
        this.uploading = false;
      }
    },
    edit(item) {
      this.isEdit = true;
      this.item = item;
      this.dialog = true;
    },
    async update() {
      if (this.item.image === "") {
        this.$toast.error(`Desktop image cannot be empty!`, {
          position: "top",
        });
        return;
      }

      if (this.item.mblImage === "") {
        this.$toast.error(`Mobile image cannot be empty!`, {
          position: "top",
        });
        return;
      }

      if (this.item.isButton) {
        if (this.item.landingImage === "") {
          this.$toast.error(`Landing image cannot be empty!`, {
            position: "top",
          });
          return;
        }

        if (this.item.descriptions === "") {
          this.$toast.error(`Description cannot be empty!`, {
            position: "top",
          });
          return;
        }

        if (this.item.isExploreBtn) {
          if (this.item.exploreMoreURL === "") {
            this.$toast.error(`Explore button URL is required!`, {
              position: "top",
            });
            return;
          }
        }
      }

      try {
        this.uploading = true;
        this.item.order = parseInt(this.items.length + 1);

        if (typeof this.item.image === "object")
          this.item.image = await uploadFile(this.item.image, "Website");

        if (typeof this.item.mblImage === "object")
          this.item.mblImage = await uploadFile(this.item.mblImage, "Website");

        if (typeof this.item.landingImage === "object") {
          this.item.landingImage = await uploadFile(
            this.item.landingImage,
            "Website"
          );
        }
        this.item.createdAt = new Date();
        await websiteRef
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .collection("mainSlider")
          .doc(this.item.docId)
          .set(this.item, { merge: true });
        this.dialog = false;
        this.$toast.success("Updated", {
          position: "top",
        });
        this.uploading = false;
        this.isEdit = false;

        this.item = {
          title: "",
          image: "",
          mblImage: "",
          isButton: false,
          order: "",
          landingImage: "",
          descriptions: "",
          isExploreBtn: false,
          exploreMoreURL: "",
          to: "",
        };
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
        this.uploading = false;
      }
    },
    validateOrder(e) {
      const obj = this.items.find((item) => item.order == e.key);
      if (obj !== undefined) {
        this.$toast.error(
          `Order ${e.key} already given for other banner, either change the order for this banner or the existed one!...`,
          {
            position: "top",
          }
        );
      }
    },
    updateOrder(i, v) {
      return new Promise((resolve) => {
        try {
          websiteRef
            .doc(this.$store.state.incubator.currentIncubator.docId)
            .collection("mainSlider")
            .doc(this.items[i].docId)
            .set(v, { merge: true });
          resolve(true);
        } catch (error) {
          this.$toast.error(error, {
            position: "top",
          });
        }
      });
    },
    async onEnd() {
      for (let [i, v] of this.items.entries()) {
        this.items[i].order = i + 1;
        await this.updateOrder(i, v);
        if (i === this.items.length - 1)
          this.$toast.success("Order changed", {
            position: "top",
          });
      }
    },
    _delete(docId) {
      try {
        websiteRef
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .collection("mainSlider")
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
    },
  },
};
</script>

<style scoped>
.v-btn {
  text-transform: capitalize;
}

.actions {
  position: absolute;
  display: none;
  margin-left: -50px;
  margin-top: -10px;
}

.img__block {
  cursor: move;
}

.img__block:hover .actions {
  display: inline-block;
}

>>> .v-dialog:not(.v-dialog--fullscreen) {
  max-height: 98vh;
}
</style>