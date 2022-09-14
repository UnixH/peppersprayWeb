<template>
    <v-app>
        <v-app-bar app>
            <v-toolbar-title>peppersprayWeb</v-toolbar-title>
            <v-toolbar-items>
                <v-btn text v-on:click="page = 'download'">Download client</v-btn>
                <v-btn text href="http://github.com/peppersprayEzekiel" target="_blank">Github</v-btn>
            </v-toolbar-items>
            <v-spacer />
            <v-toolbar-items v-if="user == null">
                <v-btn text v-on:click="page = 'login'">Login</v-btn>
                <v-btn text v-on:click="page = 'signup'">Sign up</v-btn>
            </v-toolbar-items>
            <v-toolbar-items v-else>
                <v-btn text v-on:click="page = 'manage'">{{ user.name }}</v-btn>
                <v-btn text v-on:click="logout">Logout</v-btn>
            </v-toolbar-items>
        </v-app-bar>
        <v-content>
            <br />

            <SignUp v-if="page == 'signup'"
                    @successful="onSignup" />

            <Login v-else-if="page == 'login'"
                   @successful="onLogin"
                   @forgot="page = 'forgotpassword'" />

            <ForgotPassword v-else-if="page == 'forgotpassword'" />

            <ManageAccount v-else-if="page == 'manage'" 
                           :user="user"
                           @deletedaccount="logout"/>

            <Download v-else-if="page == 'download'" />
            <Gold v-else-if="page == 'gold'" />
        </v-content>
    </v-app>
</template>

<script>
    import SignUp from './components/SignUp';
    import Login from './components/Login';
    import ManageAccount from './components/ManageAccount';
    import Download from './components/Download';
    import ForgotPassword from './components/ForgotPassword';
    import Gold from './components/Gold';

    export default {
        name: 'App',
        components: {
            SignUp,
            Login,
            ManageAccount,
            Download,
            ForgotPassword,
            Gold
        },

        data: () => ({
            page: window.location.href.split("#")[1],
            user: null
        }),

        watch: {
            page: function(value) {
                window.location.href = window.location.href.split("#")[0] + "#" + value
            }
        },
        methods: {
            onSignup: function (user) {
                this.user = user;
                this.page = "download";
            },

            onLogin: function (user) {
                this.user = user;
                this.page = "manage";
            },

            logout: function () {
                this.user = null;
                this.page = "login";
            }
        },
    };
</script>
