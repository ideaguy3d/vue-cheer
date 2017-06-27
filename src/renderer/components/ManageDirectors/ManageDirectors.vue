<template>
    <main>
        <v-app>
            <!--<v-layout row wrap>
                <v-flex xs5>
                <v-text-field
                name="input-1"
                label="Country Name"
                id="testing"
                v-model="CountryName"
                ></v-text-field>
            </v-flex>
            <v-flex xs6>
            <v-text-field
                name="input-2"
                label="Country Flag Image Path/ISO Abbreviation"
                id="testing2"
                v-model="CountryFlagPath"
                ></v-text-field>
            </v-flex>
            <v-btn light floating small style="margin: auto; margin-left: 0px" class="purple" v-on:click.native="add"><v-icon light>add</v-icon></v-btn>
            </v-layout>-->
            <v-card-title>
                National Directors
                <v-spacer></v-spacer>
                <v-btn light large style="margin: auto; margin-left: 40px" class="purple" v-on:click.native="add">
                    Create new Director
                </v-btn>
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
                        <v-btn floating small v-on:click.native="openContestant(props.item.ContestantKey)"
                               class="purple">
                            <v-icon light>edit</v-icon>
                        </v-btn>
                        <v-btn floating small v-on:click.native="openRoom(props.item.RoomID)" class="purple">
                            <v-icon light>delete</v-icon>
                        </v-btn>
                    </td>
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
                pagination: {page: 1, rowsPerPage: 20},
                paginationNum: [10, 20, 50, 100, 200],
                headers: [
                    {
                        text: 'Action',
                        right: true,
                        sortable: false,
                        value: 'Action'
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
            //console.log(this.$store.state.eventData.EventID);
            this.fetchData();
        },
        methods: {
            fetchData(){
                let component = this;
                request.post({
                    json: true,
                    url: "http://" + this.$store.state.serverIP + '/get/getDirectors',
                    form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID}
                }, function (err, httpResponse, body) {
                    if (httpResponse.statusCode == 200) {
                        component.items = body;
                        component.notLoaded = false;
                    }
                });
            },
            add (){
                this.$router.push({path: "/manageContestants/newContestant"});
            },
            openContestant(contestantKey){
                //console.log(countryID);
                this.$store.commit("setCurrentContestant", contestantKey);
                //console.log(this.$store.state.manageCountry);
                this.$router.push({path: '/manageContestants/editContestant'});

            }
        }
    }
</script>

<style>

</style>
