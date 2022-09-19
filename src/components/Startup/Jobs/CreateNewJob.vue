<template>
  <v-container>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <h3 class="heading">
      <v-btn icon color="traktor" to="/jobs">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      Jobs
    </h3>
    <v-card class="mx-5">
      <v-card-title class="heading">Post New Job</v-card-title>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Role"
                outlined
                v-model="data.role"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Duration"
                outlined
                v-model="data.duration"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                label="Job type"
                outlined
                v-model="data.type"
                :items="types"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6" v-if="currentUser.role === 'incubator'">
              <v-autocomplete
                label="Select startup"
                outlined
                v-model="startup"
                :items="startups"
                item-text="name"
                return-object
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                :items="items"
                outlined
                label="Remuneration"
                v-model="data.remuneration"
              ></v-select>
            </v-col>
            <v-col cols="12" md="12">
              <v-textarea
                label="Requirements"
                outlined
                v-model="data.requirements"
              ></v-textarea>
            </v-col>

            <v-col cols="12" md="12">
              <v-textarea
                label="Description"
                outlined
                v-model="data.description"
              ></v-textarea>
            </v-col>
          </v-row>
          <div class="d-flex justify-center">
            <v-btn color="traktor" dark class="mr-4" @click="preview()" outlined
              >Preview</v-btn
            >
            <v-btn color="traktor" dark @click="submit()">Post Job</v-btn>
          </div>
        </v-form>
      </v-card-text>
      <preview :visible="dialog" :job="data" @close="dialog = false"></preview>
    </v-card>
  </v-container>
</template>

<script>
import { activityRef, websiteRef } from "../../../config/firebase_services";
import _helpers from "../../../mixins/_helpers";
import Preview from "../../Modals/Jobs/Preview.vue";
import { getStartups } from "../../../services/Startups";
import { mapState } from "vuex";

export default {
  components: { Preview },
  name: "CreateNewJob",
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  data() {
    return {
      items: ["Paid", "Unpaid", "Variable"],
      types: ["Internship", "Employment", "Full Time", "Part Time", "Project"],
      data: {
        role: "",
        duration: "",
        requirements: "",
        remuneration: "",
        description: "",
        type: "",
      },
      dialog: false,
      startups: [],
      startup: "",
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
        },
        {
          text: "Jobs",
          disabled: true,
        },
        {
          text: "Create Job",
          disabled: true,
        },
      ],
    };
  },
  mixins: [_helpers],
  created() {
    this.get();
  },
  methods: {
    async get() {
      this.startups = await getStartups(
        this.$store.state.incubator.currentIncubator.docId
      );
    },
    checkRole() {
      return this.$store.state.user.currentUser.role;
    },
    preview() {
      const role = this.checkRole();
      if (role === "incubator") this.data.moreInfo = this.startup;
      else if (role === "startup")
        this.data.moreInfo = this.$store.state.user.currentUser;
      this.dialog = true;
    },
    async submit() {
      const emptyString = Object.keys(this.data).find(
        (key) => this.data[key] === ""
      );

      if (emptyString !== undefined) {
        this.$toast.error(`Job ${this.capitalize(emptyString)} is required!`, {
          position: "top",
        });
        return;
      }

      const role = this.checkRole();
      if (role === "incubator") this.data.moreInfo = this.startup;
      else if (role === "startup")
        this.data.moreInfo = this.$store.state.user.currentUser;

      this.data.createdAt = new Date();
      this.data.incubatorId =
        this.$store.state.incubator.currentIncubator.docId;
      this.data.startupId = this.data.moreInfo.docId;

      const activity = {
        incubatorId: this.$store.state.incubator.currentIncubator.docId,
        photoURL: this.data.moreInfo.photoURL,
        statement: `Startup ${this.data.moreInfo.name} has posted a new job for the role of ${this.data.role}`,
        createdAt: new Date(),
        type: "startup",
        notification: true,
      };

      try {
        await websiteRef
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .collection("jobs")
          .add(this.data);
        await activityRef.add(activity);

        this.$toast.success("Job created", {
          position: "top",
        });

        this.data = {
          role: "",
          duration: "",
          requirements: "",
          remuneration: "",
          description: "",
          type: "",
        };
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

.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}
</style>