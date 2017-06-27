<template>
<main>
  <v-app>
    <v-layout row>
    <v-flex xs12>
      <v-btn light large style="margin: auto; margin-left: 40px" class="purple" v-on:click.native="back">Back to Contestants</v-btn>
    </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs4>
        <p style="font-size: 25px">Contestant ID: {{ContestantInformation.ContestantLevelID + ContestantInformation.ContestantID}}</p>
      </v-flex>
      <v-flex xs4>
        <p style="font-size: 25px">Name: {{ContestantInformation.GroupName}}</p>
      </v-flex>
      <v-flex xs4>
        <p style="font-size: 25px">Gender: {{ContestantInformation.Gender.GenderID}}</p>
      </v-flex>
      <v-flex xs4>
        <p style="font-size: 25px">Age Bracket: {{ContestantInformation.Age.Description}}</p>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs4>
        <p style="font-size: 25px">Competition Country: {{ContestantInformation.CompetitionCountry.CountryName}}</p>
      </v-flex>
      <v-flex xs4>
        <p style="font-size: 25px">Resident Country: {{ContestantInformation.ResidentCountry.CountryName}}</p>
      </v-flex>
    </v-layout>
    <v-layout row>
          <v-flex xs6>
            <v-select
              v-bind:items="Categories"
              v-model="Category"
              label="Category"
              dark
              single-line
              auto
              required
              v-on:input="getStyles"
            ></v-select>
          </v-flex>
          <v-flex xs6>
            <v-select
              v-bind:items="CategoryStyles"
              v-model="CategoryStyle"
              label="Style"
              dark
              single-line
              auto
              required
            ></v-select>
          </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs8>
        <v-select v-bind:items="Rounds" v-model="Round" label="Choose a round" hint="Choose a Round" persistent-hint dark single-line auto required></v-select>
    </v-flex>
    </v-layout>
    <v-alert error dismissible v-model="error">
        Error deleting this performance, you cannot delete a performance that has already been scored!
    </v-alert>
   <v-card-title>
      Performances
      <v-spacer></v-spacer>
      <v-btn light large style="margin: auto; margin-left: 40px" class="purple" v-on:click.native="add">Add new performance</v-btn>
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
          <v-btn floating v-tooltip:top="{ html: 'Delete Transaction' }" small v-on:click.native="del(props.item.PerformanceID)" class="purple">
          <v-icon light>delete</v-icon>
          </v-btn>
        </td>
        <td class="text-xs-right">{{ props.item.PerformanceRound.Description }}</td>
        <td class="text-xs-right">{{ props.item.Contestant.GroupAttributes.GroupDescription}}</td>
        <td class="text-xs-right">{{ props.item.Style.CategoryDescription }}</td>
        <td class="text-xs-right">{{ props.item.Style.StyleDescription }}</td>
        <td class="text-xs-right">{{ props.item.Style.StyleCode }}</td>
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
        CountryName: "",
        CountryFlagPath: "",
        search: '',
        error: false,
        Paid: null,
        Category: null,
        Balance: null,
        ContestantInformation: null,
        ContestantKey: this.$store.state.manageContestant.ContestantKey,
        Type: null,
        Amount: null,
        BillingAdd1: null,
        BillingAdd2: null,
        Name: null,
        StateProv: null,
        PostalCode: null,
        Country: null,
        PhoneNumber: null,
        Categories: [],
        CategoryStyles: [],
        Category: null,
        CategoryStyle: null,
        Rounds: null,
        Round: null,
        transactionTypes: [{text: "cc"}, {text: "check"}, {text: "cash"}, {text: "transfer"}, {text: "scholarship"}],
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
            value: 'PerformanceRound.Description'
          },
          {
            text: 'Group Type',
            right: true,
            sortable: true,
            value: 'Contestant.GroupAttributes.GroupDescription'
          },
          {
            text: 'Category',
            right: true,
            sortable: true,
            value: 'Style.CategoryDescription'
          },
          {
            text: 'Style',
            right: true,
            sortable: true,
            value: 'Style.StyleDescription'
          },
          {
            text: 'Style Code',
            right: true,
            sortable: true,
            value: 'Style.StyleCode'
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
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/get/getContestant', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID, ContestantKey: this.$store.state.manageContestant.ContestantKey}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
            component.Paid = body.MembershipStatus.TotalPaid;
            component.Balance = body.MembershipStatus.RemainingBalance;
            component.ContestantInformation = body;
          }
      });
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/get/getContestantPerformances', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID, ContestantKey: this.$store.state.manageContestant.ContestantKey}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
            component.items = body;
          }
      });
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/get/getCategories', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
            let categories = [];
            for (let i=0; i < body.length; i++){
              categories.push({
                CategoryID: body[i].CategoryID,
                CategoryDescription: body[i].CategoryDescription,
                StageSetupTime: body[i].StageSetupTime,
                text: body[i].CategoryDescription
              });
            }
            component.Categories = categories;
          }
      });
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/get/getRounds', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
              let newRounds = [];
              for (let i=0; i < body.length; i++){
                  newRounds.push({
                      RoundID: body[i].RoundID,
                      RoomDescription: body[i].RoundDescription,
                      text: body[i].RoundDescription
                  })
              }
              //console.log(newRounds);
              component.Rounds = newRounds;
              //console.log(component.Rounds);
          }
      });
    },
    getStyles(){
          //console.log("Getting Styles");
          //console.log(this.Category.CategoryID);
          let component = this;
          request.post({json: {token: this.$store.state.token, CategoryID: this.Category.CategoryID, EventID: this.$store.state.eventData.EventID}, url: "http://"+this.$store.state.serverIP+'/get/getCategoryStyles', method: "POST"}, function (err, httpResponse, body){
            if (httpResponse.statusCode == 200){
              let styles = [];
              //console.log(body);
              //console.log(body.length);
              for (let i=0; i < body.length; i++){
                //console.log("iterating");
                styles.push({
                  StyleID: body[i].StyleID,
                  StyleCode: body[i].StyleCode,
                  StyleDescription: body[i].StyleDescription,
                  text: body[i].StyleDescription,
                  CategoryID: body[i].CategoryID
                });
              }
              component.CategoryStyles = styles;
              //console.log(styles);
            }
        })
    },
    add (){
        let component = this;
        //console.log(this.ContestantInformation.ContestantKey);
        request.post({json: {token: this.$store.state.token, 
          AgeID: this.ContestantInformation.Age.AgeID,
          GenderID: this.ContestantInformation.Gender.GenderID,
          GroupID: this.ContestantInformation.GroupAttributes.GroupID,
          StyleID: this.CategoryStyle.StyleID, 
          ContestantKey: this.ContestantInformation.ContestantKey,
          RoundID: this.Round.RoundID,
          EventID: this.$store.state.eventData.EventID}, url: "http://"+this.$store.state.serverIP+'/post/newPerformance', method: "POST"}, function (err, httpResponse, body){
            if (httpResponse.statusCode == 200){
              component.fetchData();
            }
        })
      //this.$router.push({path: "/manageContestants/newContestant"});
    },
    openContestant(contestantKey){
      //console.log(countryID);
      this.$store.commit("setCurrentContestant", contestantKey);
      //console.log(this.$store.state.manageCountry);
      this.$router.push({path: '/manageContestants/editContestant'});

    },
    del(PerformanceID){
        let component = this;
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/delete/performance', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID, PerformanceID: PerformanceID}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
            component.fetchData();
          }
          else if (httpResponse.statusCode == 409){
            component.error = true;
          }
      });
    },
    back(){
      this.$router.push({path: '/manageContestants'});
    }
    }
  }
</script>

<style>

</style>
