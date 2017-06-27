<template>
<main>
  <v-app>
   <v-card-title>
      Event Attendees
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
      >
        <template slot="items" scope="props">
        <td>    
          <!--<v-btn floating small v-on:click.native="openCountry(props.item.CountryID)" class="purple">-->
          <v-icon light>edit</v-icon>
          </v-btn>
        </td>
        <td class="text-xs-right">{{ props.item.Name }}</td>
        <td class="text-xs-right">{{ props.item.Fee }}</td>
        <td class="text-xs-right">{{ props.item.Paid }}</td>
        <td class="text-xs-right">{{ props.item.AcctBal }}</td>
        <td class="text-xs-right">{{ props.item.Desc }}</td>

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
    name: 'ManageAttendees',
    data (){
      return {
         search: '',
        pagination: {page:1, rowsPerPage: 20},
        paginationNum: [10, 20, 50],
        headers: [
          {
          text: 'Action',
          right: true,
          sortable: false,
          value: 'Action'
          },
          {
            text: 'Attendee Name',
            right: true,
            sortable: true,
            value: 'Name'
          },
          {
            text: 'Fee',
            right: true,
            sortable: false,
            value: 'Fee'
          },
          {
            text: 'Paid',
            sortable: false,
            right: true,
            value: 'Paid'
          },
          {
            text: 'Account Balance',
            sortable: false,
            right: true,
            value: 'AcctBal'
          },
          {
            text: 'Description',
            sortable: false,
            right: true,
            value: 'Desc'
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
          let attendeeData = [];
          for (let i=0; i < body.length; i++){
            // let directors = "";
            // for (let x=0; x < body[i].Directors.length; x++){
            //   if (x == body[i].Directors.length -1){
            //     directors += "[" + body[i].Directors[x].FirstName + " " + body[i].Directors[x].LastName + " Email Address: " +  body[i].Directors[x].EmailAddress + " Phone Number: " + body[i].Directors[x].PhoneNumber + "]"
            //   }
            //   else{
            //     directors += "[" + body[i].Directors[x].FirstName + " " + body[i].Directors[x].LastName + " Email Address: " +  body[i].Directors[x].EmailAddress + " Phone Number: " + body[i].Directors[x].PhoneNumber + "], "
            //   }
            // }
            attendeeData.push({
              Name: body[i].Name,
              Fee: body[i].Fee,
              Paid: body[i].Paid,
              AcctBal: body[i].Paid,
              Desc: body[i].Description
            })
          }
        //console.log(httpResponse);
        component.items = attendeeData;
      });
    },
    // openCountry(countryID){
    //   //console.log(countryID);
    //   this.$store.commit("setCurrentCountry", countryID);
    //   console.log(this.$store.state.manageCountry);
    //   this.$router.push({path: '/manageCountries/editCountry'});

    // }
    }
  }
</script>

<style>

</style>
