<template>
  <div class="event-card d-flex justify-space-between align-center">
    <v-icon color="traktor" size="36">{{ event.icon }}</v-icon>
    <div class="event-card-content">
      <span>{{ event.title }}</span>
      <h2>{{ event.count }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "EventCard",
  props: ["event"],
};
</script>

<style scoped>
.event-card {
  width: 19%;
  padding: 0.5rem 1rem;
  border: 1px solid #e5e5e5;
  background-color: #fff;
  border-radius: 5px;
}

span {
  color: #b0b0b0;
  font-size: 12px;
}

h2 {
  color: #5e5e5e;
}
</style>