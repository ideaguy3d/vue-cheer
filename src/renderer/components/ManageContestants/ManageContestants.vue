<template>
    <main>
        <v-app>
            <v-card-title>
                Events for this category:  {{catetegoryPassedIn}}
                <v-spacer></v-spacer>
                <v-btn light large style="margin: auto; margin-left: 40px" class="purple" v-on:click.native="add">
                    Create new contestant
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
                        <v-btn floating v-tooltip:top="{ html: 'View Transactions' }" small
                               v-on:click.native="openTransactions(props.item)" class="purple">
                            <v-icon light>attach_money</v-icon>
                        </v-btn>
                        <v-btn floating v-tooltip:top="{ html: 'View Peformances' }" small
                               v-on:click.native="openPerformances(props.item)" class="purple">
                            <v-icon light>list</v-icon>
                        </v-btn>
                    </td>
                    <td class="text-xs-right">${{ props.item.MembershipStatus.RemainingBalance }}</td>
                    <td class="text-xs-right">{{ props.item.ContestantLevelID }}</td>
                    <td class="text-xs-right">{{ props.item.ContestantID }}</td>
                    <td class="text-xs-right">{{ props.item.GroupName }}</td>
                    <td class="text-xs-right">{{ props.item.CompetitionCountry.CountryName }}</td>
                    <td class="text-xs-right">{{ props.item.Gender.GenderID }}</td>
                    <td class="text-xs-right">{{ props.item.Age.Description }}</td>
                    <td class="text-xs-right">{{ props.item.ContestantInformation.PhoneNumber }}</td>
                    <td class="text-xs-right">{{ props.item.ContestantInformation.EmailAddress }}</td>
                    <td class="text-xs-right">{{ props.item.ContestantInformation.Language }}</td>

                </template>
                <template slot="pageText" scope="{ pageStart, pageStop }">
                    From {{ pageStart }} to {{ pageStop }}
                </template>
            </v-data-table>
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
                catetegoryPassedIn: this.$store.state.specialIndex,
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
                        text: 'Remain Bal.',
                        right: true,
                        sortable: true,
                        value: 'MembershipStatus.RemainingBalance'
                    },
                    {
                        text: 'Contestant Level',
                        right: true,
                        sortable: true,
                        value: 'ContestantLevelID'
                    },
                    {
                        text: 'Contestant ID',
                        right: true,
                        sortable: true,
                        value: 'ContestantID'
                    },
                    {
                        text: 'Name of Entry',
                        right: true,
                        sortable: true,
                        value: 'GroupName'
                    },
                    {
                        text: 'Competition Country',
                        right: true,
                        sortable: true,
                        value: 'CompetitionCountry.CountryName'
                    },
                    {
                        text: 'Gender',
                        right: true,
                        sortable: true,
                        value: 'Gender.GenderID'
                    },
                    {
                        text: 'Age',
                        right: true,
                        sortable: true,
                        value: 'Age.Description'
                    },
                    {
                        text: 'Phone Number',
                        right: true,
                        sortable: true,
                        value: 'ContestantInformation.PhoneNumber'
                    },
                    {
                        text: 'Email Address',
                        right: true,
                        sortable: true,
                        value: 'ContestantInformation.EmailAddress'
                    },
                    {
                        text: 'Language',
                        right: true,
                        sortable: true,
                        value: 'ContestantInformation.Language'
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
                    url: "http://" + this.$store.state.serverIP + '/get/getContestants',
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

            },
            openTransactions(Contestant){
                this.$store.commit("setCurrentContestant", Contestant);
                this.$router.push({path: '/manageContestants/ContestantPayments'});
            },
            openPerformances(Contestant){
                this.$store.commit("setCurrentContestant", Contestant);
                this.$router.push({path: '/manageContestants/ContestantPerformances'});
            }
        }
    }
</script>

<style>

</style>
