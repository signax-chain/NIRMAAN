<template>
  <v-card width="500">
    <v-card-text>
      <v-row>
        <v-col cols="12" md="3" class="text-center">
          <img :src="data.photoURL" :alt="data.name" class="photoURL" />
          <v-chip :color="getStatusColor(data.status)">{{
            getStatus(data.status)
          }}</v-chip>
        </v-col>
        <v-col cols="12" md="9">
          <h3>{{ data.name }}</h3>
          <div class="mt-2 d-flex">
            Current Stage:
            <h4 class="ml-2">
              {{ getCurrentStage(data.progress.currentStage) }}
            </h4>
          </div>
          <div class="d-flex mt-1">
            Founders:
            <h4 class="ml-2">{{ getFounders(data.founders) }}</h4>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="12">
          <div>{{ data.description }}</div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["data"],
  data() {
    return {
      statusMap: {
        active: "Active",
        droppedout: "Dropped Out",
        graduated: "Graduated",
      },
      statusColorMap: {
        active: "green",
        droppedout: "red",
        graduated: "blue",
      },
    };
  },
  methods: {
    getStatus(status) {
      return this.statusMap[status];
    },
    getStatusColor(status) {
      return this.statusColorMap[status];
    },
    getCurrentStage(currentStage) {
      return currentStage ? currentStage : "Not started";
    },
    getFounders(founders) {
      return founders.length === 0
        ? "Not found"
        : founders.map((founder) => founder.name).toString();
    },
  },
};
</script>

<style scoped>
.photoURL {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: contain;
}

h3 {
  color: #3aa959;
}

h4 {
  color: #000;
}

.v-chip {
  color: #fff !important;
  font-size: 12px !important;
  height: 20px !important;
  margin-top: 0.5rem;
}
</style>