<template>
<main>
  <v-app>
    <v-layout row>
    <v-flex xs6>
        <v-text-field name="input-1" label="Category Name" id="testing" v-model="CategoryDescription" required></v-text-field>
    </v-flex>
    <v-flex xs4>
        <v-text-field name="input-1" label="Stage Setup Time (Min)" id="testing" v-model="StageSetupTime" required></v-text-field>
    </v-flex>
    <v-btn floating small v-on:click.native="add" class="purple">
        <v-icon light>add</v-icon>
    </v-btn>
    </v-layout>
   <v-card-title>
      Categories
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
          <v-btn floating small v-on:click.native="openCategory(props.item)" class="purple">
          <v-icon light>edit</v-icon>
          </v-btn>
          <v-btn floating small v-on:click.native="del(props.item)" class="purple">
          <v-icon light>delete</v-icon>
          </v-btn>
        </td>
        <td class="text-xs-right">{{ props.item.CategoryDescription }}</td>
        <td class="text-xs-right">{{ props.item.StageSetupTime }}</td>
        </template>
      <template slot="pageText" scope="{ pageStart, pageStop }">
        From {{ pageStart }} to {{ pageStop }}
      </template>
    </v-data-table>
    <v-alert error dismissible v-model="error">
      You cannot delete a category that has already been assigned to performances.
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
        CategoryID: guid.create().value,
        StageSetupTime: null,
        CategoryDescription: null,
        CountryName: "",
        CountryFlagPath: "",
        search: '',
        error: false,
        pagination: {page:1, rowsPerPage: 20},
        paginationNum: [10, 20, 50, 100, 200],
        headers: [
          {
          text: 'Action',
          right: false,
          sortable: false,
          value: 'Action'
        },
          {
            text: 'Category Name',
            right: false,
            sortable: true,
            value: 'CategoryDescription'
          },
          {
            text: 'Stage Setup Time (Min)',
            right: false,
            sortable: true,
            value: 'StageSetupTime'
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
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/get/getCategories', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
            component.items = body;
            //console.log(body);
          }
      });
    },
    add (){
        let component = this;
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/post/category', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID, CategoryDescription: this.CategoryDescription, StageSetupTime: this.StageSetupTime, CategoryID: this.CategoryID}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
            component.CategoryID = guid.create().value;
            component.CategoryDescription = null;
            component.StageSetupTime = null;
            //console.log(body);
            component.fetchData();
          }
      });
      this.fetchData();
    },
    del(Category){
        let component = this;
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/delete/category', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID, CategoryID: Category.CategoryID}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
            for (let i=0; i < component.items.length; i++){
              if (component.items[i].CategoryID == Category.CategoryID){
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
    openCategory(Category){
      //console.log(countryID);
            this.$store.commit("setCategory", Category);
            this.$router.push({path: '/manageCategories/editCategory'});
    }
    }
  }
</script>

<style>

</style>
