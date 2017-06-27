<template>
<main>
  <v-app>
    <v-layout row>
    <v-flex xs12>
      <v-btn light large style="margin: auto; margin-left: 40px" class="purple" v-on:click.native="back">Back to Contestants</v-btn>
    </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs6>
      <h3 style="font-size: 30px">Remaining Balance: ${{ Balance }}</h3>
      </v-flex>
      <v-flex xs6>
      <h3 style="font-size: 30px">Paid: ${{ Paid }}</h3>
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
      <v-flex xs8>
          <v-text-field name="input-1" label="$ Amount USD" id="testing" v-model="Amount" required></v-text-field>
      </v-flex>
          <v-flex xs6>
            <v-select
              v-bind:items="transactionTypes"
              v-model="Type"
              label="Transaction Type"
              dark
              single-line
              auto
              required
            ></v-select>
          </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs8>
          <v-text-field name="input-1" label="Name" id="testing" v-model="Name" required></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs8>
          <v-text-field name="input-1" label="Billing Address 1" id="testing" v-model="BillingAdd1"></v-text-field>
      </v-flex>
      <v-flex xs8>
          <v-text-field name="input-1" label="Billing Address 2" id="testing" v-model="BillingAdd2"></v-text-field>
      </v-flex>
      <v-flex xs8>
          <v-text-field name="input-1" label="State or Providence" id="testing" v-model="StateProv"></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs8>
          <v-text-field name="input-1" label="PostalCode" id="testing" v-model="PostalCode"></v-text-field>
      </v-flex>
      <v-flex xs8>
          <v-text-field name="input-1" label="Country" id="testing" v-model="Country"></v-text-field>
      </v-flex>
      <v-flex xs8>
          <v-text-field name="input-1" label="Phone Number" id="testing" v-model="PhoneNumber"></v-text-field>
      </v-flex>
    </v-layout>
   <v-card-title>
      Payment Transactions
      <v-spacer></v-spacer>
      <v-btn light large style="margin: auto; margin-left: 40px" class="purple" v-on:click.native="add">Create new transaction</v-btn>
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
          <v-btn floating v-tooltip:top="{ html: 'Delete Transaction' }" small v-on:click.native="del(props.item.Trans_ID)" class="purple">
          <v-icon light>delete</v-icon>
          </v-btn>
        </td>
        <td class="text-xs-right">${{ props.item.Amount }}</td>
        <td class="text-xs-right">{{ props.item.Date }}</td>
        <td class="text-xs-right">{{ props.item.PaymentType }}</td>
        <td class="text-xs-right">{{ props.item.Name }}</td>
        <td class="text-xs-right">{{ props.item.PhoneNumber }}</td>
        <td class="text-xs-right">{{ props.item.Country }}</td>
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
        Paid: null,
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
            text: 'Payment Amt',
            right: true,
            sortable: true,
            value: 'Amount'
          },
          {
            text: 'Transaction Date/Time',
            right: true,
            sortable: true,
            value: 'Date'
          },
          {
            text: 'Type',
            right: true,
            sortable: true,
            value: 'PaymentType'
          },
          {
            text: 'Name',
            right: true,
            sortable: true,
            value: 'Name'
          },
          {
            text: 'Phone Number',
            right: true,
            sortable: true,
            value: 'PhoneNumber'
          },
          {
            text: 'Country',
            right: true,
            sortable: true,
            value: 'Country'
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
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/get/getContestantPayments', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID, ContestantKey: this.$store.state.manageContestant.ContestantKey}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
            component.items = body;
          }
      });
    },
    add (){
        let component = this;
        let TransactionData = {
          ContestantKey: this.ContestantInformation.ContestantKey,
          Type: this.Type.text,
          Amount: this.Amount,
          BillingAdd1: this.BillingAdd1,
          BillingAdd2: this.BillingAdd2,
          Name: this.Name,
          StateProv: this.StateProv,
          PostalCode: this.PostalCode,
          Country: this.Country,
          PhoneNumber: this.PhoneNumber
        };

        request.post({json: {token: this.$store.state.token, TransactionData: TransactionData, EventID: this.$store.state.eventData.EventID}, url: "http://"+this.$store.state.serverIP+'/post/ContestantPaymentTransaction', method: "POST"}, function (err, httpResponse, body){
            if (httpResponse.statusCode == 200){
              component.Amount = null;
              component.BillingAdd1 = null;
              component.BillingAdd2 = null;
              component.Name = null;
              component.StateProv = null;
              component.PostalCode = null;
              component.Country = null;
              component.PhoneNumber = null;
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
    del(Trans_ID){
        let component = this;
        request.post({json: true, url: "http://"+this.$store.state.serverIP+'/delete/ContestantPaymentTransaction', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID, Trans_ID: Trans_ID}}, function (err, httpResponse, body){
          if (httpResponse.statusCode == 200){
            component.fetchData();
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
