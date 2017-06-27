<template>
<main>
  <v-app>
   <v-card-title>
      Rooms
      <v-spacer></v-spacer>
      <v-btn light large style="margin: auto; margin-left: 40px" class="purple" v-on:click.native="add">Create new room</v-btn>
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
          <v-btn floating small v-on:click.native="openRoom(props.item.RoomID)" class="purple">
          <v-icon light>edit</v-icon>
          </v-btn>
          <v-btn floating small v-on:click.native="del(props.item.RoomID)" class="purple">
          <v-icon light>delete</v-icon>
          </v-btn>
        </td>
        <td class="text-xs-right">{{ props.item.RoomName }}</td>
        <td class="text-xs-right">{{ props.item.RoomLocation }}</td>

        </template>
      <template slot="pageText" scope="{ pageStart, pageStop }">
        From {{ pageStart }} to {{ pageStop }}
      </template>
    </v-data-table>
    <v-alert error dismissible v-model="error">
      You cannot delete a room that has been assigned in a schedule.
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
            text: 'Room Name',
            right: true,
            sortable: true,
            value: 'RoomName'
          },
          {
            text: 'Room Location',
            right: true,
            sortable: true,
            value: 'RoomLocation'
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
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/get/getRooms', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
            component.items = body;
            //console.log(body);
          }
      });
    },
    add (){
      this.$router.push({path: "/manageRooms/newRoom"});
    },
    del(RoomID){
        let component = this;
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/delete/room', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID, RoomID: RoomID}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
            for (let i=0; i < component.items.length; i++){
              if (component.items[i].RoomID == RoomID){
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
    openRoom(RoomID){
      //console.log(countryID);

      for (let i=0; i < this.items.length; i++){
        if (this.items[i].RoomID == RoomID){
            this.$store.commit("setCurrentRoom", this.items[i]);
            this.$router.push({path: '/manageRooms/editRoom'});
        }
      }


    }
    }
  }
</script>

<style>

</style>
