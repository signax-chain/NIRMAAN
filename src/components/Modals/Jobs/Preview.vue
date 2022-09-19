<template>
  <v-dialog persistent max-width="900" v-model="show">
    <v-card>
      <v-card-title class="heading d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <img
            :src="job.moreInfo.photoURL"
            :alt="job.moreInfo.name"
            class="d-block mx-auto"
          />
          <div class="ml-5">
            <h4>{{ job.role }}</h4>
            <span>{{ job.moreInfo.name }}</span>
          </div>
        </div>
        <v-btn color="red" text @click="show = false">Close</v-btn>
      </v-card-title>
      <v-card-text>
        <div>
          <h3>About the Company</h3>
          <p class="mt-2">
            {{ truncateParagraph(400, job.moreInfo.description) }}
          </p>
        </div>
        <div class="d-flex justify-space-between mt-3 align-center">
          <div>
            <h3>Role</h3>
            <span>{{ job.role }}</span>
          </div>
          <div>
            <h3>Sector</h3>
            <span>{{ job.moreInfo.sector }}</span>
          </div>
          <div>
            <h3>Duration</h3>
            <span>{{ job.duration }}</span>
          </div>
          <div>
            <h3>Paid/ Unpaid</h3>
            <span>{{ job.remuneration }}</span>
          </div>
        </div>
        <div class="mt-3">
          <h3>About the Job</h3>
          <p class="mt-2">{{ job.description }}</p>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import _helpers from "../../../mixins/_helpers";

export default {
  name: "Preview",
  props: ["visible", "job"],
  mixins: [_helpers],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) this.$emit("close");
      },
    },
  },
};
</script>

<style scoped>
img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

h4 {
  color: #3aa959;
}

span, p {
  color: #a0a0a0;
  font-size: 14px;
}
</style>