<template>
  <div class="outer-circle">
    <div class="inner-circle">
      <div class="circle-text">
        <div class="avg">{{ result.avg }}</div>
        <span>Total Startups - {{ result.totalStartups }}</span><br />
        <span>Total Cohorts - {{ result.totalSectors }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getAverageStartupsPerCohort } from "../../../../../services/graphs/startup/averageStartupsPerCohort";

export default {
  name: "AverageStartupsPerMentor",
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
      const data = await getAverageStartupsPerCohort();
      this.result = data;
      this.$forceUpdate();
    },
  },
};
</script>

<style scoped>
.outer-circle {
  width: 200px;
  height: 200px;
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
  font-size: 32px;
  font-weight: bold;
}

span {
  color: #c39814;
  font-size: 12px;
}
</style>