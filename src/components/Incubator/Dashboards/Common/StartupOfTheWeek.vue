<template>
  <div class="top-startup">
    <h3>Most Active Startup</h3>
    <img src="../../../../assets/images/top-startup.jpeg" alt="" width="100px" />
    <h3 class="heading">True Side</h3>
    <div class="d-flex justify-space-between align-center">
      <!-- <div class="">
        <span>Daily Activity Streak</span>
        <h4>7 Days</h4>
      </div>
      <div class="">
        <span>Total Time Spent</span>
        <h4>30 Days</h4>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.top-startup {
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  background-color: #fff;
  padding: 1rem;
  text-align: center;
}

.top-startup > div > div > span {
  color: #b0b0b0;
  font-size: 10px;
  font-weight: normal;
}

h3 {
  color: #3aa959;
  font-size: 22px;
}

.heading {
  color: #4f4f4f;
  font-weight: normal;
}

span {
  color: #b0b0b0;
}
</style>