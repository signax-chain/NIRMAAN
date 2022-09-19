<template>
  <v-dialog v-model="show" max-width="500">
    <v-card class="pa-5">
      <div class="award__card pa-2 mr-3">
        <div class="top__section d-flex justify-space-between">
          <h2 class="award__name">{{ award.name }}</h2>
        </div>
        <h3 class="mt-1 given__by">
          {{ award.givenBy }}
        </h3>
        <p class="description mt-3">
          {{ award.description }}
        </p>
        <div class="card__footer">
          <span v-if="award.money">{{ award.money }}</span>
          <span class="">{{
            new Date(award.date).toLocaleDateString("en-in")
          }}</span>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Award",
  props: ["visible", "award"],
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
.award__card {
  width: 100%;
  border: 1px solid #3aa959;
  min-height: 200px;
  height: auto;
  border-radius: 10px;
  position: relative;
  /* padding: 15px; */
}

.top__section > span {
  font-size: 12px;
}

.award__name {
  color: #3aa959;
  white-space: normal;
}

.given__by {
  font-size: 12px;
}

.award__card > p {
  font-size: 13px;
}

.award__card > span {
  font-size: 12px;
}

.actions {
  float: right;
}

.description {
  font-size: 12px;
  white-space: normal;
}

.card__footer {
  /* position: absolute; */
  bottom: 2px;
  width: 92%;
  display: flex;
  justify-content: space-between;
}

.card__footer > span {
  color: #3aa959;
  font-weight: bold;
}

>>> .v-dialog:not(.v-dialog--fullscreen) {
  border-radius: 10px;
}
</style>