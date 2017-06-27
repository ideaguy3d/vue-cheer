import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'login',
            component: require('@/components/dashboard')
        },
        {
            path: '*',
            redirect: '/'
        },
        {
            path: '/landing',
            name: 'landing',
            component: require('@/components/LandingPage')
        },
        {
            path: '/newEvent',
            name: 'newEvent',
            component: require('@/components/NewEvent/NewEvent')
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: require('@/components/dashboard')
        },
        {
            path: '/manageCountries',
            name: 'manageCountries',
            component: require('@/components/ManageCountries/ManageCountries')
        },
        {
            path: '/manageCountries/editCountry',
            name: 'editCountry',
            component: require('@/components/ManageCountries/EditCountry')
        },
        {
            path: '/manageCountries/newCountry',
            name: 'newCountry',
            component: require('@/components/ManageCountries/NewCountry')
        },
        {
            path: '/manageEvent',
            name: 'manageEvent',
            component: require('@/components/ManageEvent/ManageEvent')
        },
        {
            path: '/manageContestants',
            name: 'manageContestants',
            component: require('@/components/ManageContestants/ManageContestants')
        },
        {
            path: '/manageContestants/newContestant',
            name: 'newContestant',
            component: require('@/components/ManageContestants/NewContestant')
        },
        {
            path: '/manageContestants/editContestant',
            name: 'editContestant',
            component: require('@/components/ManageContestants/EditContestant')
        },
        {
            path: '/manageAttendees',
            name: 'manageAttendees',
            component: require('@/components/ManageAttendees/ManageAttendees')
        },
        {
            path: '/manageAttendees/editAttendee',
            name: 'editAttendee',
            component: require('@/components/ManageAttendees/EditAttendee')
        },
        {
            path: '/manageAttendees/NewAttendee',
            name: 'newAttendee',
            component: require('@/components/ManageAttendees/NewAttendee')
        },
        {
            path: '/manageAttendees/attendeePayments',
            name: 'attendeePayments',
            component: require('@/components/ManageAttendees/AttendeePayments')
        },
        {
            path: '/manageDirectors',
            name: 'manageDirectors',
            component: require('@/components/ManageDirectors/ManageDirectors')
        },
        {
            path: '/manageDirectors/editDirector',
            name: 'editDirector',
            component: require('@/components/ManageDirectors/EditDirector')
        },
        {
            path: '/manageDirectors/NewDirector',
            name: 'newDirector',
            component: require('@/components/ManageDirectors/NewDirector')
        },
        {
            path: '/manageRooms',
            name: 'manageRooms',
            component: require('@/components/ManageRooms/ManageRooms')
        },
        {
            path: '/manageRooms/editRoom',
            name: 'editRoom',
            component: require('@/components/ManageRooms/EditRoom')
        },
        {
            path: '/manageRooms/NewRoom',
            name: 'newRoom',
            component: require('@/components/ManageRooms/NewRoom')
        },
        {
            path: '/manageUsers',
            name: 'manageUsers',
            component: require('@/components/ManageUsers/ManageUsers')
        },
        {
            path: '/manageUsers/editUser',
            name: 'editUser',
            component: require('@/components/ManageUsers/EditUser')
        },
        {
            path: '/manageUsers/NewUser',
            name: 'newUser',
            component: require('@/components/ManageUsers/NewUser')
        },
        {
            path: '/manageRoomDates',
            name: 'manageRoomDates',
            component: require('@/components/ManageRoomDates/ManageRoomDates')
        },
        {
            path: '/manageRoomDates/editRoomDate',
            name: 'editRoomDate',
            component: require('@/components/ManageRoomDates/EditRoomDate')
        },
        {
            path: '/manageRoomDates/NewRoomDate',
            name: 'newRoomDate',
            component: require('@/components/ManageRoomDates/NewRoomDate')
        },
        {
            path: '/manageRounds',
            name: 'manageRounds',
            component: require('@/components/ManageRounds/ManageRounds')
        },
        {
            path: '/manageRounds/editRound',
            name: 'editRound',
            component: require('@/components/ManageRounds/EditRound')
        },
        {
            path: '/manageRounds/NewRound',
            name: 'newRound',
            component: require('@/components/ManageRounds/NewRound')
        },
        {
            path: '/manageJudges',
            name: 'manageJudges',
            component: require('@/components/ManageJudges/ManageJudges')
        },
        {
            path: '/manageJudges/editJudge',
            name: 'editJudge',
            component: require('@/components/ManageJudges/EditJudge')
        },
        {
            path: '/manageJudges/NewJudge',
            name: 'newJudge',
            component: require('@/components/ManageJudges/NewJudge')
        },
        {
            path: '/logout',
            name: 'logout',
            component: require('@/components/Logout/Logout')
        },
        {
            path: '/manageUsers/EditUserPass',
            name: 'editUserPass',
            component: require('@/components/ManageUsers/EditUserPass')
        },
        {
            path: '/manageCategories',
            name: 'manageCategories',
            component: require('@/components/ManageCategories/ManageCategories')
        },
        {
            path: '/manageCategories/editCategory',
            name: 'editCategory',
            component: require('@/components/ManageCategories/EditCategory')
        },
        {
            path: '/manageAgeBrackets',
            name: 'manageAgeBrackets',
            component: require('@/components/ManageAgeBrackets/ManageAgeBrackets')
        },
        {
            path: '/manageAgeBrackets/editAgeBracket',
            name: 'editAgeBracket',
            component: require('@/components/ManageAgeBrackets/EditAgeBracket')
        },
        {
            path: '/manageAgeBrackets/newAgeBracket',
            name: 'newAgeBracket',
            component: require('@/components/ManageAgeBrackets/NewAgeBracket')
        },
        {
            path: '/manageContestants/ContestantPayments',
            name: 'contestantPayments',
            component: require('@/components/ManageContestants/ContestantPayments')
        },
        {
            path: '/manageContestants/ContestantPerformances',
            name: 'contestantPerformances',
            component: require('@/components/ManageContestants/ContestantPerformances')
        },
        {
            path: '/scheduling',
            name: 'scheduling',
            component: require('@/components/Scheduling/Scheduling')
        }
    ]
})
