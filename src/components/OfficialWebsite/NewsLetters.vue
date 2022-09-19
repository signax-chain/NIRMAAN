<template>
  <div class="mb-5">
    <v-btn
      color="traktor"
      class="white--text d-block ml-auto mb-5"
      @click="dialog = true"
      >Upload <v-icon>mdi-plus-circle</v-icon></v-btn
    >
    <v-row class="card__row">
      <v-col
        class="card__col"
        cols="12"
        md="4"
        v-for="(item, index) in newsLetters"
        :key="index"
      >
        <img
          :src="$store.state.incubator.currentIncubator.photoURL"
          :alt="$store.state.incubator.currentIncubator.name"
        />
        <div class="acions">
          <v-icon @click="edit(item)">mdi-pencil</v-icon>
          <v-icon @click="_delete(item.docId)">mdi-delete</v-icon>
        </div>
        <h3 class="black--text">
          {{ $store.state.incubator.currentIncubator.name }}
        </h3>
        <h2 class="my-10">{{ item.title }}</h2>
        <h1 class="black--text text-left mt-3">{{ item.month }}</h1>
        <div class="footer d-flex align-center justify-space-between mt-3">
          <h1 class="black--text text-left">{{ item.year }}</h1>
          <div class="footer-right">
            <v-btn icon @click="download(item.document)" color="traktor"
              ><v-icon>mdi-download</v-icon></v-btn
            >
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="800">
        <v-card>
          <v-card-title class="headline">
            {{ cardTitle }}
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="cancel()"> Cancel </v-btn>
            <v-btn
              color="traktor"
              class="white--text"
              @click="update()"
              v-if="isEdit"
            >
              Update
            </v-btn>
            <v-btn color="traktor" class="white--text" @click="addNew()" v-else>
              Add
            </v-btn>
          </v-card-title>
          <v-card-text class="mt-3">
            <v-text-field
              outlined
              dense
              label="Title"
              v-model="item.title"
            ></v-text-field>
            <v-select
              outlined
              :items="months"
              v-model="item.month"
              dense
              label="Select month"
            ></v-select>
            <v-select
              outlined
              :items="years"
              v-model="item.year"
              dense
              label="Select year"
            ></v-select>
            <v-text-field
              :label="isEdit ? 'Change link' : 'Newsletter link'"
              outlined
              dense
              type="url"
              v-model="item.document"
            ></v-text-field>
            <!-- <v-file-input
              :label="isEdit ? 'Change file' : 'Choose file'"
              outlined
              dense
              multiple
              v-model="document"
            ></v-file-input> -->
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import firebase from "firebase";
import Swal from "sweetalert2";

export default {
  name: "NewsLetters",
  computed: {
    cardTitle: function () {
      return this.isEdit ? "Edit newsletter" : "Add new newsletter";
    },
  },
  data() {
    return {
      dialog: false,
      newsLetters: [],
      isEdit: false,
      item: {
        title: null,
        month: null,
        year: null,
        document: null,
      },
      months: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      years: [
        2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016,
        2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028,
        2029, 2030,
      ],
    };
  },
  created() {
    this.getNewsLetters();
  },
  methods: {
    getNewsLetters() {
      firebase
        .firestore()
        .collection("website")
        .doc(this.$store.state.incubator.currentIncubator.docId)
        .collection("newsLetters")
        .onSnapshot((snapshot) => {
          this.newsLetters = [];
          snapshot.forEach(async (document) => {
            const data = document.data();
            data.docId = document.id;
            this.newsLetters.push(data);
          });
        });
    },

    edit(item) {
      this.item = item;
      this.isEdit = true;
      this.dialog = true;
    },

    cancel() {
      this.dialog = false;
      this.isEdit = false;
      // this.setToNull();
    },

    async addNew() {
      if (
        this.item.document === null ||
        this.item.title === null ||
        this.item.month === null ||
        this.item.year === null
      ) {
        this.$toast.error("All fileds are required", {
          position: "top",
        });
        return;
      }

      // this.item.document = await uploadFile(this.document, "Website");

      try {
        firebase
          .firestore()
          .collection("website")
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .collection("newsLetters")
          .add(this.item);

        this.$toast.success("Added", {
          position: "top",
        });
        this.dialog = false;
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },

    async update() {
      try {
        firebase
          .firestore()
          .collection("website")
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .collection("newsLetters")
          .doc(this.item.docId)
          .set(this.item, { merge: true });

        this.$toast.success("Updated", {
          position: "top",
        });
        this.dialog = false;
        this.isEdit = false;
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },

    download(document) {
      location.href = document;
    },

    _delete(docId) {
      Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            firebase
              .firestore()
              .collection("website")
              .doc(this.$store.state.incubator.currentIncubator.docId)
              .collection("newsLetters")
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
.card__col {
  margin-top: 20px;
  text-align: center;
  box-shadow: 0 0 24px hsl(0deg 0% 90% / 75%);
}

.card__col:hover .acions {
  display: inline-block;
}

img {
  height: 100px;
}

.acions {
  position: absolute;
  display: none;
}

.v-icon {
  cursor: pointer;
}

>>> .v-dialog:not(.v-dialog--fullscreen) {
  max-height: 95% !important;
  border-radius: 10px !important;
}

h2 {
  color: #3aa95a;
  font-size: 28px;
}
</style>