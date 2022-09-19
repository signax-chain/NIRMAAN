<template>
  <v-dialog persistent max-width="700" v-model="show">
    <v-card>
      <v-card-title class="heading"
        >{{ step.title }}
        <v-spacer></v-spacer>
        <v-btn color="traktor" disabled class="mr-3" v-if="uploading"
          >Uploading video
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
          v-show="currentUser.role === 'incubator' && !strRes && !step.video"
          >Upload</v-btn
        >
        <v-btn
          color="red"
          text
          @click="_delete()"
          v-if="step.video"
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
          v-if="step.video === '' || step.video === undefined"
          v-show="currentUser.role === 'incubator'"
        >
          <h1 class="text-center">{{ videoTitle }}</h1>
        </div>
        <iframe
          :src="step.video"
          allowfullscreen="true"
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
          v-else
        ></iframe>
        <input
          type="file"
          label="Select video"
          dense
          outlined
          class="d-none"
          accept="video/*"
          ref="file"
          @change="handleVideo"
        />
        <h3 class="text-center my-3" v-if="step.video === ''">Or</h3>
        <v-text-field
          outlined
          label="Video URL"
          dense
          v-model="video.name"
          v-if="step.video === ''"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Video",
  props: ["visible", "step", "uploading", "strRes"],
  data() {
    return {
      video: "",
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
    btnTitle: function () {
      return this.step.video === "" || this.step.video === undefined
        ? "Upload"
        : "Change video";
    },
    videoTitle: function () {
      return this.video === "" ? "Choose a video" : this.video.name;
    },
  },
  methods: {
    handleVideo(e) {
      this.video = e.target.files[0];
    },
    upload() {
      if (this.video === "") {
        this.$toast.error("video cannot be empty!", {
          position: "top",
        });
        return;
      }
      this.uploading = true;

      // if (Math.floor(this.video.size) >= 10000000) {
      //   this.$toast.error("video size cannot be more than 10Mb", {
      //     position: "top",
      //   });
      //   return;
      // }
      this.$emit("uploadVideo", this.video);
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
</style>