<template>
  <v-container>
    <v-row class="top__header">
      <v-col cols="12" class="d-flex">
        <h2 class="white--text">Add new mentor</h2>
      </v-col>
    </v-row>
    <v-card>
      <form-wizard
        @on-complete="onComplete"
        color="#3AA95A"
        title="Add New Startup"
        subtitle=""
        finishButtonText="Submit"
      >
        <tab-content title="Description" icon="ti-comments">
          <v-row>
            <v-col cols="12" md="12">
              <v-text-field
                outlined
                label="Name of the mentor"
                dense
                v-model="mentor.name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-img :src="mentor.photoURL" class="logo"></v-img>
            </v-col>
            <v-col cols="12" md="6">
              <v-file-input
                @change="preview()"
                v-model="image"
                label="Choose logo"
                outlined
              >
              </v-file-input>
            </v-col>
            <v-col cols="12" md="12">
              <v-textarea
                label="Description"
                outlined
                v-model="mentor.description"
              ></v-textarea>
            </v-col>
          </v-row>
        </tab-content>
        <tab-content title="Professional" icon="ti-info-alt">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                outlined
                label="Years of Experience"
                dense
                v-model="mentor.yearOfExperience"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                outlined
                label="Area of Expertise"
                dense
                multiple
                v-model="mentor.areaOfExpertise"
                :items="areas"
                @change="handleArea"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                outlined
                label="Current Designation"
                dense
                v-model="mentor.designation"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                outlined
                label="Institution"
                dense
                v-model="mentor.institution"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                outlined
                label="Qualification"
                dense
                v-model="mentor.qualification"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                outlined
                label="Year of passing out"
                dense
                v-model="mentor.yearOfPassing"
                @keypress="readOnlyNumbers"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                outlined
                label="Startups Associated"
                dense
                multiple
                chips
                v-model="selectedStartups"
                :items="startups"
                item-text="name"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </tab-content>
        <tab-content title="Contact" icon="ti-settings">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                outlined
                label="Contact Number"
                dense
                v-model="mentor.phoneNumber"
                @keypress="readOnlyNumbers"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                outlined
                label="Email Address"
                type="email"
                dense
                v-model="mentor.email"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                outlined
                label="LinkedIn ID"
                dense
                v-model="mentor.socialLinks.linkedIn"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                outlined
                label="Password"
                dense
                v-model="mentor.password"
              ></v-text-field>
            </v-col>
          </v-row>
        </tab-content>
      </form-wizard>
    </v-card>
    <AddNewAreaOfExpertise
      :visible="addNewAreaModal"
      @close="addNewAreaModal = false"
      @addNewArea="addNewArea"
    />
  </v-container>
</template>

<script>
import firebase from "firebase";
import {
  activityRef,
  mentorsRef,
  startupsRef,
} from "../../config/firebase_services";
import AddNewAreaOfExpertise from "../Modals/addNew/areaOfExpertise";
import _helpers from "../../mixins/_helpers";

