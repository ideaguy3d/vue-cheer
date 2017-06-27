<template>
    <main>
        <h3>Edit Age Bracket: </h3>
        <v-card class="grey lighten-4 elevation-0">
            <v-card-text>
                <v-container fluid>
                    <v-flex xs8>
                        <v-text-field name="input-9" label="Age Bracket Description" id="testing" v-model="AgeDescription" required></v-text-field>
                    </v-flex>
                    <v-flex xs4>
                        <v-text-field name="input-1" label="Minimum Age" id="testing" type="number" v-model="MinAge" required></v-text-field>
                    </v-flex>
                    <v-flex xs4>
                        <v-text-field name="input-1" label="Maximum Age" id="testing" type="number" v-model="MaxAge" required></v-text-field>
                    </v-flex>
                    <v-card-text>
                        <v-checkbox label="Preliminary Bracket" v-model="PrelimAge" dark></v-checkbox>
                    </v-card-text>
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
                AgeDescription: "",
                MinAge: null,
                MaxAge: null,
                AgeID: guid.create().value,
                RoomLocation: "",
                RoomID: guid.create().value,
                Rooms: [],
                thisRoom: null,
                Transits: [],
                PrelimAge: false
            }
        },
        methods: {
            fetchData(){
                let component = this;
                 request.post({json: true, url: "http://"+this.$store.state.serverIP+'/get/getRooms', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID}}, function (err, httpResponse, body){
                     if (httpResponse.statusCode == 200){
                         component.Rooms = body;

                         for (var i=0; i < component.Rooms.length; i++){
                             let Time = null;
                            try{
                                component.Transits.push({
                                    RoomID:    component.Rooms[i].RoomID,
                                    RoomName: component.Rooms[i].RoomName,
                                    RoomLocation:  component.Rooms[i].RoomLocation,
                                    Time: Time
                                })
                            }
                            catch(e){
                                    component.Transits.push({
                                    RoomName: component.Rooms[i].RoomName,
                                    RoomID:    component.Rooms[i].RoomID,
                                    RoomLocation:  component.Rooms[i].RoomLocation,
                                    Time: null
                                })
                            }
                         }
                         //console.log(component.Transits);
                     }
                 });

            },
            cancel (){
                this.$router.push({path: "/manageAgeBrackets"});
            },
            save (){
                let component = this;
                //console.log(this.Transits);
                 request.post({json: {token: this.$store.state.token, AgeData: {
                     AgeID: component.AgeID,
                     MinAge: component.MinAge,
                     MaxAge: component.MaxAge,
                     Description: component.AgeDescription,
                     PrelimAge: component.PrelimAge
                 }, EventID: this.$store.state.eventData.EventID}, url: "http://"+this.$store.state.serverIP+'/post/ageClass', method: "POST"}, function (err, httpResponse, body){
                     if (httpResponse.statusCode == 200){
                         component.$router.push({path: "/manageAgeBrackets"});
                     }
                 })
            }
        },
        created () {
            this.AgeID = this.$store.state.manageAgeBracket.AgeID;
            this.MinAge = this.$store.state.manageAgeBracket.MinAge;
            this.MaxAge = this.$store.state.manageAgeBracket.MaxAge;
            this.AgeDescription = this.$store.state.manageAgeBracket.Description;
            this.PrelimAge = this.$store.state.manageAgeBracket.PrelimAge;
            //console.log(this.$store.state.manageAgeBracket.Description);
            //this.fetchData();
        }
    }
</script>

<style>

</style>