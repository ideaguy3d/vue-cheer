<template>
    <v-app>
        <div id="app">
            <div v-if="eventSet">
                <v-navigation-drawer permanent light>
                    <v-list class="pa-0">
                        <v-list-item>
                            <v-list-tile avatar tag="ul"></v-list-tile>
                        </v-list-item>
                    </v-list>
                    <v-divider></v-divider>
                    <v-list dense class="pt-0">
                        <v-list-item v-for="item in items" :key="item">
                            <v-list-tile router :href="item.route">
                                <v-list-tile-action>
                                    <v-icon>{{ item.icon }}</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list-item>
                    </v-list>
                </v-navigation-drawer>
                <v-toolbar class="purple" light>
                    <v-toolbar-title>wcopa admin</v-toolbar-title>
                </v-toolbar>
                <main>
                    <v-container fluid>
                        <!--v-router-->
                        <router-view></router-view>
                    </v-container>
                </main>
            </div>
            <div v-else="eventSet">
                <router-view></router-view>
            </div>
        </div>
    </v-app>
</template>

<script>
    export default {
        name: 'admin-app',
        data(){
            return{
                drawer: null,
                items: [
                    { title: 'Home', icon: 'dashboard', route: '/dashboard' },
                    { title: 'Manage Event', icon: 'question_answer', route: '/manageEvent'},
                    { title: 'Manage Countries', icon: 'place', route: '/manageCountries'},
                    { title: 'View/Manage Contestants', icon: 'perm_identity', route: '/manageContestants'},
                    { title: 'View/Manage Attendees', icon: 'perm_identity', route: '/manageAttendees'},
                    { title: 'View/Manage Directors', icon: 'perm_identity', route: '/manageDirectors'},
                    { title: 'View/Manage Judges', icon: 'perm_identity', route: '/manageJudges'},
                    { title: 'Manage Additional Users', icon: 'perm_identity', route: '/manageUsers'},
                    { title: 'Manage Rounds of Competition', icon: 'layers', route: '/manageRounds'},
                    { title: 'Manage Rooms', icon: 'room', route: '/manageRooms'},
                    { title: 'Manage Room Times', icon: 'access_time', route: '/manageRoomDates'},
                    { title: 'Manage Categories', icon: 'list', route: '/manageCategories'},
                    { title: 'Manage Age Brackets', icon: 'list', route: '/manageAgeBrackets'},
                    { title: 'Reporting', icon: 'assignment', route: '/reporting'},
                    { title: 'Scheduling', icon: 'view_week', route: '/scheduling'},
                    { title: 'Change Event', icon: 'event', route: '/landing'},
                    { title: 'Logout', icon: 'exit_to_app', route: '/logout'}
                ],
                right: null
            }
        },
        computed: {
            eventSet(){
                return this.$store.state.eventSet;
            }
        }
    }
</script>

<style>
    /* CSS */



    #wrapper {
        background:
                radial-gradient(
                        ellipse at top left,
                        rgba(255, 255, 255, 1) 40%,
                        rgba(229, 229, 229, .9) 100%
                );
        height: 100vh;
        padding: 60px 80px;
        width: 100vw;
    }

</style>
