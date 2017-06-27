<template>
    <main>
        <h3>Edit Round: </h3>
        <v-card class="grey lighten-4 elevation-0">
            <v-card-text>
                <v-container fluid>
                    <v-flex xs8>
                        <v-text-field name="input-1" label="Round Description" id="testing" v-model="RoundDescription"></v-text-field>
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
                RoomName: "",
                RoomLocation: "",
                RoomID: "",
                Rooms: [],
                thisRoom: null,
                Transits: [],
                RoundDescription: "",
                RoundID: ""
            }
        },
        methods: {
            fetchData(){
                let component = this;

            },
            cancel (){
                this.$router.push({path: "/manageRounds"});
            },
            save (){
                //console.log(this.RoundDescription);
                let component = this;
                if (this.RoundDescription != "" || this.RoundDescription != null){
                    request.post({json: true, url: "http://"+this.$store.state.serverIP+'/post/round', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID, RoundID: this.RoundID, RoundDescription: this.RoundDescription}}, function (err, httpResponse, body){
                    if (httpResponse.statusCode == 200){
                        component.$router.push({path: "/manageRounds"});
                    }
                    if (httpResponse.statusCode == 409){
                        component.error = true;
                    }
                    })
                }
            }
        },
        created () {
            //console.log(this.$store.state.manageRound.RoundDescription);
            this.RoundID = this.$store.state.manageRound.RoundID;
            this.RoundDescription = this.$store.state.manageRound.RoundDescription;
            //this.fetchData();
        }
    }
</script>

<style>

</style>