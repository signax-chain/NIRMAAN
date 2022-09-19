<template>
  <section>
    <v-row>
      <v-col
        cols="12"
        md="4"
        v-for="(video, i) in modules[index].videos"
        :key="i"
      >
        <v-card>
          <v-card-text>
            <video :src="video.document" controls width="100%"></video>
            <div class="d-flex justify-space-between">
              <h4 class="mt-3">{{ video.title }}</h4>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    icon
                    v-if="currentUser.role === 'incubator' && !$route.params.id"
                  >
                    <v-icon dark>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="deleteVideo(i)">
                    <v-list-item-title> Delete </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="3"
        v-if="currentUser.role === 'incubator' && !$route.params.id"
      >
        <v-card>
          <v-card-text
            class="text-center"
            @click="videoDialog = true"
            style="cursor: pointer"
          >
            <v-icon color="traktor">mdi-plus-circle</v-icon>
            <h3 class="mt-3">Upload new</h3>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <new-item
      :visible="videoDialog"
      :title="title"
      @close="videoDialog = false"
      @result="addVideo"
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
      video: {},
      videoDialog: false,
      title: "Video",
    };
  },
  methods: {
    async addVideo(video) {
      try {
        this.modules[this.index].videos.push(video);
        console.log(this.modules);
        await dev2Ref
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .update({
            modules: this.modules,
          });
        this.videoDialog = false;
        this.$toast.open({
          message: "Video added",
          position: "top",
          type: "success",
        });
      } catch (error) {
        this.$toast.error(error.message);
      }
    },
    deleteVideo(index) {
      try {
        this.modules[this.index].videos.splice(index, 1);
        dev2Ref.doc(this.$store.state.incubator.currentIncubator.docId).update({
          modules: this.modules,
        });
        this.$toast.open({
          message: "Video deleted",
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
  width: 250px;
  box-shadow: 0 4px 0 rgba(58, 169, 89, 1) !important;
}

.actions {
  display: none;
}

.text:hover .actions {
  display: block !important;
}
</style>