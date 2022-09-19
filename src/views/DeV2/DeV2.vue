<template>
  <div>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <h3 class="heading mx-5">Disciplined Entrepreneurship</h3>
    <div class="wrapper mx-5 mt-5">
      <v-card>
        <v-tabs background-color="traktor" dark v-model="tabs">
          <v-tabs-slider></v-tabs-slider>
          <v-tab> Disciplined Entrepreneurship </v-tab>

          <!-- <v-tab>
            <v-icon class="mr-2">mdi-forum</v-icon>
            DE Chat
          </v-tab> -->
          <v-tabs-items v-model="tabs">
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <modules></modules>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <!-- <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <chat></chat>
                </v-card-text>
              </v-card>
            </v-tab-item> -->
          </v-tabs-items>
        </v-tabs>
      </v-card>
    </div>
  </div>
</template>

<script>
import Modules from "../../components/DisciplinedEntrepreneurship/V2/Modules.vue";
// import Chat from "../../components/Modals/DE/Chat.vue";
export default {
  components: {
    Modules,
    // Chat,
  },
  data() {
    return {
      tabs: null,
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
        },
        {
          text: "DE",
          disabled: true,
        },
      ],
    };
  },
  created() {
    // alert("Coming soon!");
    // this.$router.push("/");
    const currentUser = this.$store.state.user.currentUser;
    console.log(currentUser);
    if (currentUser.role === "incubator" || currentUser.role === "mentor") {
      localStorage.setItem("strRes", true);
      localStorage.setItem("strResId", currentUser.docId);
    }
  },
};
</script>

<style scoped>
.v-tab {
  color: #fff;
  font-weight: bold;
  font-size: 16px !important;
  text-transform: capitalize !important;
}
</style>