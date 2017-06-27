<template>
  <main>
    <h3>Generate Schedule for Current Event</h3>
    <form>
      <v-layout row wrap>
        <v-btn light large style="margin: auto; margin-right: 40px;" class="purple" v-on:click.native="cancel">Cancel</v-btn>
        <v-btn light large style="margin: auto; margin-left: 0px" class="purple" v-on:click.native="saveEvent">Save</v-btn>
      </v-layout>
    </form>
  </main>
</template>

<script>
import fs from "fs";
import request from "request";
import guid from "guid";

export default {
  name: 'Login',
  components: {},
  data() {
    return {
      EventName: this.$store.state.eventData.EventName,
      GlobalPerformanceLength: this.$store.state.eventData.GlobalPerformanceLength,
      GlobalTransitTime: this.$store.state.eventData.GlobalTransitTime,
      StartDate: this.$store.state.eventData.StartDate,
      EndDate: this.$store.state.eventData.EndDate,
      EventID: this.$store.state.eventData.EventID
    }
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    cancel() {
      this.$router.push("dashboard");
    }
  }
}
</script>

<style>

</style>
