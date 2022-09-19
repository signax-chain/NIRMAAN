<template>
  <div>
    <v-card>
      <v-card-text>
        <div class="img-container">
          <img :src="data.photoURL" alt="" />
        </div>
        <div class="startup-info">
          <h3>{{ data.name }}</h3>
          <v-chip :color="getColor(data.status)" dark class="mt-3">{{
            getStatus(data.status)
          }}</v-chip>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["data"],
  data() {
    return {
      items: {
        active: "Active",
        graduated: "Graduated",
        droppedout: "Dropped out",
      },
      colors: {
        active: "traktor",
        graduated: "blue",
        droppedout: "red",
      },
    };
  },
  methods: {
    getStatus(status) {
      return this.items[status];
    },
    getColor(status) {
      return this.colors[status];
    },
  },
};
</script>

<style scoped>
.img-container {
  position: relative;
}
img {
  background-color: #fff;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  top: -80px;
  padding: 5px;
  border: 1px solid #dbdbdb;
}

.startup-info {
  position: relative;
  display: grid;
  place-items: center;
  margin-top: 3rem;
}
</style>