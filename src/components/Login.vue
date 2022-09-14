<template>
  <v-card max-width="344" class="mx-auto" :loading="busy">
    <v-card-title>Login</v-card-title>
    <v-form v-model="valid">
      <v-form v-model="valid">
        <v-card-text>
          <v-alert v-if="failedReason != null && !busy" type="error">
            {{ failedReason }}
          </v-alert>

          <v-text-field
            v-model="email"
            label="Email"
            required
            :rules="rules.email"
          ></v-text-field>
          <v-text-field
            type="password"
            v-model="password"
            label="Password"
            required
            :rules="rules.password"
          ></v-text-field>
          <vue-recaptcha
            loadRecaptchaScript
            ref="recaptcha"
            size="invisible"
            @verify="captchaVerified"
            sitekey="6Lfy-bMUAAAAABZGl3bM2L0AI2wCJWJUwm_Ouy_s"
          />
        </v-card-text>

        <v-card-actions>
          <v-btn @click="$emit('forgot')" text>Forgot password</v-btn>
          <v-spacer />
          <v-btn v-on:click="submit" color="primary" text :disabled="!valid"
            >Login</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-form>
  </v-card>
</template>

<script>
const service = require('../services/userservice');
const rules = require('../services/rules');
import VueRecaptcha from 'vue-recaptcha';

export default {
  Name: 'Login',
  data: () => ({
    rules: rules,

    valid: false,
    busy: false,
    failedReason: null,

    email: '',
    password: '',
    captchaToken: '',
  }),

  components: {
    'vue-recaptcha': VueRecaptcha,
  },

  methods: {
    captchaVerified: function (token) {
      this.captchaToken = token;
      this.login();
    },

    submit: function () {
      this.$refs.recaptcha.execute();
    },

    login: function () {
      this.failedReason = null;

      return service
        .login(this.email, this.password, this.captchaToken)
        .then((user) => {
          this.$emit('successful', user);
        })
        .catch((ex) => {
          if (ex === 'captcha') {
            this.failedReason = 'Captcha validation failed.';
          } else if (ex === 'invalid_password') {
            this.failedReason = 'Invalid username or password.';
          } else if (ex === 'not_found') {
            this.failedReason = 'Username not found.';
          } else if (ex === 'banned') {
            this.failedReason = 'Address banned.';
          } else {
            this.failedReason = 'Connection error.';
          }
        })
        .then(() => {
          this.busy = false;
        });
    },
  },
};
</script>

<style scoped></style>
