<template>
<main>
  <v-app>
    <v-alert error dismissible v-model="deleteError">
      You may not delete a judge that is assigned to a room time or has committed any score data.
    </v-alert>
   <v-card-title>
      Event Judges
      <v-spacer></v-spacer>
      <v-btn light large style="margin: auto; margin-left: 40px" class="purple" v-on:click.native="add">Create new judge</v-btn>
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
          <v-btn floating small v-on:click.native="openJudge(props.item)" class="purple">
          <v-icon light>edit</v-icon>
          </v-btn>
          <v-btn floating small v-on:click.native="del(props.item.JudgeID)" class="purple">
          <v-icon light>delete</v-icon>
          </v-btn>
        </td>
        <td class="text-xs-right">{{ props.item.Agency }}</td>
        <td class="text-xs-right">{{ props.item.Title }}</td>
        <td class="text-xs-right">{{ props.item.FirstName }}</td>
        <td class="text-xs-right">{{ props.item.LastName }}</td>
        <td class="text-xs-right">{{ props.item.EmailAddress }}</td>
        <td class="text-xs-right">{{ props.item.PhoneNumber }}</td>

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
        deleteError: false,
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
            text: 'Agency',
            right: true,
            sortable: true,
            value: 'Agency'
          },
          {
            text: 'Title',
            right: true,
            sortable: true,
            value: 'Title'
          },
          {
            text: 'First Name',
            right: true,
            sortable: true,
            value: 'FirstName'
          },
          {
            text: 'Last Name',
            right: true,
            sortable: true,
            value: 'LastName'
          },
          {
            text: 'Email Address',
            right: true,
            sortable: true,
            value: 'EmailAddress'
          },
          {
            text: 'Phone Number',
            right: true,
            sortable: true,
            value: 'PhoneNumber'
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
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/get/getJudges', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
            component.items = body;
            component.notLoaded = false;
          }
      });
    },
    add (){
      this.$router.push({path: "/manageJudges/newJudge"});
    },
    openJudge(JudgeID){
      //console.log(countryID);
      this.$store.commit("setCurrentJudge", JudgeID);
      //console.log(this.$store.state.manageCountry);
      this.$router.push({path: '/manageJudges/editJudge'});

    }, 
    del (JudgeID){
      let component = this;
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/delete/judge', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID, JudgeID: JudgeID}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
            component.fetchData();
          }
          else if (httpResponse.statusCode == 409){
            component.deleteError = true;
          }
      });
    }
    }
  }
</script>

<style>

</style>
