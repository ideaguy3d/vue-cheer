<template>
<main>
  <v-app>
    <v-alert error dismissible v-model="error">
      You cannot delete a user that has affected scores or roomdates.
    </v-alert>
   <v-card-title>
      Application User Management
      <v-spacer></v-spacer>
      <v-btn light large style="margin: auto; margin-left: 40px" class="purple" v-on:click.native="add">Create new user</v-btn>
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
          <v-btn floating small v-tooltip:top="{ html: 'Edit User' }" v-on:click.native="openUser(props.item)" class="purple">
          <v-icon light>edit</v-icon>
          </v-btn>
          <v-btn floating small v-tooltip:top="{ html: 'Change Password' }" v-on:click.native="editUserPass(props.item)" class="purple">
          <v-icon light>lock</v-icon>
          </v-btn>
          <v-btn floating small v-tooltip:top="{ html: 'Delete User' }" v-on:click.native="del(props.item)" class="purple">
          <v-icon light>delete</v-icon>
          </v-btn>
        </td>
        <td class="text-xs-right">{{ props.item.Role }}</td>
        <td class="text-xs-right">{{ props.item.FirstName }}</td>
        <td class="text-xs-right">{{ props.item.MiddleName }}</td>
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
            text: 'Middle Name',
            right: true,
            sortable: true,
            value: 'MiddleName'
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
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/get/getUsers', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
            component.items = body;
            component.notLoaded = false;
          }
      });
    },
    add (){
      this.$router.push({path: "/manageUsers/newUser"});
    },
    openUser(User){
      //console.log(countryID);
      this.$store.commit("setCurrentUser", User);
      //console.log(this.$store.state.manageCountry);
      this.$router.push({path: '/manageUsers/editUser'});

    },
    editUserPass(User){
      //console.log(countryID);
      this.$store.commit("setCurrentUser", User);
      //console.log(this.$store.state.manageCountry);
      this.$router.push({path: '/manageUsers/EditUserPass'});

    },
    del(user){
        let component = this;
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/delete/user', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID, UserID: user.UserID}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
            for (let i=0; i < component.items.length; i++){
              if (component.items[i].UserID == user.UserID){
                component.items.splice(i, 1);
              }
            }
          }
          else if (httpResponse.statusCode == 409){
            component.error = true;
          }
      });
    }
    }
  }
</script>

<style>

</style>
