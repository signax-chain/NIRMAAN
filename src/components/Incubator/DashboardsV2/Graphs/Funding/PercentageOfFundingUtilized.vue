<template>
  <div class="outer-circle">
    <div class="inner-circle">
      <div class="circle-text">
        <div class="avg">{{ result.avg }}%</div>
        <span>Funding Utilized - Rs. {{ result.utilized.toLocaleString() }}</span>
        <br />
        <span>Funding Disbursed - Rs. {{ result.received.toLocaleString() }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import {
  fundingRecieved,
  fundingUtilized,
} from "../../../../../services/Fundings";
import store from "../../../../../store";

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
      const incubatorId = store.state.incubator.currentIncubator.docId;
      const year = "all";
      const received = await fundingRecieved(incubatorId, year);
      const utilized = await fundingUtilized(incubatorId, year);
      this.result = {
        received: received,
        utilized: utilized,
        avg: Math.round((utilized / received) * 100),
      };
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