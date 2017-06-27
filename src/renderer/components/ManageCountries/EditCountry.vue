<template>
<main>
    <h3>Edit country</h3>
     <v-card class="grey lighten-4 elevation-0">
      <v-card-text>
        <v-container fluid>
            <v-flex xs8>
                <v-text-field
                name="input-1"
                label="Country Name"
                id="testing"
                v-model="CountryName"
                ></v-text-field>
            </v-flex>
            <v-flex xs8>
            <v-text-field
                name="input-2"
                label="Country Flag Image Path/ISO Abbreviation"
                id="testing2"
                v-model="CountryFlagPath"
                ></v-text-field>
            </v-flex>
            <v-card-title>
            Directors
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
            v-bind:items="Directors"
            v-bind:search="search"
            default-sort="Checked:desc"
            :rows-per-page-items="paginationNum"
            :pagination.sync="pagination"
        >
            <template slot="items" scope="props">
            <td><v-checkbox v-model="props.item.Checked" dark></v-checkbox></td>
            <td class="text-xs-right">{{ props.item.FirstName }}</td>
            <td class="text-xs-right">{{ props.item.LastName }}</td>
            <td class="text-xs-right">{{ props.item.EmailAddress }}</td>
            <td class="text-xs-right">{{ props.item.PhoneNumber }}</td>

            </template>
            <template slot="pageText" scope="{ pageStart, pageStop }">
                From {{ pageStart }} to {{ pageStop }}
            </template>
            </v-data-table>
        </v-container>
      </v-card-text>
     </v-card>
     <br>
     <v-layout row wrap>
    <v-btn light large style="margin: auto; margin-right: 40px;" class="purple" v-on:click.native="cancel">Cancel</v-btn>
    <v-btn light large style="margin: auto; margin-left: 0px" class="purple" v-on:click.native="save">Save</v-btn>
     </v-layout>
</main>

</template>

<script>
import request from 'request';
 export default {
    name: 'editCountry',
    components: {},
    methods: {
        cancel (){
            this.$router.push({path: '/manageCountries'});
        },
        save (){
            let directorArray = [];
            let component = this;
            for (let i=0; i < this.Directors.length; i++){
                if (this.Directors[i].Checked == true){
                    directorArray.push(this.Directors[i].UserID);
                }
            }
            //console.log(this.UpdatedCountryName);
            request.post({url:'http://'+this.$store.state.serverIP+'/post/country', form: {token: this.$store.state.token, NewCountry: false, EventID: this.$store.state.eventData.EventID, CountryID: this.$store.state.manageCountry, CountryName: this.CountryName, CountryFlagPath: this.CountryFlagPath, Directors: JSON.stringify(directorArray)}}, function(err,httpResponse,body){
                if(httpResponse.statusCode == 200){
                    component.$router.push({path: '/manageCountries'});
                }
            })
        }
    },
    data(){
        return{
            CountryName: 'abc',
            CountryFlagPath: '',
            Directors: null,
            UpdatedCountryName: '',
            UpdatedCountryFlagPath: '',
            search: '',
            pagination: {page:1, rowsPerPage: 20},
            paginationNum: [10, 20, 50],
            headers: [
            {
            name: 'Checked',
            text: 'Director of country',
            right: true,
            sortable: true,
            value: 'Checked'
            },
            {
                name: 'fname',
                text: 'First Name',
                right: true,
                sortable: true,
                value: 'FirstName'
            },
            {
                name: 'lname',
                text: 'Last Name',
                right: true,
                sortable: true,
                value: 'LastName'
            },
            {
                text: 'Email Address',
                sortable: true,
                name: 'emailaddress',
                right: true,
                value: 'EmailAddress'
            },
            {
                text: 'Phone Number',
                name: 'phonenumber',
                sortable: false,
                right: true,
                value: 'PhoneNumber'
            }
            ],
            items: []
        }
    },
    created (){
        let component = this;
        request.post({url:'http://'+this.$store.state.serverIP+'/get/getCountry', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID, CountryID: this.$store.state.manageCountry}}, function(err,httpResponse,body){
            let parsedBody = JSON.parse(body);
            //console.log(body[0].CountryName);
            //console.log(parsedBody.CountryName);
            component.CountryName = parsedBody.CountryName;
            component.CountryFlagPath = parsedBody.CountryFlagPath;
            console.log(component.CountryName);
          })
          request.post({url:'http://'+this.$store.state.serverIP+'/get/getCountryDirectors', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID, CountryID: this.$store.state.manageCountry}}, function(err,httpResponse,body){
              let editBody = JSON.parse(body);
              editBody.sort(function(a, b) {
                var nameA = a.Checked;
                var nameB = b.Checked;
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                // names must be equal
                return 0;
            });
            //editBody.reverse();
            component.Directors = JSON.parse(body);
            //console.log(editBody);
              //console.log(body);
          })
    }
 }
</script>

<style>
</style>