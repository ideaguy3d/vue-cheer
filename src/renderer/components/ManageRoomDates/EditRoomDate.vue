<template>
    <v-app>
        <main>
            <h3>Edit Room Time: </h3>
            <v-card class="grey lighten-4 elevation-0">
                <v-card-text>
                    <v-container fluid>
                        <v-flex xs8>
                            <v-select v-bind:items="Rooms" v-model="Room" label="Choose a room" hint="Choose a Room" persistent-hint dark single-line
                                auto></v-select>
                        </v-flex>
                        <v-flex xs8>
                            <v-select v-bind:items="Rounds" v-model="Round" label="Choose a round" hint="Choose a Round" persistent-hint dark single-line
                                auto></v-select>
                        </v-flex>
                        <v-layout row>
                            <v-flex xs4>
                                <v-menu lazy :close-on-content-click="false" v-model="menu" transition="v-scale-transition" offset-y :nudge-left="40">
                                    <v-text-field slot="activator" label="Date" v-model="thisDate" prepend-icon="event" readonly></v-text-field>
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
                                <v-menu lazy :close-on-content-click="false" v-model="menu2" transition="v-scale-transition" offset-y :nudge-left="40">
                                    <v-text-field slot="activator" label="Start Time" prepend-icon="access_time" readonly v-model="StartTime"></v-text-field>
                                    <v-time-picker v-model="StartTime"></v-time-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex xs4>
                                <v-menu lazy :close-on-content-click="false" v-model="menu2" transition="v-scale-transition" offset-y :nudge-left="40">
                                    <v-text-field slot="activator" label="End Time" prepend-icon="access_time" readonly v-model="EndTime"></v-text-field>
                                    <v-time-picker v-model="EndTime"></v-time-picker>
                                </v-menu>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6>
                                <v-select v-bind:items="Categories" v-model="Category" label="Choose a category" hint="Choose a category" persistent-hint
                                    dark single-line auto></v-select>
                            </v-flex>
                            <v-flex xs6>
                                <v-select v-bind:items="AgeClasses" v-model="AgeClass" label="Choose an age class" hint="Choose an age class" persistent-hint
                                    dark single-line auto></v-select>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <v-alert error dismissible v-model="error">
                        {{ errorMsg }}
                    </v-alert>
                    <v-card-title>
                        Attached Categories
                        <v-spacer></v-spacer>
                        <v-btn light large style="margin: auto; margin-left: 40px" class="purple" v-on:click.native="addCategory">Add category</v-btn>
                        <v-spacer></v-spacer>
                        <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>
                    </v-card-title>
                    <v-data-table v-bind:headers="headers" v-bind:items="items" v-bind:search="search" :rows-per-page-items="paginationNum" :pagination.sync="pagination">
                        <template slot="items" scope="props">
                            <td>
                                <v-btn floating small v-on:click.native="del(props.item)" class="purple">
                                    <v-icon light>delete</v-icon>
                                </v-btn>
                            </td>
                            <td class="text-xs-right">{{ props.item.Category.CategoryDescription }}</td>
                            <td class="text-xs-right">{{ props.item.AgeClass.Description }}</td>
                        </template>
                        <template slot="pageText" scope="{ pageStart, pageStop }">
                            From {{ pageStart }} to {{ pageStop }}
                        </template>
                    </v-data-table>
                    <v-card-title>
                        Scoped Judges
                        <v-spacer></v-spacer>
                        <v-text-field append-icon="search" label="Search" single-line hide-details v-model="judgeSearch"></v-text-field>
                    </v-card-title>
                    <v-data-table v-bind:headers="judgeHeaders" v-bind:items="judgeItems" v-bind:search="judgeSearch" :rows-per-page-items="judgePaginationNum" :pagination.sync="judgePagination">
                        <template slot="items" scope="props">
                            <td><v-checkbox v-model="props.item.Checked" dark></v-checkbox></td>
                            <td class="text-xs-right">{{ props.item.Agency }}</td>
                            <td class="text-xs-right">{{ props.item.Title }}</td>
                            <td class="text-xs-right">{{ props.item.FirstName }}</td>
                            <td class="text-xs-right">{{ props.item.LastName }}</td>
                            <td class="text-xs-right">{{ props.item.EmailAddress }}</td>
                            <td class="text-xs-right">{{ props.item.PhoneNumber }}</td>
                        </template>
                        <template slot="pageText" scope="{ pageStart, pageStop }">
                            From {{ pageStart }} to {{ pageStop }}
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
            <br>
            <v-layout row wrap>
                <v-btn light large style="margin: auto; margin-right: 40px;" class="purple" v-on:click.native="cancel">Cancel</v-btn>
                <v-btn light large style="margin: auto; margin-left: 0px" class="purple" v-on:click.native="save">Save</v-btn>
            </v-layout>
        </main>
    </v-app>
