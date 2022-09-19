<template>
  <v-container>
    <!-- <v-btn
      class="ml-auto d-block"
      color="grayFont"
      @click="edit()"
      icon
      v-if="!isEditable"
      v-show="currentUser.role !== 'mentor'"
      ><v-icon size="28">mdi-pencil</v-icon></v-btn
    > -->
    <div class="logo__section">
      <img :src="data.photoURL" :alt="data.name" border="0" />
      <v-btn
        class="edit__btn"
        icon
        color="white"
        @click="edit()"
        v-if="currentUser.role !== 'mentor'"
        ><v-icon size="18">mdi-pencil</v-icon></v-btn
      >
    </div>
    <h3 class="text-center my-3">
      {{ data.name }}
    </h3>
    <span :class="data.status">{{ getStatus(data.status) }}</span>
    <div
      class="mt-2 mb-5 quick__actions"
      v-if="currentUser.role === 'incubator' && data.status !== 'droppedout'"
    >
      <!-- <v-btn icon color="traktor" link to="/jobs"
        ><v-icon size="28">mdi-account-tie</v-icon></v-btn
      > -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            color="traktor"
            link
            :to="`/startupship/${data.docId}`"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon size="28">mdi-human-greeting-proximity</v-icon>
          </v-btn>
        </template>
        <span>Schedule meeting</span>
      </v-tooltip>
    </div>
    <v-form>
      <v-file-input
        label="Change logo"
        v-if="isEditable"
        v-model="logo"
        @change="updateLogo()"
      ></v-file-input>
      <v-text-field
        :disabled="!isEditable"
        label="Name"
        v-model="data.name"
      ></v-text-field>
      <v-autocomplete
        :disabled="!isEditable"
        label="Mentor"
        multiple
        :items="mentors"
        item-text="name"
        v-model="data.mentorsAssociated"
      ></v-autocomplete>
      <v-autocomplete
        :disabled="!isEditable"
        label="Sector"
        :items="sectors"
        v-model="data.sector"
      ></v-autocomplete>
      <v-select
        :items="status"
        v-model="data.status"
        item-text="value"
        item-value="key"
        label="Status"
        :disabled="!isEditable"
      ></v-select>
      <v-row>
        <v-col cols="12" md="10">
          <v-text-field
            :disabled="!isEditable"
            label="Website"
            v-model="data.socialLinks.website"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <a
            :href="data.socialLinks.website"
            style="color: #3aa95a"
            icon
            dark
            target="_blank"
          >
            <v-icon>mdi-link</v-icon>
          </a>
        </v-col>
      </v-row>
      <v-text-field
        :disabled="!isEditable"
        label="Contact Number"
        v-model="data.phoneNumber"
      ></v-text-field>
      <v-text-field
        :disabled="!isEditable"
        label="Email ID"
        v-model="data.email"
      ></v-text-field>
      <v-select
        :disabled="!isEditable"
        label="Cohort (Name)"
        v-model="data.cohort.name"
        :items="cohortnames"
      ></v-select>
      <v-select
        :disabled="!isEditable"
        label="Cohort (Year)"
        v-model="data.cohort.year"
        :items="cohortyears"
      ></v-select>
      <!-- <v-text-field
        :disabled="!isEditable"
        label="Faculty /Student ID"
        v-model="data.facultyOrStudentId"
      ></v-text-field> -->
      <!-- <v-text-field
        :disabled="!isEditable"
        label="Startupreneur ID"
        v-model="data.startupreneurId"
      ></v-text-field> -->
      <v-text-field
        :disabled="!isEditable"
        label="CIN/Registration Number"
        v-model="data.cinNumber"
      ></v-text-field>
      <v-text-field
        :disabled="!isEditable"
        label="LinkedIn Profile"
        v-model="data.socialLinks.linkedIn"
      ></v-text-field>
      <v-btn
        color="traktor"
        class="white--text mx-auto d-block"
        v-if="isEditable"
        @click="save()"
        >Save</v-btn
      >
    </v-form>
    <StartupEditModal />
  </v-container>
</template>

<script>
import { startupsRef, mentorsRef } from "../../config/firebase_services";
import { mapState } from "vuex";
import { uploadFile } from "../../_helpers/FileUpload";
import StartupEditModal from "../Modals/StartupEdit";

