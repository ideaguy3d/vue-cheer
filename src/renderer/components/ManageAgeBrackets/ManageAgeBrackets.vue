<template>
  <main>
    <v-app>
      <v-alert error dismissible v-model="error">
        You cannot delete an age bracket that is already assigned to a performance.
      </v-alert>
      <v-card-title>
        Age Brackets
        <v-spacer></v-spacer>
        <v-btn light large style="margin: auto; margin-left: 40px" class="purple" v-on:click.native="add">Create new age bracket</v-btn>
        <v-spacer></v-spacer>
        <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>
      </v-card-title>
      <v-data-table v-bind:headers="headers" v-bind:items="items" v-bind:search="search" :rows-per-page-items="paginationNum" :pagination.sync="pagination">
        <template slot="items" scope="props">
          <td>
            <v-btn floating small v-on:click.native="openAgeBracket(props.item)" class="purple">
              <v-icon light>edit</v-icon>
            </v-btn>
            <v-btn floating small v-on:click.native="del(props.item)" class="purple">
              <v-icon light>delete</v-icon>
            </v-btn>
          </td>
          <td class="text-xs-right">{{ props.item.Description }}</td>
          <td class="text-xs-right">{{ props.item.MinAge }}</td>
          <td class="text-xs-right">{{ props.item.MaxAge }}</td>
          <td>
            <v-checkbox v-model="props.item.PrelimAge" dark disabled></v-checkbox>
          </td>

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
    data() {
      return {
        CountryName: "",
        CountryFlagPath: "",
        search: '',
        error: false,
        pagination: {
          page: 1,
          rowsPerPage: 20
        },
        paginationNum: [10, 20, 50, 100, 200],
        headers: [{
            text: 'Action',
            right: true,
            sortable: false,
            value: 'Action'
          },
          {
            text: 'Age Class',
            right: true,
            sortable: true,
            value: 'Description'
          },
          {
            text: 'Min Age',
            right: true,
            sortable: true,
            value: 'MinAge'
          },
          {
            text: 'Max Age',
            right: true,
            sortable: true,
            value: 'MaxAge'
          },
          {
            text: 'Preliminary Bracket',
            right: true,
            sortable: true,
            value: 'PrelimAge'
          }
        ],
        items: []
      }
    },
    created() {
      //console.log(this.$store.state.eventData.EventID);
      this.fetchData();
    },
    methods: {
      fetchData() {
        let component = this;
        request.post({
          json: true,
          url: "http://" + this.$store.state.serverIP + '/get/getAgeClass',
          form: {
            token: this.$store.state.token,
            EventID: this.$store.state.eventData.EventID
          }
        }, function (err, httpResponse, body) {
          if (httpResponse.statusCode == 200) {
            component.items = body;
            //console.log(body);
          }
        });
      },
      add() {
        this.$router.push({
          path: "/manageAgeBrackets/newAgeBracket"
        });
      },
      del(AgeClass) {
        //console.log(AgeClass);
        let component = this;
        request.post({
          json: true,
          url: "http://" + this.$store.state.serverIP + '/delete/ageClass',
          form: {
            token: this.$store.state.token,
            EventID: this.$store.state.eventData.EventID,
            AgeID: AgeClass.AgeID
          }
        }, function (err, httpResponse, body) {
          if (httpResponse.statusCode == 200) {
            for (let i = 0; i < component.items.length; i++) {
              if (component.items[i].AgeID == AgeClass.AgeID) {
                component.items.splice(i, 1);
              }
            }
            //component.items = body;
          } else if (httpResponse.statusCode == 409) {
            component.error = true;
          }
        });
      },
      openAgeBracket(AgeBracket) {
        //console.log(AgeBracket);
            this.$store.commit("setAgeBracket", AgeBracket);
            this.$router.push({
              path: '/manageAgeBrackets/EditAgeBracket'
            });


      }
    }
  }
</script>

<style>

</style>