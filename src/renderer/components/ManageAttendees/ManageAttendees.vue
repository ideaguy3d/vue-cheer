<template>
<main>
  <v-app>
    <!--<v-layout row wrap>
        <v-flex xs5>
        <v-text-field
        name="input-1"
        label="Country Name"
        id="testing"
        v-model="CountryName"
        ></v-text-field>
    </v-flex>
    <v-flex xs6>
    <v-text-field
        name="input-2"
        label="Country Flag Image Path/ISO Abbreviation"
        id="testing2"
        v-model="CountryFlagPath"
        ></v-text-field>
    </v-flex>
    <v-btn light floating small style="margin: auto; margin-left: 0px" class="purple" v-on:click.native="add"><v-icon light>add</v-icon></v-btn>
    </v-layout>-->
    <v-alert error dismissible v-model="error">
      You cannot delete an attendee that has made payments towards admission.
    </v-alert>
   <v-card-title>
      Event Attendees
      <v-spacer></v-spacer>
      <v-btn light large style="margin: auto; margin-left: 40px" class="purple" v-on:click.native="add">Create new Attendee</v-btn>
      <v-spacer></v-spacer>
      <v-text-field
        append-icon="search"
        label="Search"
        single-line
        hide-details
        v-model="search"
      ></v-text-field>
    </v-card-title>
    <v-data-table
        v-bind:headers="headers"
        v-bind:items="items"
        v-bind:search="search"
        :rows-per-page-items="paginationNum"
        :pagination.sync="pagination"
        v-bind:loading="notLoaded"
      >
        <template slot="items" scope="props">
        <td>    
          <v-btn floating small v-on:click.native="openAttendee(props.item)" class="purple">
            <v-icon light>edit</v-icon>
          </v-btn>
          <v-btn floating small v-on:click.native="del(props.item)" class="purple">
            <v-icon light>delete</v-icon>
          </v-btn>
          <v-btn floating v-tooltip:top="{ html: 'View Transactions' }" small v-on:click.native="openPayments(props.item)" class="purple">
            <v-icon light>attach_money</v-icon>
          </v-btn>
        </td>
        <td class="text-xs-right">${{ props.item.RemainingBalance }}</td>
        <td class="text-xs-right">{{ props.item.Name }}</td>
        <td class="text-xs-right">{{ props.item.AttendeeType.Description }}</td>
        <td class="text-xs-right">{{ props.item.Country.CountryName }}</td>
        <td class="text-xs-right">{{ props.item.Info }}</td>

        </template>
      <template slot="pageText" scope="{ pageStart, pageStop }">
        From {{ pageStart }} to {{ pageStop }}
      </template>
    </v-data-table>
  </v-card>
  </v-app>
</main>
</template>

<script>
import fs from "fs";
import request from "request";
import guid from "guid";
  export default {
    name: 'ManageCountries',
    data (){
      return {
        error: false,
        notLoaded: true,
        CountryName: "",
        CountryFlagPath: "",
        search: '',
        pagination: {page:1, rowsPerPage: 20},
        paginationNum: [10, 20, 50, 100, 200],
        headers: [
          {
          text: 'Action',
          right: true,
          sortable: false,
          value: 'Action'
        },
          {
            text: 'Remain Bal.',
            right: true,
            sortable: true,
            value: 'RemainingBalance'
          },
          {
            text: 'Attendee Name',
            right: true,
            sortable: true,
            value: 'Name'
          },
          {
            text: 'Type',
            right: true,
            sortable: true,
            value: 'AttendeeType.Description'
          },
          {
            text: 'Country',
            right: true,
            sortable: true,
            value: 'Country.CountryName'
          },
          {
            text: 'Info',
            right: true,
            sortable: true,
            value: 'Info'
          }
        ],
        items: []
      }
    },
    created(){
      //console.log(this.$store.state.eventData.EventID);
      this.fetchData();
    },
    methods: {
      fetchData(){
        let component = this;
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/get/getAttendees', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
            component.items = body;
            component.notLoaded = false;
          }
      });
    },
    add (){
      this.$router.push({path: "/manageAttendees/newAttendee"});
    },
    openAttendee(Attendee){
      this.$store.commit("setCurrentAttendee", Attendee);
      this.$router.push({path: '/manageAttendees/editAttendee'});

    },
    del(attendee){
      //console.log("trying to delete");
      let component = this;
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/delete/attendee', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID, AttendeeID: attendee.AttendeeID}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
            component.fetchData();
          }
          else if (httpResponse.statusCode == 409){
            component.error = true;
          }
      });
    },
    openPayments(Attendee){
      this.$store.commit("setCurrentAttendee", Attendee);
      this.$router.push({path: '/manageAttendees/attendeePayments'});
    }
    }
    }
</script>

<style>

</style>
