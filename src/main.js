import Vue from 'vue';
import App from './App.vue';
import Vuetify from 'vuetify/lib';
import VueTypedJs from 'vue-typed-js';

Vue.use(Vuetify);
Vue.use(VueTypedJs);

Vue.config.productionTip = false;

new Vue({
  vuetify: new Vuetify({}),
  render: h => h(App)
}).$mount('#app');
