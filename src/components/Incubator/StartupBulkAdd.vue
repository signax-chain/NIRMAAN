<template>
  <div class="floating__btn">
    <v-speed-dial
      v-model="fab"
      :top="top"
      :bottom="bottom"
      :right="right"
      :left="left"
      :direction="direction"
      :open-on-hover="hover"
      :transition="transition"
    >
      <template v-slot:activator>
        <v-btn v-model="fab" color="traktor" dark fab>
          <v-icon v-if="fab"> mdi-close </v-icon>
          <v-icon v-else> mdi-file-import-outline </v-icon>
        </v-btn>
      </template>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn fab dark small color="traktor" v-bind="attrs" v-on="on">
            <a
              href="https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Templates%2FStartups%20signup%20template.csv?alt=media&token=b44794ad-6b79-4799-8f7b-cdd7a91c5749"
              download
            >
              <v-icon>mdi-cloud-download-outline</v-icon>
            </a>
          </v-btn>
        </template>
        <span>Download template</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            dark
            small
            color="traktor"
            @click="$refs.csv.click()"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-cloud-upload-outline</v-icon>
          </v-btn>
        </template>
        <span>Upload csv</span>
      </v-tooltip>
    </v-speed-dial>
    <input type="file" ref="csv" style="display: none" @change="parseCsv" />
  </div>
</template>

<script>
import Swal from "sweetalert2";
import { auth, startupsRef } from "../../config/firebase_services";

export default {
  name: "StartupBulkAdd",
  data: () => ({
    direction: "top",
    fab: false,
    fling: false,
    hover: false,
    tabs: null,
    top: false,
    right: true,
    bottom: true,
    left: false,
    transition: "slide-y-reverse-transition",
    csv: null,
  }),

  computed: {
    activeFab() {
      switch (this.tabs) {
        case "one":
          return { class: "purple", icon: "account_circle" };
        case "two":
          return { class: "red", icon: "edit" };
        case "three":
          return { class: "green", icon: "keyboard_arrow_up" };
        default:
          return {};
      }
    },
  },

  watch: {
    top(val) {
      this.bottom = !val;
    },
    right(val) {
      this.left = !val;
    },
    bottom(val) {
      this.top = !val;
    },
    left(val) {
      this.right = !val;
    },
  },

  methods: {
    async parseCsv() {
      Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.value) {
          this.csv = this.$refs.csv.files[0];
          const type = this.csv.type;
          const password = 'nirmaan';
          const incubatorId =
            this.$store.state.incubator.currentIncubator.docId;
          if (type !== "text/csv") {
            this.$store.dispatch("SHOW_SNACKBAR", {
              showing: true,
              text: "Unsupported file format",
              color: "error",
            });
            return;
          }

          await this.$papa.parse(this.csv, {
            header: true,
            complete: async function (results) {
              if (results.errors.length > 0) {
                Swal.fire({
                  title: "Error",
                });
                return;
              }

              const data = [];

              results.data.forEach((result) => {
                const schema = {
                  docId: null,
                  name: null,
                  // facultyOrStudentId: null,
                  cinNumber: null,
                  cohort: {
                    name: null,
                    year: null,
                  },
                  description: null,
                  email: null,
                  photoURL:
                    "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Logos%2Fstartups%2Fnoun_startup_1561106%20(1).png?alt=media&token=c293be6c-8f57-46d8-a38b-c5eb248259d4",
                  incubatorId: incubatorId,
                  mentorsAssociated: [],
                  phoneNumber: null,
                  sector: null,
                  status: "active",
                  stage: "Idea",
                  socialLinks: {
                    linkedIn: null,
                    website: null,
                  },
                  founders: [],
                  awards: [],
                  fundings: [],
                  additionalContactNumber: null,
                  additionalEmailAddress: null,
                  createdAt: new Date(),
                  isDeleted: false,
                  lastLogin: null,
                };

                schema.additionalContactNumber =
                  result["Additional contact number"];
                schema.additionalEmailAddress =
                  result["Additional email address"];
                schema.cinNumber = result["CIN/ Registration number"];
                schema.description = result["Description"];
                schema.socialLinks.linkedIn = result["LinkedIn"];
                schema.socialLinks.website = result["Website link"];
                schema.phoneNumber = result["Official contact number"];
                schema.email = result["Official email address"].trim();
                schema.name = result["Startup name"];
                // schema.facultyOrStudentId = result["Student/ Faculty ID"];

                if (result["Founder1 name"] !== "") {
                  schema.founders.push({
                    name: result["Founder1 name"],
                    email: result["Founder1 email"].trim(),
                    phoneNumber: result["Founder1 contact number"],
                    linkedIn: null,
                    photoURL: null,
                  });
                }

                if (result["Founder2 name"] !== "") {
                  schema.founders.push({
                    name: result["Founder2 name"],
                    email: result["Founder2 email"],
                    phoneNumber: result["Founder2 contact number"],
                    linkedIn: null,
                    photoURL: null,
                  });
                }

                if (result["Founder3 name"] !== "") {
                  schema.founders.push({
                    name: result["Founder3 name"],
                    email: result["Founder3 email"],
                    phoneNumber: result["Founder3 contact number"],
                    linkedIn: null,
                    photoURL: null,
                  });
                }

                data.push(schema);
              });

              let done = 0;

              const createProfile = (item) => {
                return new Promise((resolve) => {
                  setTimeout(() => {
                    auth
                      .createUserWithEmailAndPassword(
                        item.email.trim(),
                        password
                      )
                      .then(async (user) => {
                        item.docId = user.user.uid;
                        await startupsRef.doc(item.docId).set(item);
                      });
                    resolve(item);
                  }, 1000);
                });
              };

              const obj = data.find((dt) => dt.email === "");

              if (obj !== undefined) {
                Swal.fire({
                  title: "Error",
                  text: `Email address of startup ${obj.name} is missing!`,
                });
                return;
              }

              for (const dt of data) {
                await createProfile(dt);
                done++;

                if (done === data.length) {
                  Swal.fire({
                    type: "success",
                    title: "Added",
                    text: `${data.length} Startups has been successfully added.`,
                  });
                }
              }
            },
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.floating__btn {
  float: right;
  margin-top: 10%;
}

a {
  color: #fff !important;
  text-decoration: none !important;
}
</style>