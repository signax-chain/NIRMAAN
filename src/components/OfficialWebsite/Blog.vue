<template>
  <div>
    <!-- <v-btn
      class="white--text d-block ml-auto"
      color="traktor"
      @click="dialog = true"
    >
      Add new<v-icon>mdi-plus-circle</v-icon></v-btn
    > -->
    <v-row class="mt-5">
      <v-col cols="12" md="4" v-for="(item, index) in blog" :key="index">
        <!-- <div class="acions">
          <v-icon @click="_delete(item.docId)">mdi-delete</v-icon>
        </div> -->
        <link-prevue :url="item.url"></link-prevue>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="800">
        <v-card>
          <v-card-title class="headline"> {{ cardTitle }} </v-card-title>
          <v-card-text class="mt-3">
            <v-text-field
              outlined
              label="News URL"
              dense
              v-model="link"
            ></v-text-field>
            <link-prevue :url="link" ref="prevue"></link-prevue>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="cancel()"> Cancel </v-btn>
            <v-btn color="traktor" class="white--text" @click="addNew()">
              Add
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import LinkPrevue from "link-prevue";
import firebase from "firebase";
import Swal from "sweetalert2";
import axios from "axios";

export default {
  name: "Blog",
  computed: {
    cardTitle: function () {
      return "Add new blog";
    },
  },
  components: {
    LinkPrevue,
  },
  data() {
    return {
      dialog: false,
      link: null,
      item: null,
      blog: [],
      API_URL: "https://traktor-api.herokuapp.com/medium",
    };
  },
  created() {
    this.getMediumPosts();
  },
  methods: {
    async getMediumPosts() {
      try {
        const response = await axios.get(this.API_URL);
        this.blog = response.data.items;
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },

    cancel() {
      this.dialog = false;
      this.link = null;
    },

    async addNew() {
      this.item = this.$refs.prevue._data.response;

      if (this.url === null) {
        this.$toast.error("Enter a valid link", {
          position: "top",
        });
        return;
      }

      if (this.item === null) {
        this.$toast.error("Something went wrong please try again later", {
          position: "top",
        });
        return;
      }

      try {
        firebase
          .firestore()
          .collection("website")
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .collection("blog")
          .add(this.item);

        this.$toast.success("Added", {
          position: "top",
        });
        this.dialog = false;
        this.url = null;
        this.item = null;
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },

    _delete(docId) {
      Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: 'No'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            firebase
              .firestore()
              .collection("website")
              .doc(this.$store.state.incubator.currentIncubator.docId)
              .collection("blog")
              .doc(docId)
              .delete();

            this.$toast.success("Deleted", {
              position: "top",
            });
          } catch (error) {
            this.$toast.error(error, {
              position: "top",
            });
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.wrapper {
  width: 300px !important;
  margin: 0 auto !important;
}

>>> .card-img {
  width: 250px !important;
  margin: 0 auto !important;
}

>>> .v-dialog:not(.v-dialog--fullscreen) {
  max-height: 95% !important;
  border-radius: 10px !important;
}

.card__col:hover .acions {
  display: inline-block;
}

.acions {
  position: absolute;
  display: none;
  padding: 10px;
}

.news__row {
  width: 100%;
}

.card__col {
  width: 33.33%;
}
</style>