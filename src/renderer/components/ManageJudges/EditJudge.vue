<template>
<main>
  <v-app>
    <h3>Edit Judge: </h3>
    <v-flex xs8>
        <v-text-field name="input-1" label="Agency" id="testing" v-model="Agency"></v-text-field>
    </v-flex>
    <v-flex xs8>
        <v-text-field name="input-1" label="Title" id="testing" v-model="Title"></v-text-field>
    </v-flex>
    <v-flex xs8>
        <v-text-field name="input-1" label="First Name" id="testing" v-model="FirstName" disabled></v-text-field>
    </v-flex>
    <v-flex xs8>
        <v-text-field name="input-2" label="Last Name" id="testing2" v-model="LastName" disabled></v-text-field>
    </v-flex>
    <v-flex xs8>
        <v-text-field name="input-2" label="Email Address" id="testing2" v-model="EmailAddress" disabled></v-text-field>
    </v-flex>
    <v-flex xs8>
        <v-text-field name="input-2" label="Phone Number" id="testing2" v-model="PhoneNumber" disabled></v-text-field>
    </v-flex>
   <v-card-title>
      Choose a user to link to this Judge
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
          <v-btn light v-on:click.native="openUser(props.item)" class="purple">
              Choose
          </v-btn>
        </td>
        <td class="text-xs-right">{{ props.item.Role }}</td>
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
    <v-layout row wrap>
        <v-btn light large style="margin: auto; margin-right: 40px;" class="purple" v-on:click.native="cancel">Cancel</v-btn>
        <v-btn light large style="margin: auto; margin-left: 0px" class="purple" v-on:click.native="save">Save</v-btn>
    </v-layout>
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
        JudgeID: null,
        UserID: null,
        Agency: null,
        Title: null,
        FirstName: null,
        LastName: null,
        EmailAddress: null,
        PhoneNumber: null,
        CountryName: "",
        CountryFlagPath: "",
        search: '',
        pagination: {page:1, rowsPerPage: 5},
        paginationNum: [5, 10, 20, 50, 100, 200],
        headers: [
          {
          text: 'Action',
          right: true,
          sortable: false,
          value: 'Action'
        },
        {
            text: 'Role',
            right: true,
            sortable: true,
            value: 'Role'
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
      this.fetchData();
    },
    methods: {
      fetchData(){
        let component = this;
        this.JudgeID = this.$store.state.manageJudge.JudgeID;
        this.UserID = this.$store.state.manageJudge.UserID;
        this.Agency = this.$store.state.manageJudge.Agency;
        this.Title = this.$store.state.manageJudge.Title;
        this.FirstName = this.$store.state.manageJudge.FirstName;
        this.LastName = this.$store.state.manageJudge.LastName;
        this.EmailAddress = this.$store.state.manageJudge.EmailAddress;
        this.PhoneNumber = this.$store.state.manageJudge.PhoneNumber;
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/get/getUsers', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
            component.items = body;
          }
      });
    },
    add (){
      this.$router.push({path: "/manageJudges/newJudge"});
    },
    cancel(){
        this.$router.push({path: "/manageJudges"});
    },
    save(){
        let component = this;
        //console.log(this.JudgeID);
        request.post({json: {token: this.$store.state.token, JudgeData: {
            JudgeID: this.JudgeID,
            Agency: this.Agency,
            UserID: this.UserID,
            Title: this.Title
        }, EventID: this.$store.state.eventData.EventID}, url: "http://"+this.$store.state.serverIP+'/post/judge', method: "POST"}, function (err, httpResponse, body){
            if (httpResponse.statusCode == 200){
                component.$router.push({path: "/manageJudges"});
            }
        })
    },
    openUser(UserID){
        this.UserID = UserID.UserID;
        this.FirstName = UserID.FirstName;
        this.LastName = UserID.LastName;
        this.EmailAddress = UserID.EmailAddress;
        this.PhoneNumber = UserID.PhoneNumber;
      //console.log(countryID);
      //this.$store.commit("setCurrentJudge", JudgeID);
      //console.log(this.$store.state.manageCountry);
      //this.$router.push({path: '/manageJudges/editJudge'});

    }
    }
  }
</script>

<style>

</style>
