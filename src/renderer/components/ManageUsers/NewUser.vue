<template>
    <main>
        <h3>New Application User: </h3>
        <v-card class="grey lighten-4 elevation-0">
            <v-card-text>
                <v-container fluid>
                    <v-flex xs8>
                        <v-text-field name="input-1" label="Email Address" id="testing" v-model="EmailAddress" required></v-text-field>
                    </v-flex>
                    <v-flex xs8>
                        <v-text-field name="input-1" label="Default Password" id="testing" v-model="Password" disabled required></v-text-field>
                    </v-flex>
                    <v-flex xs8>
                        <v-text-field name="input-1" label="First Name" id="testing" v-model="FirstName" required></v-text-field>
                    </v-flex>
                    <v-flex xs8>
                        <v-text-field name="input-2" label="Middle Name" id="testing2" v-model="MiddleName"></v-text-field>
                    </v-flex>
                    <v-flex xs8>
                        <v-text-field name="input-2" label="Last Name" id="testing2" v-model="LastName" required></v-text-field>
                    </v-flex>
                    <v-flex xs8>
                        <v-text-field name="input-2" label="Phone Number" id="testing2" v-model="PhoneNumber"></v-text-field>
                    </v-flex>
                    <v-flex xs6>
                        <v-select v-bind:items="Privelages" v-model="Level" label="User Role" hint="Choose a user role privelage" persistent-hint dark single-line auto required></v-select>
                    </v-flex>
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
    import guid from 'guid';
    import moment from 'moment-es6';
    export default {
        data (){
            return {
                UserID: guid.create().value,
                EmailAddress: null,
                Password: "wcopa" + new Date().getFullYear(),
                FirstName: null,
                LastName: null,
                MiddleName: null,
                PhoneNumber: null,
                Level: null,
                Privelages: []
            }
        },
        methods: {
            fetchData(){
                    let component = this;
                     request.post({json: true, url: "http://"+this.$store.state.serverIP+'/get/getPrivelages', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID}}, function (err, httpResponse, body){
                         if (httpResponse.statusCode == 200){
                             let privelages = [];
                             for (let i=0; i < body.length; i++){
                                 privelages.push({
                                     LevelID: body[i].LevelID,
                                     Description: body[i].Description,
                                     text: body[i].Description
                                 })
                             }
                             component.Privelages = privelages;
                         }
                     })
            },
            cancel (){
                this.$router.push({path: '/manageUsers'});
            },
            save (){
                let component = this;
                let UserData = {
                    UserID: this.UserID,
                    EmailAddress: this.EmailAddress,
                    Password: this.Password,
                    FirstName: this.FirstName,
                    LastName: this.LastName,
                    MiddleName: this.MiddleName,
                    PhoneNumber: this.PhoneNumber,
                    Role: this.Level.Description,
                    LevelID: this.Level.LevelID
                }
                //console.log(UserData);
                request.post({json: {token: this.$store.state.token, UserData: UserData}, url: "http://"+this.$store.state.serverIP+'/post/newUser', method: "POST"}, function (err, httpResponse, body){
                    if (httpResponse.statusCode == 200){
                        //console.log(newGenders);
                        if (body != "DUPLICATE"){
                            component.$router.push({path: '/manageUsers'});
                        }
                    }
            })
            }
        },
        created () {
            this.fetchData();
        }
    }
</script>

<style>

</style>