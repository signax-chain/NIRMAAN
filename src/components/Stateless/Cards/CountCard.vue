<template>
  <router-link :to="item.path" class="card__container">
    <div class="card__icon">
      <v-icon color="traktor" size="50">{{ item.icon }}</v-icon>
    </div>
    <div class="card__details">
      <span>{{ item.title }}</span>
      <h2 v-if="item.count" class="black--text">
        {{ item.count }}
      </h2>
      <SkeletonText v-else />
    </div>
  </router-link>
</template>

<script>
import SkeletonText from "@/components/Stateless/SkeletonLoader/Text";

export default {
  name: "CountCard",
  components: {
    SkeletonText,
  },
  props: ["item"],
};
</script>

<style scoped>
a {
  text-decoration: none;
}

.card__container {
  box-shadow: 0 0 24px rgba(299, 299, 299, 0.75);
  width: 32%;
  background: #fff;
  border: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  margin: 0px 5px 10px 5px;
}

span {
  color: #b0b0b0;
  font-size: 14px;
  font-weight: bold;
}

@media only screen and (max-width: 600px) {
  .card__container {
    flex: 100%;
  }

  h2 {
    text-align: right;
  }
}
</style>