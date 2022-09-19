<template>
  <v-dialog persistent max-width="1250" v-model="show">
    <v-card>
      <v-card-title class="heading"
        >{{ step.title }}
        <v-spacer></v-spacer>
        <v-btn color="traktor" disabled class="mr-3" v-if="uploading"
          >Uploading file
          <v-progress-circular
            indeterminate
            color="traktor"
            class="ml-2"
          ></v-progress-circular>
        </v-btn>
        <v-btn
          v-else
          color="traktor"
          dark
          @click="upload()"
          v-show="currentUser.role === 'incubator' && !strRes && !step.ppt"
          >Upload ppt</v-btn
        >
        <v-btn
          color="red"
          text
          @click="_delete()"
          v-if="step.ppt"
          v-show="currentUser.role === 'incubator' && !strRes"
          >Delete</v-btn
        >
        <v-btn color="traktor" dark text @click="show = false"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-card-title>
      <v-card-text class="mt-5">
        <div
          class="videoSection"
          @click="$refs.file.click()"
          v-if="step.ppt === '' || step.ppt === undefined"
          v-show="currentUser.role === 'incubator'"
        >
          <h1 class="text-center">{{ pptTitle }}</h1>
        </div>
        <embed
          :src="step.ppt"
          :width="width"
          :height="height"
          v-else
          type="application/pdf"
        />
        <input
          type="file"
          label="Select file"
          dense
          outlined
          class="d-none"
          accept="application/pdf"
          ref="file"
          @change="handlePpt"
        />
        <span style="color: red" v-if="!step.ppt">* Upload only pdf files</span>
      </v-card-text>
      <v-card-actions> </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "PPT",
  props: ["visible", "step", "uploading", "strRes"],
  data() {
    return {
      ppt: "",
    };
  },
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) this.$emit("close");
      },
    },
    width: function () {
      return !this.step.ppt ? "500px" : "1200px";
    },
    height: function () {
      return !this.step.ppt ? "400px" : "800px";
    },
    btnTitle: function () {
      return this.step.ppt === "" || this.step.ppt === undefined
        ? "Upload"
        : "Change ppt";
    },
    pptTitle: function () {
      return this.ppt === "" ? "Choose the file" : this.ppt.name;
    },
  },
  methods: {
    handlePpt(e) {
      this.ppt = e.target.files[0];
    },
    async toPDF(base64String) {
      try {
        const response = await axios.post(
          "http://localhost:5000/de/ppt/convert",
          {
            base64String: base64String,
          }
        );
        const bs = atob(response.data.pdf_base64);
        const buffer = new ArrayBuffer(bs.length);
        const ba = new Uint8Array(buffer);
        for (let i = 0; i < bs.length; i++) {
          ba[i] = bs.charCodeAt(i);
        }
        const file = new Blob([ba], {
          type: "application/pdf",
        });
        this.$emit("uploadPpt", file);
      } catch (error) {
        console.log(error);
      }
    },
    async toBase64String() {
      let reader = new FileReader();
      reader.readAsDataURL(this.ppt);
      reader.onload = () => this.toPDF(reader.result);
      reader.onerror = (error) => console.log("Error: ", error);
    },
    async upload() {
      if (this.ppt === "") {
        this.$toast.error("Ppt cannot be empty!", {
          position: "top",
        });
        return;
      }

      // if (Math.floor(this.ppt.size) >= 10000000) {
      //   this.$toast.error("ppt size cannot be more than 10Mb", {
      //     position: "top",
      //   });
      //   return;
      // }
      // await this.toBase64String();
      this.uploading = true;
      this.$emit("uploadPpt", this.ppt);
    },
    _delete() {
      this.$emit("delete");
    },
  },
};
</script>

<style scoped>
.videoSection {
  border: 1px dotted #000;
  height: 250px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.heading {
  color: #3aa959;
}

iframe {
  width: 100%;
  height: 300px;
  border: none;
  outline: none;
  border-radius: 5px;
}

>>> .v-dialog:not(.v-dialog--fullscreen) {
  max-height: 95% !important;
}
</style>