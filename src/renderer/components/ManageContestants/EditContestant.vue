<template>
    <main>
        <h3>Edit Contestant: </h3>
        <v-card class="grey lighten-4 elevation-0">
            <v-card-text>
                <v-container fluid>
                    <v-flex xs8>
                        <v-text-field name="input-1" label="Contestant ID" id="testing" v-model="ContestantID"></v-text-field>
                    </v-flex>
                    <v-flex xs8>
                        <v-text-field name="input-1" label="Name of Entry" id="testing" v-model="NameOfEntry"></v-text-field>
                    </v-flex>
                    <v-flex xs8>
                        <v-text-field name="input-1" label="First Name" id="testing" v-model="FirstName"></v-text-field>
                    </v-flex>
                    <v-flex xs8>
                        <v-text-field name="input-2" label="Middle Name" id="testing2" v-model="MiddleName"></v-text-field>
                    </v-flex>
                    <v-flex xs8>
                        <v-text-field name="input-2" label="Last Name" id="testing2" v-model="LastName"></v-text-field>
                    </v-flex>
                    <v-layout row wrap>
                        <v-flex xs2>
                            <v-dialog persistent v-model="modal" lazy>
                                <v-text-field slot="activator" label="Date of Birth" v-model="DOB" prepend-icon="event" readonly></v-text-field>
                                <v-date-picker v-model="DOB" scrollable>
                                    <template scope="{ save, cancel }">
                                        <v-card-row actions>
                                            <v-btn flat primary @click.native="cancel()">Cancel</v-btn>
                                            <v-btn flat primary @click.native="save()">Save</v-btn>
                                        </v-card-row>
                                    </template>
                                </v-date-picker>
                            </v-dialog>
                        </v-flex>
                        <v-flex xs2>
                            <v-select v-bind:items="Levels" v-model="Level" label="Contestant Level" hint="Choose a Contestant Level" persistent-hint dark single-line auto></v-select>
                        </v-flex>
                        <v-flex xs2>
                            <v-select v-bind:items="Genders" v-model="Gender" label="Gender" hint="Choose a Gender" persistent-hint dark single-line auto></v-select>
                        </v-flex>
                        <v-flex xs2>
                            <v-select v-bind:items="GroupAttributes" v-model="GroupAttr" label="Contestant Attribute" hint="Choose a Contestant Attribute" persistent-hint dark single-line auto></v-select>
                        </v-flex>
                        <v-flex xs1>
                            <v-switch v-bind:label="`Group`" v-model="IsGroup" dark></v-switch>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs6>
                            <v-select v-bind:items="Countries" v-model="ResidentCountry" label="Resident Country" hint="Choose a Resident Country" persistent-hint dark single-line auto></v-select>
                        </v-flex>
                        <v-flex xs6>
                            <v-select v-bind:items="Countries" v-model="CompetitionCountry" label="Competition Country" hint="Choose a Competition Country" persistent-hint dark single-line auto></v-select>
                        </v-flex>
                        <v-flex xs8>
                            <v-text-field name="input-2" label="Phone Number" id="testing2" v-model="PhoneNumber"></v-text-field>
                        </v-flex>
                        <v-flex xs8>
                            <v-text-field name="input-2" label="Alternate Phone Number" id="testing2" v-model="AlternatePhone"></v-text-field>
                        </v-flex>
                        <v-flex xs8>
                            <v-text-field name="input-2" label="Language" id="testing2" v-model="Language"></v-text-field>
                        </v-flex>
                        <v-flex xs8>
                            <v-text-field name="input-2" label="Passport Number" id="testing2" v-model="PassportNumber"></v-text-field>
                        </v-flex>
                        <v-flex xs8>
                            <v-text-field name="input-2" label="Email Address" id="testing2" v-model="EmailAddress"></v-text-field>
                        </v-flex>
                        <v-flex xs8>
                            <v-text-field name="input-2" label="Website" id="testing2" v-model="Website"></v-text-field>
                        </v-flex>
                        <v-flex xs8>
                            <v-text-field name="input-2" label="Address Line 1" id="testing2" v-model="Add1"></v-text-field>
                        </v-flex>
                        <v-flex xs8>
                            <v-text-field name="input-2" label="Address Line 2" id="testing2" v-model="Add2"></v-text-field>
                        </v-flex>
                        <v-flex xs8>
                            <v-text-field name="input-2" label="City" id="testing2" v-model="City"></v-text-field>
                        </v-flex>
                        <v-flex xs8>
                            <v-text-field name="input-2" label="State/Providence" id="testing2" v-model="State"></v-text-field>
                        </v-flex>
                        <v-flex xs8>
                            <v-text-field name="input-2" label="Postal Code" id="testing2" v-model="PostalCode"></v-text-field>
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
                ContestantKey: null,
                ContestantID: null,
                IndividualID: null,
                Level: null,
                Age: null,
                NameOfEntry: "",
                FirstName: "",
                MiddleName: "",
                LastName: "",
                DOB: "",
                Gender: "",
                IsGroup: false,
                ResidentCountry: "",
                CompetitionCountry: "",
                PhoneNumber: "",
                AlternatePhone: "",
                Language: "",
                PassportNumber: "",
                EmailAddress: "",
                Website: "",
                Add1: "",
                Add2: "",
                City: "",
                State: "",
                PostalCode: "",
                EventID: this.$store.state.eventData.EventID,
                GroupAttr: null,
                Countries: [],
                Genders: [],
                GroupAttributes: [],
                Levels: [{text: "J", LevelID: "J"}, {text: "S", LevelID: "S"}],
                ContestantInfo: null
            }
        },
        methods: {
            fetchData(){
                let component = this;
            // request.post({json: true, url: "http://"+this.$store.state.serverIP+'/get/getNewContestantID', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID}}, function (err, httpResponse, body){
            //     if (httpResponse.statusCode == 200){
            //         //console.log(newGenders);
            //         component.ContestantID = body.ContestantID;
            //         component.ContestantKey = body.ContestantKey;
            //     }
            // }),
            request.post({json: true, url: "http://"+this.$store.state.serverIP+"/get/getContestant", form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID, ContestantKey: this.$store.state.manageContestant}}, function (err, httpResponse, body){
                    //console.log(body);
                    component.ContestantInfo = body;
                    component.ContestantKey = body.ContestantKey;
                    component.ContestantID = body.ContestantID;
                    component.IndividualID = body.Individuals[0].IndividualID;
                    // for (let i = 0; i < component.Genders.length; i++){
                    //     if (component.Genders[i].GenderID == component.ContestantInfo.Gender.GenderID){
                    //         component.Gender = component.Genders[i];
                    //         //console.log(component.Gender);
                    //     }
                    // }
                    // //console.log
                    // for (let )
                    for (let i=0; i < component.Levels.length; i++){
                        if (component.Levels[i].LevelID == body.ContestantLevelID){
                            component.Level = component.Levels[i];
                        }
                    }
                    //console.log(body);
                    //component.Level = body.ContestantLevelID;
                    component.Age =  moment().diff(body.Individuals[0].DOB, 'years');
                    component.NameOfEntry = body.GroupName;
                    component.FirstName = body.Individuals[0].FirstName;
                    component.LastName = body.Individuals[0].LastName;
                    component.MiddleName = body.Individuals[0].MiddleName;
                    component.DOB = moment(body.Individuals[0].DOB).format('YYYY-MM-DD');
                    component.IsGroup = body.IsGroup;
                    //console.log(body.ResidentCountry.CountryID);
                    component.CompetitionCountry = {
                        text: body.CompetitionCountry.CountryName,
                        CountryID: body.CompetitionCountry.CountryID,
                        CountryFlagPath: body.CompetitionCountry.CountryFlagPath,
                        CountryName: body.CompetitionCountry.CountryName
                    };
                    component.PhoneNumber = body.ContestantInformation.PhoneNumber;
                    component.AlternatePhone = body.ContestantInformation.AltPhoneNumber;
                    component.Language = body.ContestantInformation.Language;
                    component.PassportNumber = body.ContestantInformation.PassportNumber;
                    component.EmailAddress = body.ContestantInformation.EmailAddress;
                    component.Website = body.ContestantInformation.Website;
                    component.Add1 = body.ContestantInformation.AddressLine1;
                    component.Add2 = body.ContestantInformation.AddressLine2;
                    component.City = body.ContestantInformation.City;
                    component.State = body.ContestantInformation.State;
                    component.PostalCode = body.ContestantInformation.PostalCode;
                    component.EventID =  component.$store.state.eventData.EventID;
                    component.GroupAttr = {
                        GroupID: body.GroupAttributes.GroupID,
                        MaxSize: body.GroupAttributes.MaxSize,
                        MinSize: body.GroupAttributes.MinSize,
                        GroupDescription: body.GroupAttributes.GroupDescription,
                        text: body.GroupAttributes.GroupDescription
                    }
                    request.post({json: true, url: "http://"+component.$store.state.serverIP+'/get/getGroupAttr', form: {token: component.$store.state.token, EventID: component.$store.state.eventData.EventID}}, function (err, httpResponse, body){
                        if (httpResponse.statusCode == 200){
                            let newGroupAttr = [];
                            for (let i=0; i < body.length; i++){
                                newGroupAttr.push({
                                    GroupDescription: body[i].GroupDescription,
                                    GroupAttrID: body[i].GroupAttrID,
                                    text: body[i].GroupDescription
                                })
                            }
                            //console.log(newGenders);
                            //console.log(newGroupAttr.length);
                            //console.log(component.ContestantInfo);
                            component.GroupAttributes = newGroupAttr;
                            //console.log(component.GroupAttributes);
                            //console.log(component.ContestantInfo);
                            for (let i = 0; i < component.GroupAttributes.length; i++){
                                if (component.GroupAttributes[i].GroupAttrID == component.ContestantInfo.GroupAttributes.GroupID){
                                    component.GroupAttr = component.GroupAttributes[i];
                                    //console.log(component.GroupAttr);
                                    //console.log(component.Gender);
                                }
                            }
                        }
                    })
                    request.post({json: true, url: "http://"+component.$store.state.serverIP+'/get/getGenders', form: {token: component.$store.state.token, EventID: component.$store.state.eventData.EventID}}, function (err, httpResponse, body){
                        if (httpResponse.statusCode == 200){
                            let newGenders = [];
                            for (let i=0; i < body.length; i++){
                                newGenders.push({
                                    GenderID: body[i].GenderID,
                                    GenderValue: body[i].GenderValue,
                                    text: body[i].GenderValue
                                })
                            }
                            //console.log(newGenders);
                            component.Genders = newGenders;
                            for (let i = 0; i < component.Genders.length; i++){
                                if (component.Genders[i].GenderID == component.ContestantInfo.Gender.GenderID){
                                    component.Gender = component.Genders[i];
                                    //console.log(component.Gender);
                                }
                            }
                        }
                    })
                    request.post({json: true, url: "http://"+component.$store.state.serverIP+'/get/getCountries', form: {token: component.$store.state.token, EventID: component.$store.state.eventData.EventID}}, function (err, httpResponse, body){
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
                                if (component.Countries[i].CountryID == component.ContestantInfo.ResidentCountry.CountryID){
                                    //console.log("Found Coutnry");
                                    component.ResidentCountry = component.Countries[i];
                                }
                            }

                        for (let i = 0; i < component.Countries.length; i++){
                                if (component.Countries[i].CountryID == component.ContestantInfo.ResidentCountry.CountryID){
                                    //console.log("Found Coutnry");
                                    component.CompetitionCountry = component.Countries[i];
                                }
                            }
                    });
            })

            },
            cancel (){
            let component = this;
            this.$router.push({path: "/manageContestants"});
            // request.post({json: true, url: "http://"+this.$store.state.serverIP+'/post/destroyReservedContestantID', form: {token: this.$store.state.token, ContestantKey: this.ContestantKey}}, function (err, httpResponse, body){
            //     if (httpResponse.statusCode == 200){
            //         //console.log(newGenders);
            //         component.$router.push({path: '/manageContestants'});
            //     }
            // })
            },
            save (){
                this.Age = moment().diff(this.DOB, 'years');
                console.log(this);
                let component = this;
                let ContestantData = {
                    ContestantKey: this.ContestantKey,
                    ContestantID: this.ContestantID,
                    IndividualID: this.IndividualID,
                    Level: this.Level,
                    Age: this.Age,
                    NameOfEntry: this.NameOfEntry,
                    FirstName: this.FirstName,
                    MiddleName: this.MiddleName,
                    LastName: this.LastName,
                    DOB: this.DOB,
                    Gender: this.Gender,
                    IsGroup: this.IsGroup,
                    ResidentCountry: this.ResidentCountry,
                    CompetitionCountry: this.CompetitionCountry,
                    PhoneNumber: this.PhoneNumber,
                    AlternatePhone: this.AlternatePhone,
                    Language: this.Language,
                    PassportNumber: this.PassportNumber,
                    EmailAddress: this.EmailAddress,
                    Website: this.Website,
                    Add1: this.Add1,
                    Add2: this.Add2,
                    City: this.City,
                    State: this.State,
                    PostalCode: this.PostalCode,
                    EventID: this.EventID,
                    GroupAttr: this.GroupAttr
                    }
                request.post({json: {token: this.$store.state.token, ContestantData: ContestantData}, url: "http://"+this.$store.state.serverIP+'/post/newContestant', method: "POST"}, function (err, httpResponse, body){
                    if (httpResponse.statusCode == 200){
                        //console.log(newGenders);
                        component.$router.push({path: '/manageContestants'});
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