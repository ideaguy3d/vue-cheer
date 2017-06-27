<template>
<main>
  <v-app>
    <v-layout row wrap>
          <v-flex xs11>
          <v-text-field
          name="input-1"
          label="Round Description"
          id="testing"
          v-model="RoundDescription"
          ></v-text-field>
      </v-flex>
      <v-btn light floating small style="margin: auto; margin-left: 0px" class="purple" v-on:click.native="add"><v-icon light>add</v-icon></v-btn>
      </v-layout>
   <v-card-title>
      Rounds
      <v-spacer></v-spacer>
      <!--<v-btn light large style="margin: auto; margin-left: 40px" class="purple" v-on:click.native="add">Create new round</v-btn>
      <v-spacer></v-spacer>-->
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
          <v-btn floating small v-on:click.native="openRound(props.item.RoundID)" class="purple">
          <v-icon light>edit</v-icon>
          </v-btn>
          <v-btn floating small v-on:click.native="del(props.item.RoundID)" class="purple">
          <v-icon light>delete</v-icon>
          </v-btn>
        </td>
        <td class="text-xs-right">{{ props.item.RoundDescription }}</td>

        </template>
      <template slot="pageText" scope="{ pageStart, pageStop }">
        From {{ pageStart }} to {{ pageStop }}
      </template>
    </v-data-table>
    <v-alert error dismissible v-model="error">
      You cannot delete a round that has been assigned to a performance or a room.
    </v-alert>
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
        RoundID: guid.create().value,
        RoundDescription: "",
        CountryName: "",
        CountryFlagPath: "",
        search: '',
        error: false,
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
            text: 'Round',
            right: true,
            sortable: true,
            value: 'RounDescription'
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
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/get/getRounds', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
            component.items = body;
            //console.log(body);
          }
      });
    },
    add (){
      let component = this;
      if (this.RoundDescription != "" || this.RoundDescription != null){
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/post/round', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID, RoundID: this.RoundID, RoundDescription: this.RoundDescription}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
            component.RoundID = guid.create().value;
            component.RoundDescription = "";
            component.fetchData();
          }
          if (httpResponse.statusCode == 409){
            component.error = true;
          }
        })
      }
    },
    del(RoundID){
        let component = this;
        //console.log(RoundID);
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/delete/round', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID, RoundID: RoundID}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
            for (let i=0; i < component.items.length; i++){
              if (component.items[i].RoundID == RoundID){
                component.items.splice(i, 1);
              }
            }
            //component.items = body;
          }
          else if (httpResponse.statusCode == 409){
            component.error = true;
          }
      });
    },
    openRound(RoundID){
      //console.log(countryID);

      for (let i=0; i < this.items.length; i++){
        if (this.items[i].RoundID == RoundID){
            this.$store.commit("setCurrentRound", this.items[i]);
            this.$router.push({path: '/manageRounds/editRound'});
        }
      }


    }
    }
  }
</script>

<style>

</style>
