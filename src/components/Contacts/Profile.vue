<template>
  <div>
    <img
      :src="currentUser.photoURL"
      :alt="currentUser.name"
      class="d-block mx-auto"
      style="border-radius: 50%; height: 120px; width: 120px"
    />
    <h2 class="text-center mt-1">{{ currentUser.name }}</h2>
    <!-- <span class="text-center">{{ }}</span> -->
    <!-- <span
      class="text-center mx-auto d-flex pa-1 justify-center align-center"
      v-if="currentUser.role === 'startup'"
      >{{ currentUser.status }}</span
    > -->
    <!-- <router-link
      :to="`${$route.path === '/contacts' ? '/connections' : '/contacts'}`"
      class="text-center mt-1 d-block"
      >View
      {{
        $route.path === "/contacts" ? "Connections" : "Contacts"
      }}</router-link
    > -->
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "Profile",
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
};
</script>
<style scoped>
h2 {
  color: #4f4f4f;
}

span {
  width: 80px;
  height: 20px;
  border: 1px solid #3aa959;
  color: #3aa959;
  border-radius: 20px;
  text-transform: capitalize;
  font-size: 12px;
}

a {
  text-decoration: none;
  color: #3aa959;
}
</style>
