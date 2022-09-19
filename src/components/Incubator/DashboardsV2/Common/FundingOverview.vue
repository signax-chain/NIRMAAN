<template>
  <v-row>
    <v-col cols="12" md="12">
      <div class="funding-row">
        <funding-card
          v-for="(funding, index) in fundingStats"
          :key="index"
          :funding="funding"
          :width="`${
            $route.query.tab === undefined || $route.query.tab === 'overview'
              ? '32'
              : '32'
          }`"
        ></funding-card>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import FundingCard from "../../../Startup/Cards/FundingCardV2.vue";
import fundingStats from "../../../../mixins/fundingStats";

export default {
  components: { FundingCard },
  mixins: [fundingStats],
};
</script>

<style scoped>
.funding-row {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}
</style>