<template>
  <v-container>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <h3 class="heading">Startups</h3>

    <!-- <div class="wrapper">
      <v-row class="top__header">
        <v-col cols="12" class="d-flex">
          <h2 class="white--text">Startups</h2>
          <div class="actions__items d-flex ml-auto align-center">
            <v-tooltip
              top
              v-if="
                currentUser.role === 'incubator' ||
                currentUser.role === 'member'
              "
            >
              <template v-slot:activator="{ on, attrs }">
                <router-link to="/startupship">
                  <v-btn v-bind="attrs" v-on="on" icon color="white">
                    <v-icon>mdi-human-greeting-proximity</v-icon>
                  </v-btn>
                </router-link>
              </template>
              <span>Schedule meeting with startups</span>
            </v-tooltip>
            <v-tooltip
              top
              v-if="
                currentUser.role === 'incubator' ||
                currentUser.role === 'member'
              "
            >
              <template v-slot:activator="{ on, attrs }">
                <router-link to="/startup/new"
                  ><v-btn icon color="#fff" v-bind="attrs" v-on="on"
                    ><v-icon size="28">mdi-plus-circle</v-icon></v-btn
                  ></router-link
                >
              </template>
              <span>Add new startup</span>
            </v-tooltip>
            <v-tooltip
              top
              v-if="
                currentUser.role === 'incubator' ||
                currentUser.role === 'member'
              "
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  color="#fff"
                  v-bind="attrs"
                  v-on="on"
                  @click="registrationLinkDialog = true"
                  ><v-icon size="28">mdi-clipboard</v-icon></v-btn
                >
              </template>
              <span>Cohort registration link</span>
            </v-tooltip>
            <v-tooltip
              top
              v-if="
                currentUser.role === 'incubator' ||
                currentUser.role === 'member'
              "
            >
              <template v-slot:activator="{ on, attrs }">
                <download-excel :data="exportingData">
                  <v-btn icon color="#fff" v-bind="attrs" v-on="on"
                    ><v-icon size="28">mdi-microsoft-excel</v-icon></v-btn
                  >
                </download-excel>
              </template>
              <span>Export data</span>
            </v-tooltip>
          </div>
        </v-col>
      </v-row>
    </div> -->
    <registration-link
      :visible="registrationLinkDialog"
      @close="registrationLinkDialog = false"
    ></registration-link>
    <v-row class="mx-3">
      <v-col cols="12" md="12">
        <List :exportingData="exportingData" @excelExport="assignData" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import List from "@/components/Incubator/Startups";
import { mapState } from "vuex";
import RegistrationLink from "../../components/Modals/Startup/RegistrationLink.vue";

export default {
  name: "Startups",
  components: {
    List,
    RegistrationLink,
  },
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  data() {
    return {
      registrationLinkDialog: false,
      exportingData: [],
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
          href: "dashboard",
        },
        {
          text: "Startups",
          disabled: true,
        },
      ],
    };
  },
  methods: {
    assignData(data) {
      this.exportingData = data;
    },
  },
};
</script>
<style scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

a {
  text-decoration: none;
}

.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}

.top__header {
  background: #3aa95a;
  height: 60px;
  width: 90%;
  margin: 0 auto;
  border-radius: 20px;
  margin-bottom: 25px;
}

@media only screen and (max-width: 600px) {
  .top__header {
    margin-top: 10px;
  }
}
</style>