export default {
  name: "BasicDetails",
  components: {
    StartupEditModal,
  },
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  data() {
    return {
      data: {},
      mentors: [],
      isEditable: false,
      sectors: [
        "Advertising",
        "Aerospace",
        "Agritech",
        "Art",
        "Automotive",
        "AI/ML",
        "AR/VR",
        "Blockchain",
        "Big Data",
        "Clean Technology",
        "Construction",
        "Cloud",
        "Cyber Security",
        "Consulting",
        "Design",
        "Digital Marketing",
        "Ecommerce",
        "Edtech",
        "Energy",
        "Entertainment",
        "Fashion",
        "Fintech",
        "Health and Wellness",
        "Health Tech",
        "Hospitality",
        "Human Resources",
        "Information Technology",
        "Hardware/Internet of Things (IoT)",
        "Life Sciences",
        "Logistics",
        "Manufacturing",
        "Media",
        "Mobile Application",
        "Nonprofits",
        "Platforms",
        "Retail",
        "Sports",
        "Travel",
        "Waste Management",
        "Ventures for Goods",
        "Add new +",
      ],
      cohortnames: ["July", "Jan", "August"],
      cohortyears: [
        2010,
        2011,
        2012,
        2013,
        2014,
        2015,
        2016,
        2017,
        2018,
        2019,
        2020,
        2021,
        2022,
        2023,
        2024,
        2025,
        2026,
        2027,
        2028,
        2029,
        2030,
      ],
      status: [
        { key: "active", value: "Active" },
        { key: "graduated", value: "Graduated" },
        { key: "droppedout", value: "Dropped Out" },
      ],
      startupId: null,
      logo: null,
      tempMA: null,
    };
  },
  async created() {
    this.startupId =
      this.$route.params.id !== undefined
        ? this.$route.params.id
        : this.$store.state.user.currentUser.docId;

    startupsRef.doc(this.startupId).onSnapshot((snapshot) => {
      const data = snapshot.data();
      this.data = data;
      this.tempMA = data.mentorsAssociated;
    });

    const documents = await mentorsRef
      .where(
        "incubatorId",
        "==",
        this.$store.state.incubator.currentIncubator.docId
      )
      .get();
    documents.forEach((document) => {
      const data = document.data();
      if (document.exists) {
        this.mentors.push({ id: data.docId, name: data.name });
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
      const downloadURL = await uploadFile(this.logo, "Logo/startups");
      await startupsRef
        .doc(this.data.docId)
        .set({ photoURL: downloadURL }, { merge: true });
      this.logo = null;
    },
    edit() {
      this.$store.dispatch("SHOW_STARTUP_EDIT", {
        isShowing: true,
        basicDetails: this.data,
      });
      // this.isEditable = !this.isEditable;
      // this.$toast.success("You can edit basic details now", {
      //   position: "top",
      // });
    },
    getUniqueList(startupsAssociated, key) {
      return [
        ...new Map(
          startupsAssociated.map((item) => [item[key], item])
        ).values(),
      ];
    },
    getStatus(status) {
      if (status === "active" || status === null) return "Active";
      if (status === "graduated") return "Graduated";
      if (status === "droppedout") return "Dropped out";
    },
    async save() {
      try {
        if (this.data.mentorsAssociated !== this.tempMA) {
          const selectedMentors = this.data.mentorsAssociated;
          this.data.mentorsAssociated = [];
          selectedMentors.forEach((mm) => {
            const obj = this.mentors.find((mentor) => mentor.name === mm);
            this.data.mentorsAssociated.push(obj);
          });
        }

        await startupsRef.doc(this.data.docId).set(this.data, { merge: true });
        this.data.mentorsAssociated.forEach(async (mentor) => {
          const document = await mentorsRef.doc(mentor.id).get();
          const data = document.data();
          data.startupsAssociated.push({
            id: this.data.docId,
            name: this.data.name,
          });
          data.startupsAssociated = this.getUniqueList(
            data.startupsAssociated,
            "id"
          );
          await mentorsRef.doc(mentor.id).set(data, { merge: true });
        });

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
.container {
  background-color: #fff;
  margin: 0;
}

a {
  text-decoration: none;
}

img {
  display: block;
  margin: 0 auto;
  width: 150px;
}

span {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 120px;
  border-radius: 20px;
  text-align: center;
}

.active {
  color: #3aa959;
  border: 1px solid #3aa959;
}

.graduated {
  color: #00f;
  border: 1px solid #00f;
}

.droppedout {
  color: #f00;
  border: 1px solid #f00;
}

>>> .v-input__append-inner {
  display: none;
}

>>> input[type="text"]:disabled,
>>> .v-select__selection {
  color: #4f4f4f !important;
}

>>> .theme--light.v-text-field.v-input--is-disabled .v-input__slot:before {
  border-image: none;
}

>>> .v-text-field > .v-input__control > .v-input__slot:before {
  border-style: none;
}

form {
  padding-left: 15px;
}

.edit__btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
  background: #3aa959;
}

.logo__section {
  position: relative;
  width: 40%;
  margin: 0 auto;
}

.logo__section > img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.quick__actions {
  width: 100%;
  display: grid;
  place-items: center;
}
</style>
