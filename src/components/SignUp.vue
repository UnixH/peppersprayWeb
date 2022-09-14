<template>
    <v-card max-width="344"
            class="mx-auto"
            :loading="busy">
        <v-card-title>Sign up</v-card-title>
        <v-card-text>
            <v-alert v-if="failedReason && !busy" type="error">
                {{ failedReason }}
            </v-alert>
            <v-form v-model="valid">
                <v-text-field v-model="email" label="Email" :rules="rules.email" required></v-text-field>
                <v-text-field type="password" v-model="password" label="Password" :rules="rules.password" required></v-text-field>
                <v-text-field type="password" v-model="passwordRepeat" label="Repeat password" :rules="rules.passwordMatch(() => password)" required></v-text-field>
                <vue-recaptcha
                    loadRecaptchaScript
                    ref="recaptcha"
                    @verify="captchaVerified"
                    sitekey="6LeX_LMUAAAAAAx7f2Z6xe9QkDidPQoBiqnbLQ_8" />
                <br />
                <v-layout justify-space-around>
                    <v-btn v-on:click="submit" :disabled="!valid" color="primary">Sign up</v-btn>
                </v-layout>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
    const service = require("../services/userservice");
    const rules = require("../services/rules");
    import VueRecaptcha from "vue-recaptcha";

    export default {
        name: 'SignUp',
        components: {
            "vue-recaptcha": VueRecaptcha
        },
        props: {

        },

        data: () => ({
            rules: rules,

            valid: false,
            busy: false,
            failedReason: null,

            email: "",
            password: "",
            passwordRepeat: "",
            captchaToken: ""
        }),

        methods: {
            captchaVerified: function (token) {
                this.captchaToken = token;
            },

            submit: function () {
                this.busy = true;
                this.failedReason = null;

                return service
                    .signUp(this.email, this.password, this.captchaToken)
                    .then((user) => {
                        this.$emit("successful", user);
                    })
                    .catch((ex) => {
                        if (ex === "fail") {
                            this.failedReason = "Email taken.";
                        } else if (ex === "captcha") {
                            this.failedReason = "Captcha validation failed.";
                        } else if (ex === "banned") {
                            this.failedReason = "Address banned.";
                        } else if (ex === "signup_disabled") {
                            this.failedReason = "Sorry, registration is temporarily disabled.";
                        } else {
                            this.failedReason = "Connection error.";
                        }
                    })
                    .then(() => {
                        this.busy = false;
                    });
            }
        }
    };
</script>

<style scoped>
</style>
