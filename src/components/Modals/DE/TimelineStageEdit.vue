<template>
  <v-dialog persistent v-model="show" max-width="700">
    <v-card>
      <v-card-title class="heading">Edit stage</v-card-title>
      <v-card-text class="mt-5">
        <v-text-field
          outlined
          label="Stage title"
          dense
          v-model="data.title"
        ></v-text-field>
        <v-row>
          <v-col cols="12" md="8">
            <v-file-input
              label="Stage Icon"
              outlined
              dense
              v-model="data.icon"
              accept="image/png, image/jpeg, image/jpg, image/svg"
              counter
              :rules="rules.iconRule"
              show-size
              @change="handleIcon"
            ></v-file-input>
          </v-col>
          <v-col cols="12" md="4">
            <img :src="src" :alt="data.title" />
          </v-col>
        </v-row>
        <v-row v-for="(step, i) in data.steps" :key="i">
          <v-col cols="12" md="2"></v-col>
          <v-col cols="12" md="4">
            <v-text-field
              label="Step title"
              :prefix="i + 1"
              outlined
              dense
              :rules="rules.titleRule"
              v-model="step.title"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              icon
              color="red"
              @click="deleteStep(i)"
              v-if="data.steps.length > 1"
              ><v-icon>mdi-delete</v-icon></v-btn
            >
            <v-btn
              icon
              color="traktor"
              @click="addStep()"
              v-if="i === data.steps.length - 1"
              ><v-icon>mdi-plus-circle</v-icon></v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="show = false">Close</v-btn>
        <v-btn color="traktor" dark @click="update()">Update</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { uploadFile } from "../../../_helpers/FileUpload";
export default {
  name: "TimelineStageEdit",
  props: ["visible", "data", "srcObj"],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) return this.$emit("close");
      },
    },
    src: function () {
      return this.srcObj;
    },
  },
  data() {
    return {
      rules: {
        iconRule: [(v) => !!v || "Icon is required"],
        titleRule: [(v) => !!v || "Title is required"],
      },
    };
  },
  methods: {
    handleIcon(icon) {
      this.$emit("handleSrcObj", icon);
    },
    addStep() {
      this.data.steps.push({
        title: "",
        active: this.data.steps[0].active,
      });
    },
    deleteStep(index) {
      this.data.steps.splice(index, 1);
    },
    async update() {
      try {
        if (typeof this.data.icon === "object") {
          this.data.icon = await uploadFile(this.data.icon, "DE");
        }
        this.$emit("update");
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
img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  filter: invert(1);
}
</style>