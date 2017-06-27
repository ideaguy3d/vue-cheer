<template>
<main>
    <h3>Edit Current Event</h3>
    <form>
      <v-card class="grey lighten-4 elevation-0">
      <v-card-text>
        <v-container fluid>
          <v-layout row>
            <v-flex xs10>
              <v-text-field
                v-model="EventName"
                name="input-1"
                label="Event Name"
                id="eventname"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs10>
              <v-text-field
                v-model="GlobalPerformanceLength"
                name="input-1"
                label="Maximum Performance Time (Minutes)"
                id="eventname"
                type="number"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs10>
              <v-text-field
                v-model="GlobalTransitTime"
                name="input-1"
                label="Minimum Walking Distance Between Rooms (Minutes)"
                id="eventname"
                type="number"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
      <v-flex xs12 sm6>
        <v-dialog
          persistent
          lazy
        >
          <v-text-field
            slot="activator"
            label="Event Start Date"
            v-model="StartDate"
            prepend-icon="event"
            required
            readonly
          ></v-text-field>
          <v-date-picker v-model="StartDate" scrollable>
            <template scope="{ save, cancel }">
              <v-card-row actions>
                <v-btn flat primary @click.native="cancel()">Cancel</v-btn>
                <v-btn flat primary @click.native="save()">Save</v-btn>
              </v-card-row>
            </template>
          </v-date-picker>
        </v-dialog>
      </v-flex>
      <v-flex xs12 sm6>
        <v-dialog
          persistent
          lazy
        >
          <v-text-field
            slot="activator"
            label="Event End Date"
            v-model="EndDate"
            prepend-icon="event"
            required
            readonly
          ></v-text-field>
          <v-date-picker v-model="EndDate" scrollable>
            <template scope="{ save, cancel }">
              <v-card-row actions>
                <v-btn flat primary @click.native="cancel()">Cancel</v-btn>
                <v-btn flat primary @click.native="save()">Save</v-btn>
              </v-card-row>
            </template>
          </v-date-picker>
        </v-dialog>
      </v-flex>
    </v-layout>
        </v-container>
        </v-card-text>
        </v-card>
          <br>
          <v-alert error v-model="createEventError">
            Error with event creation, please make sure you have filled in every field.
          </v-alert>
          <v-progress-linear v-bind:indeterminate="true" v-if="savingInProgress"></v-progress-linear>
            <br>
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
      return{
        EventName: this.$store.state.eventData.EventName,
        GlobalPerformanceLength: this.$store.state.eventData.GlobalPerformanceLength,
        GlobalTransitTime: this.$store.state.eventData.GlobalTransitTime,
        StartDate: this.$store.state.eventData.StartDate,
        EndDate: this.$store.state.eventData.EndDate,
        EventID: this.$store.state.eventData.EventID,
        createEventError: false,
        savingInProgress: false
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link);
      },
      cancel (){
        this.$router.push("dashboard");
      },
      saveEvent (){
        //console.log(this.EventName);
        if (this.EventName == null || this.StartDate == null || this.EndDate == null){
          this.createEventError = true;

      }
      else{
          if (this.GlobalPerformanceLength == ""){
            this.GlobalPerformanceLength = 0;
          }
          if (this.GlobalTransitTime == ""){
            this.GlobalTransitTime = 0;
          }
          this.createEventError = false;
          this.savingInProgress = true;
          //this.EventID = guid.create().value;
          let eventData = {
            EventName: this.EventName,
            GlobalPerformanceLength: this.GlobalPerformanceLength,
            GlobalTransitTime: this.GlobalTransitTime,
            StartDate: this.StartDate,
            EndDate: this.EndDate,
            EventID: this.EventID
          };
          let component = this;
          request.post({url:'http://'+this.$store.state.serverIP+'/post/newEvent', form: {token: this.$store.state.token, EventName: eventData.EventName, GlobalPerformanceLength: eventData.GlobalPerformanceLength,
          GlobalTransitTime: eventData.GlobalTransitTime, StartDate: eventData.StartDate, EndDate: eventData.EndDate, EventID: eventData.EventID}}, function(err,httpResponse,body){
            if (httpResponse.statusCode == 200){
              //console.log("All good, posted to db");
              component.$store.commit("setCurrentEvent", eventData.EventID);
              component.$store.commit("setEventData", eventData);
              component.$router.push("dashboard");
              component.$store.commit("setEventSet", true);
              //console.log(component.$store.eventSet);
              //console.log(component.$store.state.event);

            }
            else{
              this.createEventError = true;
            }
          })
          //console.log(this.EventID);
          //console.log("no errors");
      }
    }
  }
  }
</script>

<style>

</style>
