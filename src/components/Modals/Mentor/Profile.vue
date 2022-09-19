<template>
  <v-row justify="center">
    <v-dialog v-model="modal" persistent max-width="1000">
      <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="modal = false">
            Close
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-5">
          <div class="details">
            <div class="banner"></div>
            <div class="information">
              <img
                :src="profileData.photoURL"
                :alt="profileData.name"
                class="photo mx-auto"
              />
              <h3 class="mt-2 black--text">
                {{ profileData.name }}
              </h3>
              <h3 class="mt-3">
                Expertise:
                <span style="color: #3aa959">{{
                  profileData.areaOfExpertise.toString()
                }}</span>
              </h3>
            </div>
          </div>
          <p style="font-weight: bold">
            {{ profileData.description }}
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  name: "Profile",
  props: {
    modal: {
      default: false,
    },
    profileData: {
      type: Object,
    },
  },
  computed: {
    closeModal: function () {
      return this.$emit("update:modal", false);
    },
  },
};
</script>
<style scoped>
.details {
  position: relative;
}

h3 {
  text-align: left !important;
}

.banner {
  background: url("../../../assets/images/startup-profile-bg.png");
  height: 200px;
}

.photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
}

.information {
  position: absolute;
  bottom: -130px;
  left: 50px;
  text-align: left;
}

p {
  margin-top: 150px !important;
}
</style>