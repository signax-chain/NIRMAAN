<template>
  <div class="funding-card mr-2 mb-3" :style="`width: ${width}%`">
    <img
      :src="require(`../../../assets/images/icons/${funding.icon}`)"
      alt=""
      class="mr-2"
    />
    <div class="funding-card-content">
      <h3>Rs. {{ Math.round(funding.count).toLocaleString() }}</h3>
      <span>{{ funding.title }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "FundingCard",
  props: ["funding", "width"],
};
</script>

<style scoped>
.funding-card {
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  width: 24%;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
}

h3 {
  font-weight: 600;
  text-align: right;
}

span {
  opacity: 0.5;
  font-size: 12px;
  white-space: normal;
}
</style>