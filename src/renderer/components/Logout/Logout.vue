<template>
</template>

<script>
import fs from "fs";
import request from "request";
  export default {
    name: 'Login',
    components: {},
    data() {
      return{
      randomName: "MESSAGE",
      emailAddress: "",
      password: "",
      failed: false,
      loading: false
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link);
      },
    },
    created: function (){
        this.$store.commit('setCurrentToken', "");
        fs.unlinkSync("token.json");
        this.$store.commit("setEventSet", false);
        this.$router.push({path: "/"});
    }

  }
</script>

<style>

</style>
