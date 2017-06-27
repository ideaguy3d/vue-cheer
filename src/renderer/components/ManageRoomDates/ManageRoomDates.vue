<template>
<main>
  <v-app>
   <v-card-title>
      Room Times
      <v-spacer></v-spacer>
      <v-btn light large style="margin: auto; margin-left: 40px" class="purple" v-on:click.native="add">Add room time</v-btn>
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
          <v-btn floating small v-on:click.native="openRoomDate(props.item.RoomDateID)" class="purple">
          <v-icon light>edit</v-icon>
          </v-btn>
          <v-btn floating small v-on:click.native="del(props.item.RoomDateID)" class="purple">
          <v-icon light>delete</v-icon>
          </v-btn>
        </td>
        <td class="text-xs-right">{{ props.item.RoundDescription }}</td>
        <td class="text-xs-right">{{ props.item.RoomName }}</td>
        <td class="text-xs-right">{{ props.item.RoomLocation }}</td>
        <td class="text-xs-right">{{ props.item.RoomStartString }}</td>
        <td class="text-xs-right">{{ props.item.RoomEndString }}</td>

        

        </template>
      <template slot="pageText" scope="{ pageStart, pageStop }">
        From {{ pageStart }} to {{ pageStop }}
      </template>
    </v-data-table>
    <v-alert error dismissible v-model="error">
      You cannot delete a room time that has been assigned in a schedule.
    </v-alert>
  </v-card>
  </v-app>
</main>
</template>

<script>
import fs from "fs";
import request from "request";
import guid from "guid";
import moment from "moment-es6";
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
            text: 'Round',
            right: true,
            sortable: true,
            value: 'RoundDescription'
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
          },
          {
            text: 'Start Time',
            right: true,
            sortable: true,
            value: 'RoomStartString'
          },
          {
            text: 'End Time',
            right: true,
            sortable: true,
            value: 'RoomEndString'
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
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/get/getRoomDates', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
            let newData = [];
            for (let i=0; i < body.length; i++){
              newData.push({
                RoomID: body[i].RoomID,
                RoomName: body[i].RoomName,
                RoomLocation: body[i].RoomLocation,
                EventID: body[i].EventID,
                RoomStartTime: body[i].RoomStartTime,
                RoomEndTime: body[i].RoomEndTime,
                RoomStartString: moment.unix(body[i].RoomStartTime).format('MMMM Do YYYY, h:mm:ss a'),
                RoomEndString: moment.unix(body[i].RoomEndTime).format('MMMM Do YYYY, h:mm:ss a'),
                RoundID: body[i].RoundID,
                RoundDescription: body[i].RoundDescription,
                RoomDateID: body[i].RoomDateID
              });
            }
            component.items = newData;
          }
      });
    },
    add (){
      this.$router.push({path: "/manageRoomDates/newRoomDate"});
    },
    del(RoomDateID){
        let component = this;
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/delete/roomDate', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID, RoomDateID: RoomDateID}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
            for (let i=0; i < component.items.length; i++){
              if (component.items[i].RoomDateID == RoomDateID){
                component.items.splice(i, 1);
              }
            }
          }
          else if (httpResponse.statusCode == 409){
            component.error = true;
          }
      });
    },
    openRoomDate(RoomDateID){
      //console.log(countryID);

      for (let i=0; i < this.items.length; i++){
        if (this.items[i].RoomDateID == RoomDateID){
            this.$store.commit("setCurrentRoomDate", this.items[i]);
            this.$router.push({path: '/manageRoomDates/editRoomDate'});
        }
      }


    }
    }
  }
</script>

<style>

</style>
