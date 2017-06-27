<template>
    <main>
        <h3>Edit Room: </h3>
        <v-card class="grey lighten-4 elevation-0">
            <v-card-text>
                <v-container fluid>
                    <v-flex xs8>
                        <v-text-field name="input-1" label="Room Name" id="testing" v-model="RoomName" required></v-text-field>
                    </v-flex>
                        <v-flex xs8>
                            <v-text-field name="input-1" label="Room Location" id="testing" v-model="RoomLocation" required></v-text-field>
                        </v-flex>
                    </v-layout>
                    <p style="font-size: 25px">Transit Times (Walking Distance): </p>
                    <div v-for="TransitTime in Transits">
                        <v-layout row>
                        <v-flex xs4>
                            <v-subheader>Room: {{TransitTime.RoomName}} Location: {{TransitTime.RoomLocation}}</v-subheader>
                        </v-flex>
                        <v-flex xs8>
                            <v-text-field name="input-1" label="Time (Minutes)" id="testing" v-model="TransitTime.Time" type="number"></v-text-field>
                        </v-flex>
                        </v-layout>
                    </div>
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
                RoomName: "",
                RoomLocation: "",
                RoomID: "",
                Rooms: [],
                thisRoom: null,
                Transits: []
            }
        },
        methods: {
            fetchData(){
                let component = this;
                 request.post({json: true, url: "http://"+this.$store.state.serverIP+'/get/getRooms', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID}}, function (err, httpResponse, body){
                     if (httpResponse.statusCode == 200){
                         component.Rooms = body;
                         //console.log(component.Rooms);
                         for (let i=0; i < component.Rooms.length; i++){
                             if (component.Rooms[i].RoomID == component.RoomID){
                                 component.thisRoom = component.Rooms[i];
                             }
                         }

                         for (var i=0; i < component.Rooms.length; i++){
                             let Time = null;
                             for (let x=0; x < component.thisRoom.RoomTransitTimes.length; x++){
                                 if (component.thisRoom.RoomTransitTimes[x].DestinationRoomID == component.Rooms[i].RoomID){
                                     Time = component.thisRoom.RoomTransitTimes[x].Time;
                                 }
                             }
                            if (component.Rooms[i].RoomID != component.thisRoom.RoomID){
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
                         }
                         //console.log(component.Transits);
                     }
                 });

            },
            cancel (){
                this.$router.push({path: "/manageRooms"});
            },
            save (){
                let component = this;
                //console.log(this.Transits);
                 request.post({json: {token: this.$store.state.token, RoomData: {
                     RoomID: component.thisRoom.RoomID,
                     RoomName: component.RoomName,
                     RoomLocation: component.RoomLocation,
                     RoomTransitTimes: component.Transits
                 }, EventID: this.$store.state.eventData.EventID}, url: "http://"+this.$store.state.serverIP+'/post/room', method: "POST"}, function (err, httpResponse, body){
                     if (httpResponse.statusCode == 200){
                         component.$router.push({path: "/manageRooms"});
                     }
                 })
            }
        },
        created () {
            this.RoomName = this.$store.state.manageRoom.RoomName;
            this.RoomLocation = this.$store.state.manageRoom.RoomLocation;
            this.RoomID = this.$store.state.manageRoom.RoomID;
            this.fetchData();
        }
    }
</script>

<style>

</style>