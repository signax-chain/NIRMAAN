<template>
  <v-row>
    <v-col cols="12" md="3">
      <div class="d-flex justify-space-between align-center">
        <h3>Select Module</h3>
        <v-btn
          color="traktor"
          outlined
          v-if="currentUser.role === 'incubator'"
          @click="addModuleDialog = true"
        >
          <v-icon dark>mdi-plus-circle</v-icon>
          Add</v-btn
        >
      </div>
      <div class="mt-5">
        <v-list>
          <v-list-item-group color="traktor" v-model="selectedIndex">
            <v-list-item
              v-for="(module, index) in modules"
              :key="index"
              @click="goto(index)"
            >
              <img :src="module.icon" width="30px" class="mr-3" />
              <v-list-item-content>
                <v-list-item-title>{{ module.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
    </v-col>
    <v-col cols="12" md="9" style="border-left: 1px solid #ccc">
      <module-items :modules="modules" :index="selectedIndex"></module-items>
    </v-col>
    <new-module
      :modules="modules"
      :visible="addModuleDialog"
      @close="addModuleDialog = false"
    ></new-module>
  </v-row>
</template>

<script>
import { mapState } from "vuex";
import { deResponsesV2Ref, dev2Ref } from "../../../config/firebase_services";
import NewModule from "../../Modals/Dev2/NewModule.vue";
import ModuleItems from "./ModuleItems.vue";
export default {
  components: { ModuleItems, NewModule },
  created() {
    this.getModules();
  },
  data() {
    return {
      modules: [],
      module: {},
      selectedIndex: 0,
      addModuleDialog: false,
    };
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
  },
  methods: {
    async getModules() {
      const incubatorId = this.$store.state.incubator.currentIncubator.docId;
      const currentUser = this.$store.state.user.currentUser;
      if (currentUser.role === "incubator" && !this.$route.params.id) {
        dev2Ref.doc(incubatorId).onSnapshot((doc) => {
          this.modules = doc.data().modules;
          console.log(this.modules);
        });
      }

      if (currentUser.role === "startup" || this.$route.params.id) {
        const document = await deResponsesV2Ref.doc(currentUser.docId).get();

        if (document.exists) {
          const data = document.data();
          this.modules = data.modules;
        } else {
          const document = await dev2Ref.doc(incubatorId).get();
          this.modules = document.data().modules;
        }
      }
      this.module = this.modules[0];
      this.selectedIndex = 0;
    },
    goto(index) {
      this.module = this.modules[index];
      console.log(this.module);
    },
  },
};
</script>

<style scoped>
h3 {
  color: #4f4f4f;
  font-weight: 500;
}
</style>