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
          <h2 class="white--text">Connect with startups</h2>
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
        Request startup
        <v-icon v-if="icons">mdi-account-question-outline</v-icon>
      </v-tab>
      <v-tab>
        Startup availability
        <v-icon v-if="icons">mdi-account-reactivate-outline</v-icon>
      </v-tab>
      <v-tab-item>
        <v-card flat tile>
          <v-card-text>
            <RequestStartup />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat tile>
          <v-card-text>
            <StartupAvailability />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import RequestStartup from "@/components/Startupship/RequestStartup";
import StartupAvailability from "@/components/Startupship/StartupAvailability";

export default {
  name: "Startupship",
  components: {
    RequestStartup,
    StartupAvailability,
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

@media only screen and (max-width: 600px) {
  .back__nav {
    display: none;
  }

  .top__header {
    margin-top: 10px;
  }
}
</style>