</template>

<script>
    import request from 'request';
    import guid from 'guid';
    import moment from 'moment-es6';
    export default {
        data() {
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
                errorMsg: "",
                Rounds: [],
                Round: null,
                AllAgeClasses: null,
                PrelimAgeClasses: null,
                AgeClasses: [],
                Categories: [],
                Category: null,
                AgeClass: null,
                TimeCategories: [],
                search: '',
                pagination: {
                    page: 1,
                    rowsPerPage: 20
                },
                paginationNum: [10, 20, 50, 100, 200],
                headers: [{
                        text: 'Action',
                        right: true,
                        sortable: false,
                        value: 'Action'
                    },
                    {
                        text: 'Category',
                        right: true,
                        sortable: true,
                        value: 'Category.CategoryDescription'
                    },
                    {
                        text: 'Age Class',
                        right: true,
                        sortable: true,
                        value: 'AgeClass.Description'
                    }
                ],
                items: [],
                judgeSearch: '',
                judgePagination: {
                    page: 1,
                    rowsPerPage: 20
                },
                judgePaginationNum: [10, 20, 50, 100, 200],
                judgeHeaders: [{
                        text: 'Scoped',
                        right: true,
                        sortable: true,
                        value: 'Checked'
                    },
                    {
                        text: 'Agency',
                        right: true,
                        sortable: true,
                        value: 'Agency'
                    },
                    {
                        text: 'Title',
                        right: true,
                        sortable: true,
                        value: 'Title'
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
                judgeItems: []
            }
        },
        methods: {
            fetchData() {
                let component = this;
                request.post({
                    json: true,
                    url: "http://" + this.$store.state.serverIP + '/get/getRooms',
                    form: {
                        token: this.$store.state.token,
                        EventID: this.$store.state.eventData.EventID
                    }
                }, function (err, httpResponse, body) {
                    if (httpResponse.statusCode == 200) {
                        let newRooms = [];
                        for (let i = 0; i < body.length; i++) {
                            newRooms.push({
                                RoomID: body[i].RoomID,
                                RoomName: body[i].RoomName,
                                RoomLocation: body[i].RoomLocation,
                                Dates: body[i].Date,
                                text: body[i].RoomName + " - " + body[i].RoomLocation
                            })
                        }
                        component.Rooms = newRooms;
                        for (let i = 0; i < component.Rooms.length; i++) {
                            if (component.Rooms[i].RoomID == component.$store.state.manageRoomDate.RoomID) {
                                component.Room = component.Rooms[i];
                            }
                        }
                        request.post({
                            json: true,
                            url: "http://" + component.$store.state.serverIP + '/get/getRounds',
                            form: {
                                token: component.$store.state.token,
                                EventID: component.$store.state.eventData.EventID
                            }
                        }, function (err, httpResponse, body) {
                            if (httpResponse.statusCode == 200) {
                                let newRounds = [];
                                for (let i = 0; i < body.length; i++) {
                                    newRounds.push({
                                        RoundID: body[i].RoundID,
                                        RoomDescription: body[i].RoundDescription,
                                        text: body[i].RoundDescription
                                    })
                                }
                                //console.log(newRounds);
                                component.Rounds = newRounds;
                                for (let i = 0; i < component.Rounds.length; i++) {
                                    if (component.Rounds[i].RoundID == component.$store.state.manageRoomDate
                                        .RoundID) {
                                        for (let x = 0; x < component.Rounds.length; x++) {
                                            if (component.Rounds[x].RoundID == component.$store.state.manageRoomDate
                                                .RoundID) {
                                                component.Round = component.Rounds[x];
                                            }
                                        }
                                    }
                                }
                                //console.log(component.Rounds);
                            }
                        });

                        //console.log(moment.unix(component.$store.state.manageRoomDate.RoomStartTime).format('YYYY-MM-DD'));
                        component.thisDate = moment.unix(component.$store.state.manageRoomDate.RoomStartTime).format(
                            'YYYY-MM-DD');
                        component.StartTime = moment.unix(component.$store.state.manageRoomDate.RoomStartTime).format(
                            'h:mmA');
                        component.EndTime = moment.unix(component.$store.state.manageRoomDate.RoomEndTime).format(
                            'h:mmA');
                        component.RoomDateID = component.$store.state.manageRoomDate.RoomDateID;
                    }
                });
                request.post({
                    json: true,
                    url: "http://" + component.$store.state.serverIP + '/get/getAgeClass',
                    form: {
                        token: component.$store.state.token,
                        EventID: component.$store.state.eventData.EventID
                    }
                }, function (err, httpResponse, body) {
                    if (httpResponse.statusCode == 200) {
                        let PrelimAgeClasses = [];
                        let OverallAgeClasses = [];
                        for (let i = 0; i < body.length; i++) {
                            if (body[i].PrelimAge == true) {
                                PrelimAgeClasses.push({
                                    AgeID: body[i].AgeID,
                                    MinAge: body[i].MinAge,
                                    MaxAge: body[i].MaxAge,
                                    Description: body[i].Description,
                                    PrelimAge: body[i].PrelimAge,
                                    text: body[i].Description
                                })
                            } else {
                                OverallAgeClasses.push({
                                    AgeID: body[i].AgeID,
                                    MinAge: body[i].MinAge,
                                    MaxAge: body[i].MaxAge,
                                    Description: body[i].Description,
                                    PrelimAge: body[i].PrelimAge,
                                    text: body[i].Description
                                })
                            }
                        }
                        component.PrelimAgeClasses = PrelimAgeClasses;
                        component.OverallAgeClasses = OverallAgeClasses;
                        component.AgeClasses = PrelimAgeClasses;
                        //console.log(component.AgeClasses);

                    }
                });
                request.post({
                    json: true,
                    url: "http://" + component.$store.state.serverIP + '/get/getCategories',
                    form: {
                        token: component.$store.state.token,
                        EventID: component.$store.state.eventData.EventID
                    }
                }, function (err, httpResponse, body) {
                    if (httpResponse.statusCode == 200) {
                        let Categories = [];
                        for (let i = 0; i < body.length; i++) {
                            Categories.push({
                                CategoryID: body[i].CategoryID,
                                CategoryDescription: body[i].CategoryDescription,
                                StageSetupTime: body[i].StageSetupTime,
                                text: body[i].CategoryDescription
                            })
                        }
                        //console.log(Categories);
                        component.Categories = Categories;

                    }
                });
                request.post({
                    json: true,
                    url: "http://" + component.$store.state.serverIP + '/get/getCategoryLimits',
                    form: {
                        token: component.$store.state.token,
                        EventID: component.$store.state.eventData.EventID,
                        RoomDateID: component.$store.state.manageRoomDate.RoomDateID
                    }
                }, function (err, httpResponse, body) {
                    if (httpResponse.statusCode == 200) {
                        let items = [];
                        for (let i=0; i < body.length; i++){
                            items.push({
                                AgeClass: {
                                    AgeID: body[i].AgeID,
                                    Description: body[i].Description
                                },
                                Category: {
                                    CategoryID: body[i].CategoryID,
                                    CategoryDescription: body[i].CategoryDescription
                                }
                            })
                        }
                        component.items = items;
                        //console.log(body);
                        //console.log(Categories);
                        //component.Categories = Categories;

                    }
                });
                request.post({json: true, url: "http://"+this.$store.state.serverIP+'/get/getRoomDateJudges', form: {token: this.$store.state.token, EventID: this.$store.state.eventData.EventID, RoomDateID: this.$store.state.manageRoomDate.RoomDateID}}, function (err, httpResponse, body){
                if (httpResponse.statusCode == 200){
                    component.judgeItems = body;
                    console.log(body);
                }
            });

            },
            cancel() {
                this.$router.push({
                    path: "/manageRoomDates"
                });
            },
            del(item) {
                let component = this;
                request.post({
                    json: true,
                    url: "http://" + component.$store.state.serverIP + '/delete/categoryLimit',
                    form: {
                        token: component.$store.state.token,
                        EventID: component.$store.state.eventData.EventID,
                        RoomDateID: component.$store.state.manageRoomDate.RoomDateID,
                        AgeID: item.AgeClass.AgeID,
                        CategoryID: item.Category.CategoryID
                    }
                }, function (err, httpResponse, body) {
                    if (httpResponse.statusCode == 200) {
                        for (let i = 0; i < component.items.length; i++) {
                            if (component.items[i] == item) {
                                component.items.splice(i, 1);
                            }
                        }
                        //console.log(body);
                        //console.log(Categories);
                        //component.Categories = Categories;

                    }
                });

            },
            save() {
                let component = this;
                let StartTime = moment(this.StartTime, ["h:mmA"]).format("H:mm");
                let StartEpoch = moment(this.thisDate + " " + StartTime, ["YYYY-MM-DD H:mm"]);
                let EndTime = moment(this.EndTime, ["h:mmA"]).format("H:mm");
                let EndEpoch = moment(this.thisDate + " " + EndTime, ["YYYY-MM-DD H:mm"]);
                // console.log(StartEpoch.unix());
                // console.log(EndEpoch.unix());
                // console.log(this.Room);

                if (this.StartTime != null && this.EndTime != null && this.thisDate != null && StartEpoch < EndEpoch &&
                    this.Round != null) {
                    //console.log("Checks out");
                    request.post({
                        json: {
                            token: this.$store.state.token,
                            RoomDate: {
                                RoomID: component.Room.RoomID,
                                RoomStartTime: StartEpoch.unix(),
                                RoomEndTime: EndEpoch.unix(),
                                RoundID: component.Round.RoundID,
                                RoomDateID: component.RoomDateID
                            },
                            EventID: this.$store.state.eventData.EventID
                        },
                        url: "http://" + this.$store.state.serverIP + '/post/newRoomDate',
                        method: "POST"
                    }, function (err, httpResponse, body) {
                        if (httpResponse.statusCode == 200) {
                            request.post({
                            json: {
                                token: component.$store.state.token,
                                RoomDateID: component.RoomDateID,
                                JudgeScopeData: component.judgeItems,
                                EventID: component.$store.state.eventData.EventID
                            },
                            url: "http://" + component.$store.state.serverIP + '/post/roomJudge',
                            method: "POST"
                        }, function (err, httpResponse, body) {
                            if (httpResponse.statusCode == 200) {
                                
                                component.$router.push({
                                    path: "/manageRoomDates"
                                });
                            }
                        })
                        }
                    })
                } else {
                    //console.log("OOOPS!");
                    this.error = true;
                }

                //console.log(this.Transits);
            },
            addCategory() {
                let component = this;
                let anItem = {
                    AgeClass: this.AgeClass,
                    Category: this.Category
                };
                let itemExists = false;
                for (let i = 0; i < this.items.length; i++) {
                    if (this.items[i].AgeClass.AgeID == anItem.AgeClass.AgeID && this.items[i].Category.CategoryID ==
                        anItem.Category.CategoryID) {
                        itemExists = true;
                    }
                }
                if (itemExists == false) {
                    request.post({
                        json: {
                            token: this.$store.state.token,
                            CategoryID: anItem.Category.CategoryID,
                            AgeID: anItem.AgeClass.AgeID,
                            RoundID: this.Round.RoundID,
                            EventID: this.$store.state.eventData.EventID,
                            RoomDateID: this.RoomDateID
                        },
                        url: "http://" + this.$store.state.serverIP + '/post/categoryLimit',
                        method: "POST"
                    }, function (err, httpResponse, body) {
                        if (httpResponse.statusCode == 200) {
                            component.items.push(anItem);
                        }
                        else if (httpResponse.statusCode == 409){
                            let RoomStartString = moment.unix(body.RoomStartTime).format('MMMM Do YYYY, h:mm:ss a');
                            let RoomEndString =  moment.unix(body.RoomEndTime).format('MMMM Do YYYY, h:mm:ss a');
                            component.errorMsg = "Error adding " + anItem.Category.CategoryDescription + " " + anItem.AgeClass.Description + " it is already assigned to " + body.RoomName + " - " + body.RoomLocation + " Start Time: " + RoomStartString + " End Time: " + RoomEndString + ". You must unassign this Category to add to this room time block.";
                            component.error = true;
                        }
                    })
                }
                //console.log(this.TimeCategories);
            }
        },
        created() {
            // this.RoomName = this.$store.state.manageRoom.RoomName;
            // this.RoomLocation = this.$store.state.manageRoom.RoomLocation;
            // this.RoomID = this.$store.state.manageRoom.RoomID;
            this.fetchData();
        }
    }
</script>

<style>

</style>