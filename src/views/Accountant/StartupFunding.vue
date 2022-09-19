<template>
  <div>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <div class="d-flex justify-space-between">
      <h3 class="heading mb-10">Funding</h3>
      <v-btn color="traktor" dark class="mr-5" link to="/startups">
        <v-icon>mdi-arrow-left</v-icon>
        Back to startups</v-btn
      >
    </div>
    <v-row class="mt-10">
      <v-col cols="12" md="6">
        <startup-profile class="mx-5" :data="data"></startup-profile>
      </v-col>
      <v-col cols="12" md="6">
        <funding-overview></funding-overview>
      </v-col>
    </v-row>
    <h3 class="heading d-flex justify-space-between align-center mt-5">
      Funding Statement
      <v-btn color="traktor" dark @click="editFunding()">Update Funding</v-btn>
    </h3>
    <funding-statement></funding-statement>
  </div>
</template>

<script>
import FundingOverview from "./FundingOverview.vue";
import FundingStatement from "./FundingStatement.vue";
import { getStartupById } from "../../services/Startups";
import StartupProfile from "./StartupProfile.vue";

export default {
  components: { FundingOverview, FundingStatement, StartupProfile },
  name: "StartupFunding",
  created() {
    this.getStartup();
  },
  data() {
    return {
      data: {},
      crumbs: [
        {
          text: "Funding",
          disabled: true,
        },
        {
          text: "Startup",
          disabled: true,
        },
      ],
    };
  },
  methods: {
    async getStartup() {
      this.data = await getStartupById(this.$route.params.id);
    },
    editFunding() {
      this.$router.push({
        name: "FundingForm",
        params: { item: { name: this.data.name, id: this.data.docId } },
      });
    },
  },
};
</script>

<style scoped>
.wrapper {
  border: 1px solid #dbdbdb;
  border-radius: 5px;
}

.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}

.profile {
  background: #fff;
  padding: 0;
  border-radius: 5px;
  margin: 1rem 1rem 3rem 1rem;
}
</style>