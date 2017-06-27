<template>
<main>
  <v-app>
    <v-layout row wrap>
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
    </v-layout>
   <v-card-title>
      Event Countries
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
          <v-btn floating small v-on:click.native="openCountry(props.item.CountryID)" class="purple">
          <v-icon light>edit</v-icon>
          </v-btn>
        </td>
        <td class="text-xs-right">{{ props.item.CountryName }}</td>
        <td class="text-xs-right">{{ props.item.CountryFlagPath }}</td>
        <td class="text-xs-right">{{ props.item.Directors }}</td>

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
        notLoaded: true,
        CountryName: "",
        CountryFlagPath: "",
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
            text: 'Country Name',
            right: true,
            sortable: true,
            value: 'CountryName'
          },
          {
            text: 'Abbreviation',
            right: true,
            sortable: false,
            value: 'CountryFlagPath'
          },
          {
            text: 'Directors',
            sortable: false,
            right: true,
            value: 'Directors'
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
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/get/getCountries', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID}}, function (err, httpResponse, body){
          let countryData = [];
          for (let i=0; i < body.length; i++){
            let directors = "";
            for (let x=0; x < body[i].Directors.length; x++){
              if (x == body[i].Directors.length -1){
                //directors += "[" + body[i].Directors[x].FirstName + " " + body[i].Directors[x].LastName + " Email Address: " +  body[i].Directors[x].EmailAddress + " Phone Number: " + body[i].Directors[x].PhoneNumber + "]"
                directors += body[i].Directors[x].FirstName + " " + body[i].Directors[x].LastName;
              }
              else{
                //directors += "[" + body[i].Directors[x].FirstName + " " + body[i].Directors[x].LastName + " Email Address: " +  body[i].Directors[x].EmailAddress + " Phone Number: " + body[i].Directors[x].PhoneNumber + "], "
                directors += body[i].Directors[x].FirstName + " " + body[i].Directors[x].LastName + ", ";
              }
            }
            if (body[i].Directors.length == 0){
              directors = "None";
            }
            countryData.push({
              CountryID: body[i].CountryID,
              CountryFlagPath: body[i].CountryFlagPath,
              CountryName: body[i].CountryName,
              Directors: directors
            })
          }
        //console.log(httpResponse);
        //console.log(countryData);
        component.items = countryData;
        component.notLoaded = false;
        //component.$store.commit("setCountryData", countryData);
      });
    },
    add (){
      let newCountryID = guid.create().value;
      let component = this;
      request.post({url:'http://'+this.$store.state.serverIP+'/post/country', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID, CountryID: newCountryID, CountryName: this.CountryName, CountryFlagPath: this.CountryFlagPath, Directors: JSON.stringify([]), NewCountry: true}}, function(err,httpResponse,body){
        if(httpResponse.statusCode == 200){
            //component.$router.push({path: '/manageCountries'});
            component.CountryName = "";
            component.CountryFlagPath = "";
            component.fetchData();
        }
      })
    },
    openCountry(countryID){
      //console.log(countryID);
      this.$store.commit("setCurrentCountry", countryID);
      console.log(this.$store.state.manageCountry);
      this.$router.push({path: '/manageCountries/editCountry'});

    }
    }
  }
</script>

<style>

</style>
