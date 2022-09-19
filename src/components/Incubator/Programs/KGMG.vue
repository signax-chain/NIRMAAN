<template>
  <div>
    <form-wizard
      color="#3AA95A"
      title=""
      subtitle=""
      finishButtonText="Submit"
      @on-complete="onComplete"
    >
      <tab-content title="Basic" icon="ti-info-alt">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              outlined
              dense
              label="Name"
              v-model="startup.name"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              outlined
              dense
              label="Student ID"
              v-model="startup.studentId"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              outlined
              dense
              label="Email ID"
              v-model="startup.email"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              outlined
              dense
              label="Alternate Email ID"
              v-model="startup.alternateEmail"
            ></v-text-field>
          </v-col>
        </v-row>
      </tab-content>
      <tab-content title="Official" icon="ti-info-alt">
        <v-row>
          <v-col cols="12" md="6">
            <v-select
              outlined
              dense
              label="Associated with"
              :items="associatedWith"
              v-model="startup.associatedWith"
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              outlined
              dense
              label="Department"
              v-model="startup.department"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              outlined
              dense
              label="Faculty/ research guide"
              v-model="startup.faculty"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-dialog
              ref="dialog"
              v-model="modal"
              :return-value.sync="startup.dateOfJoining"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="startup.dateOfJoining"
                  label="Date of Joining"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  dense
                ></v-text-field>
              </template>
              <v-date-picker v-model="startup.dateOfJoining" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="traktor" @click="modal = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="traktor"
                  @click="$refs.dialog.save(startup.dateOfJoining)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>
        </v-row>
      </tab-content>
      <tab-content title="Official" icon="ti-settings">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              outlined
              dense
              label="Tenure"
              v-model="startup.tenure"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              outlined
              dense
              label="Thesis title"
              v-model="startup.thesisTitle"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              outlined
              dense
              label="Thesis description"
              v-model="startup.thesisDescription"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-file-input
              outlined
              dense
              label="Advisor letter"
              v-model="startup.advisorLetter"
            ></v-file-input>
          </v-col>
        </v-row>
      </tab-content>
      <tab-content title="Documents" icon="ti-settings">
        <v-row>
          <v-col cols="12" md="6">
            <v-file-input
              outlined
              dense
              label="Acceptance/ offer letter from KGMG"
              v-model="startup.acceptanceOfferLetter"
            ></v-file-input>
          </v-col>
          <v-col cols="12" md="6">
            <v-file-input
              outlined
              dense
              label="Thesis pitch"
              v-model="startup.thesisPitch"
            ></v-file-input>
          </v-col>
          <v-col cols="12" md="6">
            <v-file-input
              outlined
              dense
              label="Project recruitment letter"
              v-model="startup.projectRecruitmentLetter"
            ></v-file-input>
          </v-col>
          <v-col cols="12" md="6">
            <v-file-input
              outlined
              dense
              label="Progress review template"
              v-model="startup.progressReviewTemplate"
            ></v-file-input>
          </v-col>
        </v-row>
      </tab-content>
    </form-wizard>
    <progress-loader
      loaderText="Loading..."
      :visible="progressLoader"
      @close="progressLoader = false"
    ></progress-loader>
  </div>
</template>

<script>
import { auth, startupsRef } from "../../../config/firebase_services";
import { uploadFileWithName } from "../../../_helpers/FileUpload";
import ProgressLoader from "../../Modals/Loaders/ProgressLoader.vue";
export default {
  components: { ProgressLoader },
  name: "KGMG",
  data() {
    return {
      associatedWith: ["Nirmaan", "SIP"],
      progressLoader: false,
      startup: {
        name: "",
        docId: "",
        description: "",
        createdAt: "",
        program: "",
        email: "",
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Logos%2Fstartups%2Fnoun_startup_1561106%20(1).png?alt=media&token=c293be6c-8f57-46d8-a38b-c5eb248259d4",
        incubatorId: null,
        mentorsAssociated: [],
        phoneNumber: null,
        sector: null,
        status: "active",
        stage: null,
        socialLinks: {
          linkedIn: "",
          website: "",
        },
        founders: [
          {
            name: null,
            email: null,
            phoneNumber: null,
            gender: null,
            linkedIn: null,
            studentId: "",
            photoURL: null,
          },
        ],
        awards: [],
        fundings: [],
        isDeleted: false,
        studentId: null,
        alternateEmail: null,
        associatedWith: null,
        department: null,
        facultyOrResearchGuide: null,
        dateOfJoining: new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substr(0, 10),
        tenure: null,
        thesisTitle: null,
        thesisDescription: null,
        advisorLetter: null,
        acceptanceOfferLetter: null,
        thesisPitch: null,
        projectRecruitmentLetter: null,
        progressReviewTemplate: null,
      },
    };
  },
  methods: {
    async onComplete() {
      if (this.startup.name === null || this.startup.name === "") {
        this.$store.dispatch("SHOW_SNACKBAR", {
          showing: true,
          text: "Startup name cannot be empty!",
          color: "error",
        });
        return;
      }

      if (this.startup.email === null || this.startup.email === "") {
        this.$store.dispatch("SHOW_SNACKBAR", {
          showing: true,
          text: "Email cannot be empty!",
          color: "error",
        });
        return;
      }

      this.progressLoader = true;

      this.startup.createdAt = new Date()
      this.startup.program = "KGMG";
      this.startup.incubatorId =
        this.$store.state.incubator.currentIncubator.docId;

      try {
        if (
          typeof this.startup.advisorLetter === "object" &&
          this.startup.advisorLetter !== null
        )
          this.startup.advisorLetter = await uploadFileWithName(
            this.startup.advisorLetter,
            "documents"
          );
        if (
          typeof this.startup.acceptanceOfferLetter === "object" &&
          this.startup.acceptanceOfferLetter !== null
        )
          this.startup.acceptanceOfferLetter = await uploadFileWithName(
            this.startup.acceptanceOfferLetter,
            "documents"
          );
        if (
          typeof this.startup.thesisPitch === "object" &&
          this.startup.thesisPitch !== null
        )
          this.startup.thesisPitch = await uploadFileWithName(
            this.startup.thesisPitch,
            "documents"
          );
        if (
          typeof this.startup.projectRecruitmentLetter === "object" &&
          this.startup.projectRecruitmentLetter !== null
        )
          this.startup.projectRecruitmentLetter = await uploadFileWithName(
            this.startup.projectRecruitmentLetter,
            "documents"
          );
        if (
          typeof this.startup.progressReviewTemplate === "object" &&
          this.startup.progressReviewTemplate !== null
        )
          this.startup.progressReviewTemplate = await uploadFileWithName(
            this.startup.progressReviewTemplate,
            "documents"
          );

        this.startup.password = this.startup.program.toLowerCase() + "1234";
        const user = await auth.createUserWithEmailAndPassword(
          this.startup.email,
          this.startup.password
        );

        this.startup.docId = user.user.uid;
        await startupsRef.doc(this.startup.docId).set(this.startup);
        this.progressLoader = false;
        this.$store.dispatch("SHOW_SNACKBAR", {
          showing: true,
          text: "Startup created successfully!",
          color: "success",
        });
        this.$router.push("/startups");
      } catch (error) {
        this.$store.dispatch("SHOW_SNACKBAR", {
          showing: true,
          text: error,
          color: "error",
        });
        this.progressLoader = false;
      }
    },
  },
};
</script>

<style>
</style>