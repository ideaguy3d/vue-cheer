<template>
  <div id="wrapper">
    <div id="dateselect" v-if="dateunsaved">
    <v-layout row justify-space-around>
    <v-flex xs-9>
      <h3 style="text-align: center">Select Event Date:</h3>
      <br>
      <v-date-picker class="purple" v-model="dateselected" landscape></v-date-picker>
    </v-flex>
    </v-layout>
    <br>
    <v-layout row wrap>
        <v-btn light large v-on:click.native="choosedate" style="margin: auto;" class="purple">Load Events</v-btn>
    </v-layout>
    </div>
    <div id="eventselect" v-else="dateunsaved">
         <img id="logo" src="~@/assets/wcopa_logo.png" style="display: block; width: 35%; vertical-align: middle; margin: auto;">
         <h3 style="text-align: center">Please choose an event below:</h3>
         <br>
          <v-flex xs6>
            <!--<select v-model="chosenevent" label="Select Event" class="mdc-select" style="width: 100%">
              <option v-if="eventsFound" value="0" default selected>Select an Event</option>
              <option v-else="eventsFound" value="0" default selected>No events found for this date!</option>
              <option v-for="item in events" :value="item.EventID" >{{ item.EventName + " - " + item.StartDate}}</option>
            </select>-->
              <v-select
              v-bind:items="events"
              v-model="chosenevent"
              label="Select Event"
              dark
              single-line
              auto
            ></v-select>
          </v-flex>
          <br>
          <v-container fluid>
          <v-layout row wrap align-center>
              <v-btn light large style="margin: auto;" class="purple" type="submit" v-on:click.native="chooseEvent">Choose Event</v-btn>
              <v-btn light large style="margin: auto;" class="purple" v-on:click.native="removeDate" type="submit">Select Another Date</v-btn>
          </v-layout>
          </v-container>
          <v-alert error v-model="selectedInvalidEvent">
            You have not selected a valid event, please try again!
          </v-alert>
    </div>
    <main>
    </main>
  </div>
</template>

<script>
  import moment from 'moment-es6';
  import request from "request";
  import fs from "fs";
  export default {
    name: 'landing-page',
    components: {},
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      choosedate (){
        //console.log("test");
        let component = this;
        //console.log(this.$store.state.token);
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/getevents', form: {token: this.$store.state.token, date: this.dateselected}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
            //let result = body;
            //console.log(result);
            if (body.length > 0){
              component.eventsFound = true;
            }
            else{
              component.eventsFound = false;
            }
            let newEvents = [];
            for (let i=0; i < body.length; i++){
              newEvents.push({
                text: body[i].EventName + " - " + moment(body[i].StartDate).format('YYYY-MM-DD') +" to " + moment(body[i].EndDate).format('YYYY-MM-DD'),
                EventName: body[i].EventName,
                EventID: body[i].EventID,
                StartDate: moment(body[i].StartDate).format('YYYY-MM-DD'),
                EndDate: moment(body[i].EndDate).format('YYYY-MM-DD'),
                GlobalPerformanceLength: body[i].GlobalPerformanceLength,
                GlobalTransitTime: body[i].GlobalTransitTime
              })
            }
            component.events = newEvents;
            component.dateunsaved = false;
          }
          else{
            //console.log(httpResponse.statusCode);
          }
            })
        //console.log(this.dateselected);
      },
      chooseEvent(){
        //console.log(this.chosenevent);
          this.selectedInvalidEvent = false;
          this.$store.commit("setCurrentEvent", this.chosenevent);
          this.$router.push("dashboard");
          this.$store.commit("setEventSet", true);
          this.$store.commit("setEventData", this.chosenevent);
          //console.log(this.$store.state.eventData);
          // let thisEventsData = {}
          // for (let i=0; i < this.events.length; i++){
          //   if (this.events[i].EventID == this.chosenevent){
          //     this.$store.commit("setEventData", this.chosenevent.EventID);
          //   }
          // }
          //console.log(this.$store.state.eventData);
          //console.log(this.$store.state.eventSet);
      },
      createNewEvent(){
        this.$router.push("newEvent");
      },
      removeDate (){
        this.dateunsaved = true;
        this.chosenevent = "0";
      }
    },
    data() {
      return {
        dateunsaved: true,
        dateselected: moment(new Date()).format('YYYY-MM-DD'),
        events: null,
        chosenevent: "0",
        selectedInvalidEvent: false,
        eventsFound: false
      }
    }

  }
</script>

<style>

</style>
