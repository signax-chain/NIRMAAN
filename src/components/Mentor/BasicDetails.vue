<template>
  <v-container>
    <v-btn
      class="ml-auto d-block"
      color="grayFont"
      @click="edit()"
      icon
      v-if="
        (!isEditable && currentUser.role === 'incubator') ||
        (!isEditable && currentUser.role === 'member') ||
        (!isEditable && currentUser.role === 'mentor' && !$route.params.id)
      "
      ><v-icon size="28">mdi-pencil</v-icon></v-btn
    >
    <v-btn
      color="traktor"
      class="white--text ml-auto d-block"
      v-if="isEditable"
      @click="save()"
      >Update</v-btn
    >
    <img
      :src="data.photoURL"
      :alt="data.name"
      border="0"
      width="150"
      height="150"
      style="border-radius: 50%; object-fit: cover"
    />
    <h3 class="text-center mb-5">{{ data.name }}</h3>
    <v-form>
      <v-file-input
        v-if="isEditable"
        label="Change photo"
        v-model="logo"
        @change="updateLogo()"
      ></v-file-input>
      <v-autocomplete
        :disabled="!isEditable"
        label="Startups"
        multiple
        :items="startups"
        item-text="name"
        v-model="data.startupsAssociated"
        return-object
      ></v-autocomplete>
      <!-- <v-select
        :items="mentorType"
        label="Mentor type"
        v-model="data.mentorType"
      ></v-select> -->
      <v-text-field
        :disabled="!isEditable"
        label="Current Designation"
        v-model="data.designation"
      ></v-text-field>
      <v-text-field
        :disabled="!isEditable"
        label="Year of passing"
        v-model="data.yearOfPassing"
      ></v-text-field>
      <v-text-field
        :disabled="!isEditable"
        label="Contact Number"
        v-model="data.phoneNumber"
      ></v-text-field>
      <v-text-field
        :disabled="!isEditable"
        label="Qualification"
        v-model="data.qualification"
      ></v-text-field>
      <v-text-field
        :disabled="!isEditable"
        label="Institution"
        v-model="data.institution"
      ></v-text-field>
      <v-text-field
        :disabled="!isEditable"
        label="Email ID"
        v-model="data.email"
      ></v-text-field>
      <v-autocomplete
        multiple
        :disabled="!isEditable"
        label="Expertise"
        v-model="data.areaOfExpertise"
        :items="areas"
      ></v-autocomplete>
      <v-text-field
        :disabled="!isEditable"
        label="LinkedIN Profile"
        v-model="data.socialLinks.linkedIn"
      ></v-text-field>
      <v-text-field
        :disabled="!isEditable"
        label="In Nirmaan since"
        v-model="data.since"
      ></v-text-field>
    </v-form>
  </v-container>
</template>

<script>
import { startupsRef, mentorsRef } from "../../config/firebase_services";
import { mapState } from "vuex";
import { uploadFile } from "../../_helpers/FileUpload";

export default {
  name: "BasicDetails",
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  data: () => ({
    logo: null,
    isEditable: false,
    mentorId: null,
    data: {},
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
      "Add new",
    ],
    mentorType: ["Buddy", "Technical", "Business"],
  }),
  async created() {
    this.mentorId =
      this.$route.params.id !== undefined
        ? this.$route.params.id
        : this.$store.state.user.currentUser.docId;

    mentorsRef.doc(this.mentorId).onSnapshot((snapshot) => {
      const data = snapshot.data();
      this.data = data;
    });

    const documents = await startupsRef
      .where(
        "incubatorId",
        "==",
        this.$store.state.incubator.currentIncubator.docId
      )
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
    async updateLogo() {
      const type = this.logo.type;
      if (
        type !== "image/png" &&
        type !== "image/jpg" &&
        type !== "image/jpeg" &&
        type !== "image/svg"
      ) {
        this.$toast.error("File format not supported!", {
          position: "top",
        });
        this.logo = null;
        return;
      }

      const downloadURL = await uploadFile(this.logo, "Logos/mentors");
      await mentorsRef
        .doc(this.data.docId)
        .set({ photoURL: downloadURL }, { merge: true });
      this.logo = null;
    },
    edit() {
      this.isEditable = true;
      this.$toast.success("You can edit basic details now", {
        position: "top",
      });
    },
    async save() {
      try {
        await mentorsRef.doc(this.data.docId).set(this.data, { merge: true });
        this.$toast.success("Updated", {
          position: "top",
        });
        this.isEditable = false;
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
  },
};
</script>

<style scoped>
img {
  display: block;
  margin: 0 auto;
}

span {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 60px;
  border: 1px solid #3aa959;
  border-radius: 20px;
  text-align: center;
  color: #3aa959;
}

.edit__btn {
  border-radius: 50%;
  min-width: 30px !important;
  width: 30px;
  height: 30px !important;
  margin-top: -35%;
  margin-left: 65%;
}
</style>
