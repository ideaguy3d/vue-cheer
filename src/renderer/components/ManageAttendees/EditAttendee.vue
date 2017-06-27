<template>
    <main>
        <h3>Edit Attendee: </h3>
        <v-card class="grey lighten-4 elevation-0">
            <v-card-text>
                <v-container fluid>
                    <v-flex xs8>
                        <v-text-field name="input-1" label="Name" id="testing" v-model="Name"></v-text-field>
                    </v-flex>
                    <v-flex xs8>
                        <v-text-field multi-line name="input-1" label="Attendee Information" id="testing" v-model="Info"></v-text-field>
                    </v-flex>
                    <v-layout row wrap>
                        <v-flex xs6>
                            <v-select v-bind:items="Countries" v-model="Country" label="Country" hint="Choose a Country" persistent-hint dark single-line auto></v-select>
                        </v-flex>
                        <v-flex xs6>
                            <v-select v-bind:items="AttendeeTypes" v-model="AttendeeType" label="Attendee Type" hint="Choose an attendee type" persistent-hint dark single-line auto></v-select>
                        </v-flex>
                    </v-layout>
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
                Attendee: this.$store.state.manageAttendee,
                AttendeeType: null,
                AttendeeTypes: [],
                Country: null,
                Info: null,
                EventID: this.$store.state.eventData.EventID,
                Countries: [],
                Name: this.$store.state.manageAttendee.Name,
                Info: this.$store.state.manageAttendee.Info
            }
        },
        methods: {
            fetchData(){
                let component = this;
                request.post({json: true, url: "http://"+this.$store.state.serverIP+'/get/getCountries', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID}}, function (err, httpResponse, body){
                let countryData = [];
                for (let i=0; i < body.length; i++){
                    let directors = "";
                    for (let x=0; x < body[i].Directors.length; x++){
                    if (x == body[i].Directors.length -1){
                        //directors += "[" + body[i].Directors[x].FirstName + " " + body[i].Directors[x].LastName + " Email Address: " +  body[i].Directors[x].EmailAddress + " Phone Number: " + body[i].Directors[x].PhoneNumber + "]"
                        directors += body[i].Directors[x].FirstName + " " + body[i].Directors[x].LastName;
                    }
                    else{
                        //directors += "[" + body[i].Directors[x].FirstName + " " + body[i].Directors[x].LastName + " Email Address: " +  body[i].Directors[x].EmailAddress + " Phone Number: " + body[i].Directors[x].PhoneNumber + "], "
                        directors += body[i].Directors[x].FirstName + " " + body[i].Directors[x].LastName + ", ";
                    }
                    }
                    if (body[i].Directors.length == 0){
                    directors = "None";
                    }
                    countryData.push({
                    CountryID: body[i].CountryID,
                    CountryFlagPath: body[i].CountryFlagPath,
                    CountryName: body[i].CountryName,
                    Directors: directors,
                    text: body[i].CountryName
                })
                countryData.sort(function(a, b){
                    var nameA=a.text.toLowerCase(), nameB=b.text.toLowerCase()
                    if (nameA < nameB) //sort string ascending
                        return -1 
                    if (nameA > nameB)
                        return 1
                    return 0 //default return value (no sorting)
                })
            }
                component.Countries = countryData;

                for (let i = 0; i < component.Countries.length; i++){
                    //console.log (component.Countries[i]);
                        if (component.Countries[i].CountryID == component.Attendee.CountryID){
                            //console.log("Found Coutnry");
                            component.Country = component.Countries[i];
                        }
                    }
            });
            request.post({json: true, url: "http://"+this.$store.state.serverIP+'/get/getAttendeeTypes', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID}}, function (err, httpResponse, body){
                if (httpResponse.statusCode == 200){
                    //console.log(newGenders);
                    let AttendeeTypes = [];
                    for (let i=0; i < body.length; i++){
                        AttendeeTypes.push({
                            TypeID: body[i].TypeID,
                            EventID: body[i].EventID,
                            Description: body[i].Description,
                            text: body[i].Description,
                            Fee: body[i].Fee,
                            Msg: body[i].Msg,
                            AllowScout: body[i].AllowScout,
                            AllowFree: body[i].AllowFree
                        })
                    }
                    //console.log(AttendeeTypes);
                    component.AttendeeTypes = AttendeeTypes;
                    for (let i=0; i < component.AttendeeTypes.length; i++){
                        if (component.AttendeeTypes[i].TypeID == component.Attendee.AttendeeTypeID){
                            component.AttendeeType = component.AttendeeTypes[i];
                        }
                    }
                    //console.log(component.AttendeeTypes);
                }
            });

            },
            cancel (){
            let component = this;
            this.$router.push({path: "/manageAttendees"});
            // request.post({json: true, url: "http://"+this.$store.state.serverIP+'/post/destroyReservedContestantID', form: {token: this.$store.state.token, ContestantKey: this.ContestantKey}}, function (err, httpResponse, body){
            //     if (httpResponse.statusCode == 200){
            //         //console.log(newGenders);
            //         component.$router.push({path: '/manageContestants'});
            //     }
            // })
            },
            save (){
                let component = this;
                let data = {                    Name: this.Name,
                    CountryID: this.Country.CountryID,
                    Fee: this.AttendeeType.Fee,
                    AttendeeTypeID: this.AttendeeType.TypeID,
                    AttendeeID: this.Attendee.AttendeeID,
                    Info: this.Info};
                //console.log(data);
                request.post({json: {token: this.$store.state.token, AttendeeData: {
                    Name: this.Name,
                    CountryID: this.Country.CountryID,
                    Fee: this.AttendeeType.Fee,
                    AttendeeTypeID: this.AttendeeType.TypeID,
                    AttendeeID: this.Attendee.AttendeeID,
                    Info: this.Info
                }, EventID: this.$store.state.eventData.EventID}, url: "http://"+this.$store.state.serverIP+'/post/attendee', method: "POST"}, function (err, httpResponse, body){
                    if (httpResponse.statusCode == 200){
                        //console.log(newGenders);
                        component.$router.push({path: '/manageAttendees'});
                    }
            })
            }
        },
        created () {
            //console.log(this.Attendee);
            this.fetchData();
        }
    }
</script>

<style>

</style>