export default {
  name: "AddNewStartup",
  components: {
    AddNewAreaOfExpertise,
  },
  mixins: [_helpers],
  data() {
    return {
      mentor: {
        docId: null,
        name: null,
        designation: null,
        institution: null,
        qualification: null,
        description: null,
        email: null,
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Logos%2Fmentors%2Fnoun_person_2417851.png?alt=media&token=43ff7ae6-9a45-4540-9852-8713dd91d8b0",
        incubatorId: null,
        startupsAssociated: [],
        phoneNumber: null,
        yearOfExperience: null,
        yearOfPassing: null,
        status: "active",
        socialLinks: {
          linkedIn: null,
          website: null,
        },
        areaOfExpertise: [],
        createdAt: null,
        lastLogin: null,
        isDeleted: false,
        password: null,
      },
      image: null,
      selectedStartups: [],
      startups: [],
      areas: [
        "Business Model",
        "General Management",
        "HR/Team",
        "Marketing & Sales",
        "Operations",
        "Project Management",
        "Pricing",
        "Scale Up",
        "Strategy",
        "Technology",
        "Valuation/Funding",
        "Finance",
        "Add new +",
      ],
      addNewAreaModal: false,
    };
  },
  async created() {
    this.mentor.password = this.$store.state.user.currentUser.name
      .toLowerCase()
      .split(" ")
      .join("");
    const documents = await startupsRef
      .where("incubatorId", "==", this.$store.state.user.currentUser.docId)
      .where("isDeleted", "==", false)
      .get();
    documents.forEach((document) => {
      const data = document.data();
      if (document.exists) {
        this.startups.push({ id: data.docId, name: data.name });
      }
    });
  },
  methods: {
    handleArea(area) {
      if (area[area.length - 1] === "Add new +") {
        this.addNewAreaModal = true;
      }
    },
    addNewArea(area) {
      this.areas.splice(this.areas.length - 1, 0, area).join();
      this.mentor.areaOfExpertise[this.mentor.areaOfExpertise.length - 1] =
        area;
      this.addNewAreaModal = false;
    },
    onComplete: function () {
      this.mentor.incubatorId = this.$store.state.user.currentUser.docId;
      this.mentor.createdAt = new Date();

      if (this.mentor.email === null || this.mentor.email === "") {
        this.$toast.error("Email cannot be empty", {
          position: "top",
        });
        return;
      }

      if (this.mentor.password === null || this.mentor.password.length < 6) {
        this.$store.dispatch("SHOW_SNACKBAR", {
          showing: true,
          text: "Password must be 6 characters long!",
          color: "error",
        });
        return;
      }

      this.$store.dispatch("SHOW_LOADER", { isShowing: true });
      this.selectedStartups.forEach((ss) => {
        const obj = this.startups.find((startup) => startup.name === ss);
        this.mentor.startupsAssociated.push(obj);
      });

      firebase
        .auth()
        .createUserWithEmailAndPassword(
          this.mentor.email.trim(),
          this.mentor.password
        )
        .then(async (user) => {
          this.mentor.docId = user.user.uid;
          if (typeof this.image === "object" && this.image !== null) {
            const firebaseStorageRef = firebase
              .storage()
              .ref()
              .child(`Logos/mentors/${Date.now()}_file`)
              .put(this.image);
            firebaseStorageRef.on(
              "state_changed",
              (snapshot) => {
                console.log(snapshot);
              },
              (error) => {
                console.error(error);
              },
              async () => {
                this.mentor.photoURL =
                  await firebaseStorageRef.snapshot.ref.getDownloadURL();
                const documentRef = await mentorsRef
                  .doc(this.mentor.docId)
                  .set(this.mentor);

                this.mentor.startupsAssociated.forEach(async (startup) => {
                  const document = await startupsRef.doc(startup.id).get();
                  const data = document.data();
                  data.mentorsAssociated.push({
                    id: documentRef.id,
                    name: this.mentor.name,
                  });
                  await startupsRef.doc(startup.id).set(data, { merge: true });
                });

                this.$store.dispatch("SHOW_LOADER", { isShowing: false });
                this.$store.dispatch("SHOW_SNACKBAR", {
                  showing: true,
                  text: "Added",
                  color: "success",
                });
                const activity = {
                  incubatorId: this.$store.state.user.currentUser.docId,
                  statement: `Mentor ${this.mentor.name} joined ${this.$store.state.incubator.currentIncubator.name} on ${this.mentor.createdAt}`,
                  mentor: this.mentor,
                  createdAt: new Date(),
                  type: "mentor",
                  notification: false,
                  photoURL: this.mentor.photoURL,
                };

                activityRef.add(activity);

                this.$router.push("/mentors");
              }
            );
          } else {
            const documentRef = await mentorsRef
              .doc(this.mentor.docId)
              .set(this.mentor);

            this.mentor.startupsAssociated.forEach(async (startup) => {
              const document = await startupsRef.doc(startup.id).get();
              const data = document.data();
              data.mentorsAssociated.push({
                id: documentRef.id,
                name: this.mentor.name,
              });
              await startupsRef.doc(startup.id).set(data, { merge: true });
            });

            this.$store.dispatch("SHOW_LOADER", { isShowing: false });
            this.$store.dispatch("SHOW_SNACKBAR", {
              showing: true,
              text: "Added",
              color: "success",
            });
            const activity = {
              incubatorId: this.$store.state.user.currentUser.docId,
              statement: `Mentor ${this.mentor.name} joined ${this.$store.state.incubator.currentIncubator.name} on ${this.mentor.createdAt}`,
              mentor: this.mentor,
              createdAt: new Date(),
              type: "mentor",
              notification: false,
              photoURL: this.mentor.photoURL,
            };

            activityRef.add(activity);

            this.$router.push("/mentors");
          }
        })
        .catch((error) => {
          this.$store.dispatch("SHOW_LOADER", { isShowing: false });
          this.$store.dispatch("SHOW_SNACKBAR", {
            showing: true,
            text: error.message,
            color: "error",
          });
        });
    },
    preview() {
      this.mentor.photoURL = URL.createObjectURL(this.image);
    },
  },
};
</script>

<style scoped>
.top__header {
  background: #3aa95a;
  height: 60px;
  width: 100%;
  margin: 0 auto;
  border-radius: 20px;
  margin-bottom: 25px;
}

.logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.v-card {
  border-radius: 15px !important;
}

>>> .vue-form-wizard .wizard-title {
  font-weight: bold !important;
  font-size: 20px !important;
}

@media only screen and (max-width: 600px) {
  .wizard-card-footer {
    display: flex;
    width: 100%;
  }
}
</style>
