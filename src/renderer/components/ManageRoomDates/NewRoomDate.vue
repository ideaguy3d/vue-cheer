<template>
    <main>
        <h3>New Room Time: </h3>
        <v-card class="grey lighten-4 elevation-0">
            <v-card-text>
                <v-container fluid>
                    <v-flex xs8>
                        <v-select v-bind:items="Rooms" v-model="Room" label="Choose a room" hint="Choose a Room" persistent-hint dark single-line auto required></v-select>
                    </v-flex>
                    <v-flex xs8>
                        <v-select v-bind:items="Rounds" v-model="Round" label="Choose a round" hint="Choose a Round" persistent-hint dark single-line auto required></v-select>
                    </v-flex>
                    <v-layout row>
                    <v-flex xs12 sm6>
                        <v-menu
                        lazy
                        :close-on-content-click="false"
                        v-model="menu"
                        transition="v-scale-transition"
                        offset-y
                        :nudge-left="40"
                        >
                        <v-text-field
                            slot="activator"
                            label="Date"
                            v-model="thisDate"
                            prepend-icon="event"
                            readonly
                            required
                        ></v-text-field>
                        <v-date-picker v-model="thisDate" no-title scrollable actions>
                            <template scope="{ save, cancel }">
                            <v-card-row actions>
                                <v-btn flat primary @click.native="cancel()">Cancel</v-btn>
                                <v-btn flat primary @click.native="save()">Save</v-btn>
                            </v-card-row>
                            </template>
                        </v-date-picker>
                        </v-menu>
                    </v-flex>
                    <v-flex xs4>
                        <v-menu
                        lazy
                        :close-on-content-click="false"
                        v-model="menu2"
                        transition="v-scale-transition"
                        offset-y
                        :nudge-left="40"
                        >
                        <v-text-field
                            slot="activator"
                            label="Start Time"
                            prepend-icon="access_time"
                            readonly
                            required
                            v-model="StartTime"
                        ></v-text-field>
                        <v-time-picker v-model="StartTime"></v-time-picker>
                        </v-menu>
                    </v-flex>
                    <v-flex xs4>
                        <v-menu
                        lazy
                        :close-on-content-click="false"
                        v-model="menu2"
                        transition="v-scale-transition"
                        offset-y
                        :nudge-left="40"
                        >
                        <v-text-field
                            slot="activator"
                            label="End Time"
                            prepend-icon="access_time"
                            readonly
                            required
                            v-model="EndTime"
                        ></v-text-field>
                        <v-time-picker v-model="EndTime"></v-time-picker>
                        </v-menu>
                    </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
        </v-card>
        <br>
        <v-alert error dismissible v-model="error">
        Error adding room time, please make sure you have filled out all fields and that Start Time occurs before End Time!
        </v-alert>
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
                RoomID: null,
                RoomDateID: guid.create().value,
                Rooms: [],
                thisRoom: null,
                Transits: [],
                Room: null,
                thisDate: null,
                StartTime: null,
                EndTime: null,
                error: false,
                Rounds: [],
                Round: null
            }
        },
        methods: {
            fetchData(){
                let component = this;
                 request.post({json: true, url: "http://"+this.$store.state.serverIP+'/get/getRooms', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID}}, function (err, httpResponse, body){
                     if (httpResponse.statusCode == 200){
                         let newRooms = [];
                         for (let i=0; i < body.length; i++){
                             newRooms.push({
                                 RoomID: body[i].RoomID,
                                 RoomName: body[i].RoomName,
                                 RoomLocation: body[i].RoomLocation,
                                 text: body[i].RoomName + " - " + body[i].RoomLocation
                             })
                         }
                         component.Rooms = newRooms;
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
            cancel (){
                this.$router.push({path: "/manageRoomDates"});
            },
            save (){
                let component = this;
                let StartTime = moment(this.StartTime, ["h:mmA"]).format("H:mm");
                let StartEpoch = moment(this.thisDate + " " + StartTime, ["YYYY-MM-DD H:mm"]);
                let EndTime = moment(this.EndTime, ["h:mmA"]).format("H:mm");
                let EndEpoch = moment(this.thisDate + " " + EndTime, ["YYYY-MM-DD H:mm"]);
                // console.log(StartEpoch.unix());
                // console.log(EndEpoch.unix());
                // console.log(this.Room);

                if (this.StartTime != null && this.EndTime != null && this.thisDate != null && StartEpoch < EndEpoch && this.Round != null){
                    //console.log("Checks out");
                    request.post({json: {token: this.$store.state.token, RoomDate: {
                        RoomID: component.Room.RoomID,
                        RoomStartTime: StartEpoch.unix(),
                        RoomEndTime: EndEpoch.unix(),
                        RoundID: component.Round.RoundID,
                        RoomDateID: component.RoomDateID
                    }, EventID: this.$store.state.eventData.EventID}, url: "http://"+this.$store.state.serverIP+'/post/newRoomDate', method: "POST"}, function (err, httpResponse, body){
                        if (httpResponse.statusCode == 200){
                            component.$router.push({path: "/manageRoomDates"});
                        }
                    })
                }
                else{
                    //console.log("OOOPS!");
                    this.error = true;
                }

                //console.log(this.Transits);
            }
        },
        created () {
            // this.RoomName = this.$store.state.manageRoom.RoomName;
            // this.RoomLocation = this.$store.state.manageRoom.RoomLocation;
            // this.RoomID = this.$store.state.manageRoom.RoomID;
            this.fetchData();
        }
    }
</script>

<style>

</style>