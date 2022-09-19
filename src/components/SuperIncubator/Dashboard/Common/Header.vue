<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <div class="d-flex align-center">
          <img
            src="../../../../assets/images/icons/dashboard-icon.svg"
            alt=""
            class="mr-3"
          />
          <h4 class="heading">{{ heading }}</h4>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <v-btn color="traktor" dark class="float-right">
          <v-icon size="14" class="mr-2">mdi-file-multiple-outline</v-icon>
          Generate Report</v-btn
        >
      </v-col>
    </v-row>
    <v-divider class="my-2"></v-divider>
    <v-row class="mt-2">
      <v-col cols="12" md="10">
        <div class="d-flex align-center">
          <v-text-field
            placeholder="Search by parameter tags"
            prepend-inner-icon="mdi-magnify"
            outlined
            dense
            class="mr-2"
          ></v-text-field>
          <v-select
            :items="items"
            label="Regions"
            outlined
            dense
            style="width: 100px"
          ></v-select>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: ["Nirmaan", "UGFIR", "KGMG"],
      keyMap: {
        overview: "General Dashboard",
        incubator: "Incubator Dashboard",
        regions: "Region Dashboard",
        funding: "Funding Dashboard",
      },
    };
  },
  computed: {
    heading: function () {
      if (this.$route.query.tab === undefined) return this.keyMap.overview;
      return this.keyMap[this.$route.query.tab];
    },
  },
};
</script>

<style scoped>
.heading {
  color: #4f4f4f;
  font-weight: normal;
}
</style>