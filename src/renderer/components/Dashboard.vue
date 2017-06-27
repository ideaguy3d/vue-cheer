<template>
    <div>
        <!--<p>Welcome to the administrative app! To get started choose an item from the drawer.</p>-->
        <v-layout row wrap>
            <v-flex xs10 offset-xs1>
                <v-card>
                    <v-card-row class="purple">
                        <v-card-title>
                            <span class="white--text">Current Event Information</span>
                            <v-spacer></v-spacer>
                        </v-card-title>
                    </v-card-row>
                    <v-card-text>
                        <div>
                            <!--<h3>Current Event Information</h3>-->
                            <p>Event Name:       {{ event.EventName }}</p>
                            <p>Event Start Date: {{ event.StartDate }}</p>
                            <p>Event End Date:   {{ event.EndDate }}</p>
                            <p>Maximum Performance Time: {{ event.GlobalPerformanceLength }} minutes</p>
                            <p>Minimum Room Transit Time: {{ event.GlobalTransitTime }} minutes</p>
                        </div>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
        <br>
        <!-- example 2nd layout -->
        <v-layout id="ex1" row wrap>
            <!-- fake loop -->
            <v-flex xs12 v-for="i in mockData">
                <v-card class="primary">
                    <v-card-text>
                        {{ i.category }} &nbsp; | &nbsp;{{i.gender}}&nbsp; | &nbsp;{{i.ageGroup}}&nbsp; |
                        &nbsp;{{i.startTime}}&nbsp;
                        &nbsp;
                        <v-btn class="purple" floating small v-on:click.native="go2view(i)">
                            <v-icon light>fingerprint</v-icon>
                        </v-btn> &nbsp;
                        <v-btn class="purple" floating small>
                            <v-icon light>list</v-icon>
                        </v-btn>
                    </v-card-text>
                </v-card>
                <br>
            </v-flex>

            <v-flex xs6 v-for="i in 2" :key="i">
                <v-card class="secondary">
                    <v-card-text>6</v-card-text>
                </v-card>
            </v-flex>

            <v-flex xs4 v-for="i in 3" :key="i">
                <v-card class="primary">
                    <v-card-text>4</v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs3 v-for="i in 4" :key="i">
                <v-card class="secondary">
                    <v-card-text>3</v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs2 v-for="i in 6" :key="i">
                <v-card class="primary">
                    <v-card-text>2</v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs1 v-for="i in 12" :key="i">
                <v-card class="secondary">
                    <v-card-text>1</v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
    const mockData = [
        {
            _id: 1111,
            category: 'commercial casual',
            gender: 'male',
            startTime: '8am',
            ageGroup: '18-24'
        },
        {
            _id: 2222,
            category: 'hip hop',
            gender: 'female',
            startTime: '9am',
            ageGroup: '18-24'
        },
        {
            _id: 3333,
            category: 'contemporary',
            gender: 'male',
            startTime: '10am',
            ageGroup: '18-24'
        },
        {
            _id: 4444,
            category: 'modern',
            gender: 'female',
            startTime: '11am',
            ageGroup: '18-24'
        }
    ];
    import moment from 'moment-es6'
    export default {
        name: 'Login',
        data() {
            return{
                mockData: mockData
            };
        },
        computed: {
            event () {
                return this.$store.state.eventData;
            }
        },
        created: {},
        methods: {
            go2view(i) {
                this.$store.commit("setJuliusPrac", i.category);
                this.$router.push({path: '/manageContestants'});
            }
        }
    }
</script>

<style>
    #ex1 {
        color: #fff;
        text-align: center;
    }

    #ex1 .flex {
        margin-bottom: 16px;
    }
</style>