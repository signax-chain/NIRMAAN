<template>
  <section>
    <v-row>
      <v-col
        cols="12"
        md="4"
        v-for="(presentation, i) in modules[index].presentations"
        :key="i"
      >
        <v-card>
          <v-card-text>
            <v-icon color="traktor">mdi-presentation</v-icon>
            <div class="d-flex justify-space-between">
              <h4 class="mt-3">{{ presentation.title }}</h4>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon>
                    <v-icon dark>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    @click="downloadPresentation(presentation.document)"
                  >
                    <v-list-item-title> View </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    @click="deletePresentation(i)"
                    v-if="currentUser.role === 'incubator' && !$route.params.id"
                  >
                    <v-list-item-title> Delete </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3" v-if="currentUser.role === 'incubator' && !$route.params.id">
        <v-card>
          <v-card-text
            class="text-center"
            @click="presentationDialog = true"
            style="cursor: pointer"
          >
            <v-icon color="traktor">mdi-plus-circle</v-icon>
            <h3 class="mt-3">Upload new</h3>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <new-item
      :visible="presentationDialog"
      :title="title"
      @close="presentationDialog = false"
      @result="addPresentation"
    ></new-item>
  </section>
</template>

<script>
import { mapState } from "vuex";
import { dev2Ref } from "../../../../config/firebase_services";
import NewItem from "../../../Modals/Dev2/NewItem.vue";
export default {
  components: { NewItem },
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  props: ["modules", "index"],
  data() {
    return {
      presentation: {},
      presentationDialog: false,
      title: "Presentation",
    };
  },
  methods: {
    async addPresentation(presentation) {
      try {
        this.modules[this.index].presentations.push(presentation);
        console.log(this.modules);
        await dev2Ref
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .update({
            modules: this.modules,
          });
        this.presentationDialog = false;
        this.$toast.open({
          message: "Presentation added",
          position: "top",
          type: "success",
        });
      } catch (error) {
        this.$toast.error(error.message);
      }
    },
    downloadPresentation(document) {
      window.open(document, "_blank");
    },
    deletePresentation(i) {
      try {
        this.modules[this.index].presentations.splice(i, 1);
        dev2Ref.doc(this.$store.state.incubator.currentIncubator.docId).update({
          modules: this.modules,
        });
        this.$toast.open({
          message: "Presentation deleted",
          position: "top",
          type: "success",
        });
      } catch (error) {
        this.$toast.error(error.message);
      }
    },
  },
};
</script>

<style scoped>
.v-card {
  border: 1px solid #eee !important;
  border-radius: 5px;
  width: 200px;
  box-shadow: 0 4px 0 rgba(58, 169, 89, 1) !important;
}

.actions {
  display: none;
}

.text:hover .actions {
  display: block !important;
}
</style>