<template>
  <div class="wrapper">
    <div class="p-bg">
      <!-- <v-btn class="float-right" icon color="black" @click="edit()"
        ><v-icon size="34">mdi-square-edit-outline</v-icon></v-btn
      > -->
      <img :src="data.photoURL" :alt="data.name" class="logo" />
    </div>
    <div class="p-info">
      <div class="p-info__left">
        <h3 class="mt-8">{{ data.name }}</h3>
        <div class="socials">
          <a @click="copyToClipboard(data.email)" class="social-link">
            <v-icon class="mr-2">mdi-email</v-icon>{{ data.email }}</a
          >
          <a @click="copyToClipboard(data.phone)" class="social-link">
            <v-icon class="mr-2">mdi-phone</v-icon>{{ data.phoneNumber }}</a
          >
          <a
            :href="`${data.socialLinks.linkedIn}`"
            target="_blank"
            v-show="data.socialLinks.linkedIn"
            ><v-icon class="mr-2">mdi-linkedin</v-icon
            >{{ data.socialLinks.linkedIn }}</a
          >
          <a
            :href="`${data.socialLinks.website}`"
            target="_blank"
            v-show="data.socialLinks.website"
            ><v-icon class="mr-2">mdi-web</v-icon
            >{{ data.socialLinks.website }}</a
          >
        </div>
      </div>
      <div class="p-info__right">
        <div class="ma-5" style="height: 160px">
          <v-row class="p-more__info mx-2">
            <v-col cols="12" md="4">
              <span class="span">Designation</span>
              <h4>{{ data.designation }}</h4>
            </v-col>
            <v-col cols="12" md="4">
              <span class="span">Year Of Passing</span>
              <h4>{{ data.yearOfPassing }}</h4>
            </v-col>
            <v-col cols="12" md="4">
              <span class="span">Qualification</span>
              <h4>{{ data.qualification }}</h4>
            </v-col>
          </v-row>
          <v-row class="p-more__info mx-2">
            <v-col cols="12" md="4">
              <span class="span">Institution</span>
              <h4>{{ data.institution }}</h4>
            </v-col>
            <v-col cols="12" md="4">
              <span class="span">Expertise</span>
              <h4>{{ data.areaOfExpertise.toString() }}</h4>
            </v-col>
          </v-row>
          <div class="">
            <v-btn class="float-right" dark color="traktor" @click="edit()"
              >Edit</v-btn
            >
          </div>
        </div>
      </div>
    </div>
    <mentor-edit></mentor-edit>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MentorEdit from "../../Modals/MentorEdit.vue";
import copy from "copy-to-clipboard";

export default {
  name: "Profile",
  components: { MentorEdit },
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  props: ["data"],
  data() {
    return {};
  },
  methods: {
    edit() {
      this.$store.dispatch("SHOW_MENTOR_EDIT", {
        isShowing: true,
        basicDetails: this.data,
      });
    },
    copyToClipboard(text) {
      copy(text);
      this.$toast.success(`Copied ${text} to clipboard`, {
        position: "top",
      });
    },
  },
};
</script>

<style scoped>
.wrapper {
  height: 400px;
}

.p-bg {
  background: #ccc;
  height: 40%;
  position: relative;
  background-image: url("../../../assets/images/startup-profile-bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top;
  /* opacity: 0.6; */
}

.logo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  top: 60%;
  left: 5%;
  position: absolute;
  border: 1px solid #000;
  background-color: #fff;
}

.p-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.p-info__left {
  width: 300px;
  display: grid;
  place-items: center;
  line-height: 30px;
}

.v-chip {
  font-size: 12px;
  height: 20px;
}

.p-info__right {
  width: 70%;
}

a {
  text-decoration: none;
}

.span {
  color: #b0b0b0;
  font-size: 12px;
}

.v-icon {
  color: #3e3e3e;
}

h5 {
  word-break: break-word;
  color: #4f4f4f;
}

.socials {
}

.socials > * {
  display: block;
  color: #000000de;
  font-size: 14px;
  font-weight: bold;
}

@media only screen and (max-width: 600px) {
  .wrapper {
    height: 800px;
  }
  .p-bg {
    background-image: none;
    height: 20%;
  }
  .logo {
    width: 100px;
    height: 100px;
    top: 75%;
  }

  .p-info {
    margin-top: 10%;
  }
  .p-info__left {
    width: 100%;
  }
  .p-info__right {
    width: 100%;
  }
  .p-more__info {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  .p-more__info > * {
    width: 100%;
    flex: 1;
  }
}
</style>