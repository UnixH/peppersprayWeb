<template>
  <v-container>
    <v-card max-width="344" class="mx-auto" :loading="busy">
      <v-card-title>Forgot password</v-card-title>
      <v-card-text>
        <v-expand-transition>
          <v-alert v-if="message != null" :type="message && message.type">
            {{ message.text }}
          </v-alert>
        </v-expand-transition>
        <p>
          Provide your email address and you will receive a letter with your new
          password.
        </p>
        <v-form v-model="valid">
          <v-text-field
            v-model="email"
            label="Email"
            required
            :rules="rules.email"
          ></v-text-field>
        </v-form>
        <vue-recaptcha
          loadRecaptchaScript
          ref="recaptcha"
          @verify="captchaVerified"
          sitekey="6LeX_LMUAAAAAAx7f2Z6xe9QkDidPQoBiqnbLQ_8"
        />
      </v-card-text>
      <v-card-actions>
        <v-layout justify-center>
          <v-btn @click="submit" color="primary" :disabled="!valid"
            >Submit</v-btn
          >
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
const service = require('../services/userservice');
import VueRecaptcha from 'vue-recaptcha';

export default {
  data: () => ({
    rules: require('../services/rules'),
    valid: false,
    busy: false,

    email: '',
    captchaToken: '',
    message: null,
  }),

  components: {
    'vue-recaptcha': VueRecaptcha,
  },

  methods: {
    captchaVerified: function (token) {
      this.captchaToken = token;
    },

    submit: function () {
      this.busy = true;
      this.message = null;

      return service
        .forgotPassword(this.email, this.captchaToken)
        .then(() => {
          this.email = '';
          this.message = {
            type: 'success',
            text: 'Check your email for new password.',
          };
        })
        .catch((e) => {
          if (e === 'captcha') {
            this.message = {
              type: 'error',
              text: 'Captcha validation failed.',
            };
          }
          if (e == undefined) {
            this.message = { type: 'error', text: 'User not found.' };
          } else {
            this.message = { type: 'error', text: 'Connection error.' };
          }
        })
        .then(() => (this.busy = false));
    },
  },
};
</script>

<style scoped></style>
