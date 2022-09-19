<template>
  <div>
    <v-dialog v-model="show" width="500">
      <v-card>
        <v-card-title class="heading"
          >Sign up with Linked In to post from traktor
          <v-spacer></v-spacer>
          <v-btn color="red" icon @click="show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-3">
          <v-btn color="#0e76a8" @click="allow()" dark class="mx-auto d-block">
            <v-icon>mdi-linkedin</v-icon>
            Sign Up with LinkedIn
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <awards-and-recogntions
      :shareText="shareText"
      :visible="awardsDialog"
      @close="awardsDialog = false"
    ></awards-and-recogntions>
  </div>
</template>

<script>
import { linkedInSSO } from "../../../services/Auth/sso/linkedin";
import AwardsAndRecogntions from "./Share/AwardsAndRecogntions.vue";
export default {
  components: { AwardsAndRecogntions },
  props: ["visible", "award"],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) this.$emit("close", close);
      },
    },
  },
  data() {
    return {
      awardsDialog: false,
      shareText: "",
    };
  },
  methods: {
    async allow() {
      const redirectUrl = linkedInSSO.getRedictUrl();
      window.open(redirectUrl, "_blank");
      await linkedInSSO.getAccessToken();
      const user = await linkedInSSO.getUserData();
      console.log(user);
      localStorage.setItem("linkedin-user", JSON.stringify(user));
      this.shareText = `We are very happy to share that we have got ${this.award.description} and the prize  money of ${this.award.money} in ${this.award.name} from ${this.award.givenBy}`;
      this.show = false;
      this.awardsDialog = true;
    },
  },
};
</script>

<style scoped>
</style>