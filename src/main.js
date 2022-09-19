import Vue from "vue";
import "@/config/firebase";
import store from "./store";
import router from "./router";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";

import "./plugins/perfectScroll";
import "./plugins/formWizard";
import "./plugins/papaParse";
import "./plugins/graphs";
import "./plugins/fullscreen";
import "./plugins/apexcharts";
import "./plugins/vue-toast-notification";
import "./plugins/vue-json-excel";
import "./plugins/vue-error-handler";
import "./plugins/vue-warning-handler";

Vue.config.productionTip = true;

//set global variables
Vue.prototype.$defaultStartupPhotoURL = "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Logos%2Fstartups%2Fnoun_startup_1561106%20(1).png?alt=media&token=c293be6c-8f57-46d8-a38b-c5eb248259d4"

navigator.serviceWorker.getRegistrations().then(function (registrations) { for (let registration of registrations) { registration.unregister(); } });

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
