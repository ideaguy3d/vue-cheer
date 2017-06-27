import Vue from 'vue'
import Vuex from 'vuex'
import fs from 'fs'
import modules from './modules'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        token: null,
        event: null,
        serverIP: "127.0.0.1",
        eventSet: false,
        eventData: null,
        manageCountry: null,
        countryData: null,
        manageContestant: null,
        manageRoom: null,
        manageRoomDate: null,
        manageRound: null,
        manageJudge: null,
        manageUser: null,
        manageAgeBracket: null,
        manageCategory: null,
        manageAttendee: null,
        specialIndex: null
    },
    getters: {
        currentToken: state => {
            return state.token;
        }
    },
    mutations: {
        setCurrentToken (state, newToken){
            state.token = newToken;
        },
        setCurrentEvent (state, newEvent){
            state.event = newEvent;
        },
        setServerIP (state, newIP){
            state.serverIP = newIP;
        },
        setEventSet(state, value){
            state.eventSet = value;
        },
        setEventData(state, data){
            state.eventData = data;
        },
        setCurrentCountry(state, countryID){
            state.manageCountry = countryID;
        },
        setCountryData(state, data){
            state.countryData = data;
        },
        setCurrentContestant(state, ContestantID){
            state.manageContestant = ContestantID;
        },
        setCurrentRoom(state, RoomID){
            state.manageRoom = RoomID;
        },
        setCurrentRoomDate(state, RoomDateID){
            state.manageRoomDate = RoomDateID;
        },
        setCurrentRound(state, Round){
            state.manageRound = Round;
        },
        setCurrentJudge(state, Judge){
            state.manageJudge = Judge;
        },
        setCurrentUser(state, user){
            state.manageUser = user;
        },
        setAgeBracket(state, AgeBracket){
            state.manageAgeBracket = AgeBracket;
        },
        setCategory(state, Category){
            state.manageCategory = Category;
        },
        setCurrentAttendee(state, Attendee){
            state.manageAttendee = Attendee;
        },
        setJuliusPrac(state, specialIndex) {
            state.specialIndex = specialIndex;
        },
        loadTokenFromFile (state){
            if (!fs.existsSync("token.json")) {
                console.log("File not found");
                return null
            }
            else {
                state.token = JSON.parse(fs.readFileSync("token.json")).token;
                return JSON.parse(fs.readFileSync("token.json")).token;
            }
        }
    },
    modules: {},
    strict: process.env.NODE_ENV !== 'production'
})
