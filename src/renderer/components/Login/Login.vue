<template>
    <div id="wrapper">
        <img id="logo" src="~@/assets/wcopa_logo.png"
             style="display: block; width: 35%; vertical-align: middle; margin: auto;">
        <form v-on:submit.prevent="formHandler">

            <v-layout row wrap>
                <v-flex xs10 offset-xs1>
                    <v-text-field
                            v-model="emailAddress"
                            name="email"
                            label="Email Address"
                            id="email"
                    ></v-text-field>
                </v-flex>
            </v-layout>

            <v-layout row wrap>
                <v-flex xs10 offset-xs1>
                    <v-text-field
                            v-model="password"
                            name="password"
                            label="Password"
                            id="password"
                            type="password"
                    ></v-text-field>
                </v-flex>
            </v-layout>

            <v-layout row wrap>
                <v-btn light large style="margin: auto;" class="purple" type="submit">Login</v-btn>
            </v-layout>
        </form>
        <v-progress-linear v-bind:indeterminate="true" v-if="loading"></v-progress-linear>
        <v-alert error v-model="failed">
            Error with login, you may have incorrect credentials or poor network connectivity.
        </v-alert>
    </div>
</template>

<script>
    import fs from "fs";
    import request from "request";
    export default {
        name: 'Login',
        components: {},
        data() {
            return {
                randomName: "MESSAGE",
                emailAddress: "",
                password: "",
                failed: false,
                loading: false
            }
        },
        methods: {
            open (link) {
                this.$electron.shell.openExternal(link);
            },
            formHandler (){
                let component = this;
                this.loading = true;

                //------------------
                //-- authentication:
                //------------------
                request.post({
                    url: 'http://' + this.$store.state.serverIP + '/auth',
                    form: {email: this.emailAddress, password: this.password}
                }, function (err, httpResponse, body) {
                    component.loading = false;

                    if (httpResponse.statusCode == 401) {
                        component.failed = true;
                    }
                    else {
                        component.failed = false;
                        fs.writeFileSync("token.json", httpResponse.body);
                        component.$store.commit('setCurrentToken', JSON.parse(httpResponse.body).token);
                        component.$router.push("landing");
                    }
                });
            }
        },
        created: function () {
        }

    }
</script>

<style>

</style>
