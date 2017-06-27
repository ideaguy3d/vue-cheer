import Vue from 'vue'
import axios from 'axios'
import request from 'request'
import App from './App'
import router from './router'
import store from './store'
import roboto from "roboto-fontface/css/roboto/roboto-fontface.css";
import materialicons from "material-design-icons/iconfont/material-icons.css";
import "vuetify/dist/vuetify.min.css";
import Vuetify from 'vuetify';
import mdc from "material-components-web/dist/material-components-web.css";
import mdcjs from "material-components-web/dist/material-components-web.js"
import fs from "fs"
Vue.use(Vuetify);
let appConfig = JSON.parse(fs.readFileSync("app_client_config.json"));

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
  mounted(){
    this.$store.commit('loadTokenFromFile');
    this.$store.commit("setServerIP", appConfig.ServerIP);
    if (this.$store.state.token != null){
    let component = this;
    request.post({url: "http://"+this.$store.state.serverIP+'/auth/refresh', form: {token: this.$store.state.token}}, function (err, httpResponse, body){
      if (httpResponse.statusCode == 200){
        fs.writeFileSync("token.json", httpResponse.body);
        component.$store.commit("setCurrentToken", JSON.parse(httpResponse.body).token);
        //console.log("blah");
        component.$router.push("landing");
      }
    });

    //This will refresh the token every 3 minutes indefinitely.
    setInterval(function(){
        request.post({url: "http://"+component.$store.state.serverIP+'/auth/refresh', form: {token: component.$store.state.token}}, function (err, httpResponse, body){
        if (httpResponse.statusCode == 200){
          fs.writeFileSync("token.json", httpResponse.body);
          component.$store.commit("setCurrentToken", JSON.parse(httpResponse.body).token);
          //console.log("blah");
          //component.$router.push("landing");
        }
      })
    }, 180000);
  }
  }
}).$mount('#app');