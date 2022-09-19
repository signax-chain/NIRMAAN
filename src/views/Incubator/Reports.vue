<template>
  <v-container>
    <div class="wrapper">
      <!-- <v-row class="back__nav">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              color="traktor"
              v-bind="attrs"
              v-on="on"
              link
              to="/dashboard"
              ><v-icon size="30">mdi-arrow-left</v-icon></v-btn
            >
          </template>
          <span>Back</span>
        </v-tooltip>
      </v-row> -->
      <v-row class="top__header">
        <v-col cols="12" class="d-flex">
          <h2 class="white--text">Reports</h2>
          <div class="actions__items d-flex ml-auto"></div>
        </v-col>
      </v-row>
    </div>
    <v-tabs
      v-model="tab"
      background-color="traktor"
      class="elevation-2"
      dark
      :centered="centered"
      :grow="grow"
      :icons-and-text="icons"
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab>
        Individual Report
        <v-icon v-if="icons">mdi-format-list-bulleted</v-icon>
      </v-tab>
      <v-tab>
        Cohort Level Report
        <v-icon v-if="icons">mdi-human-greeting-proximity</v-icon>
      </v-tab>
      <v-tab>
        Request Info
        <v-icon v-if="icons">mdi-account-reactivate-outline</v-icon>
      </v-tab>
      <v-tab-item>
        <v-card flat tile>
          <v-card-text>
            <h1 class="text-center mt-5 text--black">
              <Individual />
            </h1>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat tile>
          <v-card-text>
            <h1 class="text-center mt-5 text--black">
              <CohortLevel />
            </h1>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat tile>
          <v-card-text>
            <RequestInfo />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import RequestInfo from "@/components/Reports/RequestInfo";
import Individual from "@/components/Reports/Individual";
import CohortLevel from "@/components/Reports/CohortLevel";

export default {
  name: "Connections",
  components: {
    RequestInfo,
    Individual,
    CohortLevel,
  },
  data() {
    return {
      tab: null,
      icons: true,
      centered: true,
      grow: true,
      tabs: 3,
    };
  },
  methods: {},
};
</script>

<style scoped>
a {
  text-decoration: none;
}

.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back__nav {
  height: 60px;
  width: 10%;
  border-radius: 20px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
}

.top__header {
  background: #3aa95a;
  height: 60px;
  width: 90%;
  margin: 0 auto;
  border-radius: 20px;
  margin-bottom: 25px;
}

.v-tabs {
  border-radius: 15px;
}

.v-tab {
  color: #fff;
  font-weight: bold;
  font-size: 16px !important;
  text-transform: capitalize !important;
}
</style>