<template>
    <main>
        <h3>Edit Category: </h3>
        <v-card class="grey lighten-4 elevation-0">
            <v-card-text>
                <v-container fluid>
                    <v-flex xs8>
                        <v-text-field name="input-1" label="Category Description" id="testing" v-model="CategoryDescription" required></v-text-field>
                    </v-flex>
                    <v-flex xs8>
                        <v-text-field name="input-1" label="Stage Setup Time (Minutes)" id="testing" v-model="StageSetupTime" required></v-text-field>
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
                CategoryDescription: null,
                StageSetupTime: null,
                CategoryID: null,
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
                this.$router.push({path: "/manageCategories"});
            },
            save (){
                let component = this;
                //console.log(this.Transits);
                request.post({json: true, url: "http://"+this.$store.state.serverIP+'/post/category', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID, CategoryDescription: this.CategoryDescription, StageSetupTime: this.StageSetupTime, CategoryID: this.CategoryID}}, function (err, httpResponse, body){
                if (httpResponse.statusCode == 200){
                    // component.CategoryID = guid.create().value;
                    // component.CategoryDescription = null;
                    // component.StageSetupTime = null;
                    //console.log(body);
                    //component.fetchData();
                    component.$router.push({path: '/manageCategories'});
                }
            });
            }
        },
        created () {
            this.CategoryID = this.$store.state.manageCategory.CategoryID;
            this.CategoryDescription = this.$store.state.manageCategory.CategoryDescription;
            this.StageSetupTime = this.$store.state.manageCategory.StageSetupTime;
            //this.fetchData();
        }
    }
</script>

<style>

</style>