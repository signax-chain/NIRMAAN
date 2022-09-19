<template>
  <div class="outer-circle">
    <div class="inner-circle">
      <div class="circle-text">
        <div class="avg">Rs.{{ result.avg.toLocaleString() }}</div>
        <span
          >Total Funding Received-
          Rs.{{ result.totalFunding.toLocaleString() }}</span
        ><br />
        <span
          >Total Funded Startups - {{ result.totalStartups }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getAverageFundingPerStartups } from "../../../../../services/graphs/funding/averageFundingPerStartups";

export default {
  name: "AverageFundingPerStartup",
  data() {
    return {
      result: {},
    };
  },
  created() {
    this.initializeData();
  },
  methods: {
    async initializeData() {
      const data = await getAverageFundingPerStartups();
      this.result = data;
      this.$forceUpdate();
    },
  },
};
</script>

<style scoped>
.outer-circle {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  border: 15px solid #c39814;
  display: flex;
  justify-content: center;
  align-items: center;
}

.inner-circle {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.circle-text {
  text-align: center;
}

.avg {
  color: #f2c94c;
  font-size: 28px;
  font-weight: bold;
}

span {
  color: #c39814;
  font-size: 12px;
}
</style>