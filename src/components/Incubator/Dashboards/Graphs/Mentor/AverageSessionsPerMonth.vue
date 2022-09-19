<template>
  <div class="outer-circle">
    <div class="inner-circle">
      <div class="circle-text">
        <div class="avg">{{ result.avg }}</div>
        <span>Total Sessions - {{ result.sessions }}</span
        ><br />
        <span>Total Months - {{ result.months }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getAverageSessionsPerMonth } from "../../../../../services/graphs/mentor/averageSessionsPerMonth";

export default {
  name: "AverageStartupsPerMonth",
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
      const data = await getAverageSessionsPerMonth();
      this.result = data;
    },
  },
};
</script>

<style scoped>
.outer-circle {
  width: 300px;
  height: 300px;
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