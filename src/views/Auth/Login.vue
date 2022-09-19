<template>
  <v-container class="container">
    <v-row class="login__row">
      <v-col cols="12" md="6" v-if="isMobileScreen()">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Product%2FTraktor.png?alt=media&token=5c9466f1-7a6d-4e55-a451-4c5a8b60e139"
          alt=""
          class="product__img"
        />
      </v-col>
      <v-col cols="12" md="6">
        <login-comp />
      </v-col>
      <v-col
        cols="12"
        md="6"
        class="branding__section"
        v-if="!isMobileScreen()"
      >
        <!-- <img
          src="../../assets/images/traktor.svg"
          alt=""
          class="product__img"
          v-if="$route.path === '/'"
        /> -->
        <img
          src="../../assets/images/nirmaan-iitm.svg"
          alt=""
          class="product__img"
          style="width: 220px"
        />
        <h2
          style="color: #3aa959"
          class="text-center mt-2"
          v-if="$route.path === '/'"
        >
          Nirmaan IITM
        </h2>
        <h3 class="text-center" v-if="$route.path === '/'">Startup Management Portal</h3>
        <br />
        <img
          src="@/assets/images/logo/Startupreneur-Logo_Black.png"
          alt=""
          class="branding__img"
        />
      </v-col>
      <v-col cols="12" v-if="isMobileScreen()">
        <img
          src="@/assets/images/logo/Startupreneur-Logo_Black.png"
          alt=""
          class="branding__img"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import LoginComp from "@/components/Auth/Login.vue";

export default {
  components: {
    LoginComp,
  },
  methods: {
    isMobileScreen() {
      return screen.width <= 600 ? true : false;
    },
  },
};
</script>
<style scoped>
.container {
  height: 99%;
}

.login__row {
  height: 100%;
  margin: auto 0;
}

.branding__section {
  text-align: center;
  background-color: #fff;
  border-radius: 15px;
  margin-top: 10px;
  position: relative;
}

.logo {
  width: 100px;
}

h1 {
  color: #4f4f4f;
  font-size: 22px;
}

.product__img {
  width: 350px;
  margin-top: 50%;
}

.branding__img {
  width: 250px;
  position: absolute;
  bottom: 1rem;
  left: 0;
  right: 0;
  margin: 0 auto;
}

@media only screen and (max-width: 600px) {
  .branding__img {
    margin-top: 0;
    width: 210px;
    margin: 0 auto;
    display: block;
  }
  .product__img {
    margin: 0 auto;
    margin-top: 20px;
    display: block;
    width: 250px;
  }
}
</style>