<template>
  <v-container>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <h3 class="heading">Resources</h3>
    <div class="wrapper mx-5">
      <h3 class="heading ml-0">All Resources</h3>
      <div class="d-flex justify-space-between">
        <div class="d-flex">
          <v-text-field
            outlined
            dense
            label="Search for resources"
            class="mr-2"
            append-icon="mdi-magnify"
          ></v-text-field>
        </div>
        <div
          v-if="
            currentUser.role === 'incubator' ||
            currentUser.role === 'sIncubator'
          "
        >
          <v-btn dark color="traktor" @click="createResourceDialog = true"
            >Create new</v-btn
          >
        </div>
      </div>
      <div class="resouces-section">
        <div class="d-flex flex-wrap mt-3">
          <resource-card
            v-for="(resource, index) in resources"
            :key="index"
            :resource="resource"
            class="mr-5 mb-5"
          ></resource-card>
        </div>
      </div>
    </div>
    <resource-form
      :visible="createResourceDialog"
      @close="createResourceDialog = false"
    ></resource-form>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import { resourcesRef } from "../../config/firebase_services";
import ResourceForm from "../Modals/Resources/Form.vue";
import ResourceCard from "./Card.vue";
export default {
  components: { ResourceForm, ResourceCard },
  data() {
    return {
      createResourceDialog: false,
      search: "",
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
        },
        {
          text: "Resources",
          disabled: true,
        },
      ],
      resources: [],
    };
  },
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  created() {
    this.getResources();
  },
  methods: {
    filterResources(type) {
      return this.resources.filter((resource) => resource.type === type);
    },
    async getResources() {
      const incubatorId = this.$store.state.incubator.currentIncubator.docId;
      const documents = await resourcesRef
        .where("incubatorId", "==", incubatorId)
        .get();
      documents.forEach((doc) => {
        this.resources.push({
          ...doc.data(),
          id: doc.id,
        });
      });
    },
  },
};
</script>

<style scoped>
.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}

.wrapper {
  background-color: #fff;
  border-radius: 5px;
  padding: 0.5rem 1rem;
}

h4 {
  color: #4f4f4f !important;
  font-size: 16px !important;
}
</style>