import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import firebase from 'firebase'

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyBybw4feKZyAyZ2NW2c92x-WQfDiVdF6xo",
  authDomain: "musaic-color.firebaseapp.com",
  projectId: "musaic-color",
  storageBucket: "musaic-color.appspot.com",
  messagingSenderId: "112161329321",
  appId: "1:112161329321:web:7d7c23d6cead95a75159b8",
  measurementId: "${config.measurementId}"
};

firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
