<template>
  <div class="outer-circle">
    <div class="inner-circle">
      <div class="circle-text">
        <div class="avg">{{ result.avg }}%</div>
        <span>Total Funded Startups - {{ result.fundedStartups }}</span><br />
        <span>Total Startups - {{ result.totalStartups }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getAverageFundedStartups } from "../../../../../services/graphs/funding/averageFundedStartups";

export default {
  name: "AverageFundedStartup",
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
      const data = await getAverageFundedStartups();
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