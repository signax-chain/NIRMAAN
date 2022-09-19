<template>
  <v-dialog persistent max-width="800" v-model="show">
    <v-card>
      <v-card-title class="heading">{{ dialogTitle }}</v-card-title>
      <v-card-text class="mt-2">
        <div class="wrapper">
          <v-row v-for="(item, i) in items" :key="i">
            <v-col cols="12" md="5">
              <v-text-field
                label="Stage title"
                :prefix="i + 1"
                outlined
                dense
                v-model="item.title"
                :rules="rules.titleRule"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="5">
              <v-file-input
                label="Stage Icon"
                outlined
                dense
                v-model="item.icon"
                accept="image/png, image/jpeg, image/jpg, image/svg"
                counter
                :rules="rules.iconRule"
                show-size
              ></v-file-input>
            </v-col>
            <v-col cols="12" md="2">
              <v-btn
                icon
                color="red"
                @click="deleteModule(i)"
                v-if="items.length > 1"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
              <v-btn
                icon
                color="traktor"
                @click="addModule()"
                v-if="i === items.length - 1"
                ><v-icon>mdi-plus-circle</v-icon></v-btn
              >
            </v-col>
            <v-row v-for="(step, j) in item.steps" :key="j">
              <v-col cols="12" md="2"></v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  label="Step title"
                  :prefix="j + 1"
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
                  @click="deleteStep(i, j)"
                  v-if="item.steps.length > 1"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
                <v-btn
                  icon
                  color="traktor"
                  @click="addStep(i)"
                  v-if="j === item.steps.length - 1"
                  ><v-icon>mdi-plus-circle</v-icon></v-btn
                >
              </v-col>
            </v-row>
          </v-row>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="traktor" disabled class="mr-3" v-if="creating"
          >Creating timeline
          <v-progress-circular
            indeterminate
            color="traktor"
            class="ml-2"
          ></v-progress-circular>
        </v-btn>
        <v-btn
          color="traktor"
          dark
          @click="addNew ? update() : create()"
          v-else
          >{{ btnTitle }}</v-btn
        >
        <v-btn color="red" dark text @click="show = false" v-if="!creating"
          >Close</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { deRef } from "../../../config/firebase_services";
import { uploadFile } from "../../../_helpers/FileUpload";
import { firebase } from "../../../config/firebase_services";

export default {
  name: "CreateTimeline",
  props: ["visible", "addNew"],
  data() {
    return {
      creating: false,
      items: [
        {
          title: "",
          icon: "",
          active: false,
          progress: 0,
          steps: [
            {
              title: "",
            },
          ],
        },
      ],
      rules: {
        iconRule: [
          (v) => !!v || "Icon is required",
          (v) =>
            (v && v.size < 2000000) || "Icon size should be less than 2 MB!",
        ],
        titleRule: [(v) => !!v || "Title is required"],
      },
    };
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) this.$emit("close");
      },
    },
    btnTitle: function () {
      return this.addNew ? "Update Timeline" : "Create timeline";
    },
    dialogTitle: function () {
      return this.addNew
        ? "Update progress timeline"
        : "Create progress timeline";
    },
  },
  methods: {
    addModule() {
      this.items.push({
        title: "",
        icon: "",
        active: false,
        progress: 0,
        steps: [
          {
            title: "",
          },
        ],
      });
    },
    deleteModule(i) {
      this.items.splice(i, 1);
    },
    addStep(i) {
      this.items[i].steps.push({
        title: "",
      });
    },
    deleteStep(i, j) {
      this.items[i].steps.splice(j, 1);
    },
    async create() {
      this.creating = true;
      try {
        for (let item of this.items) {
          item.image = await uploadFile(item.icon, "DE");
        }

        const newItems = this.items.map((item) => {
          return {
            title: item.title,
            icon: item.image,
            active: item.active,
            steps: item.steps,
          };
        });

        const data = {
          items: newItems,
          createdAt: new Date(),
        };

        await deRef
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .set(data, { merge: true });

        this.$toast.success("Timeline created", {
          position: "top",
        });
        this.show = false;
        this.creating = false;
        this.items = [
          {
            title: "",
            icon: "",
            active: false,
            progress: 0,
            steps: [
              {
                title: "",
              },
            ],
          },
        ];
        this.$emit("setTimeline", data);
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
        this.creating = false;
      }
    },
    async update() {
      this.creating = true;
      try {
        for (let item of this.items) {
          item.image = await uploadFile(item.icon, "DE");
        }

        const newItems = this.items.map((item) => {
          return {
            title: item.title,
            icon: item.image,
            active: item.active,
            steps: item.steps,
          };
        });

        await deRef
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .update({
            items: firebase.firestore.FieldValue.arrayUnion(...newItems),
          });

        this.$toast.success("Timeline updated", {
          position: "top",
        });

        this.show = false;
        this.creating = false;
        this.items = [
          {
            title: "",
            icon: "",
            active: false,
            progress: 0,
            steps: [
              {
                title: "",
              },
            ],
          },
        ];
      } catch (error) {
        this.creating = false;
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
  },
};
</script>

<style scoped>
</style>