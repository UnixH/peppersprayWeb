<template>
  <v-layout column>
    <v-layout justify-space-around>
      <v-expand-transition>
        <v-alert v-if="message != null" :type="message && message.type">
          {{ message.text }}
        </v-alert>
      </v-expand-transition>
    </v-layout>

    <v-flex>
      <v-card max-width="600" class="mx-auto">
        <v-card-title>Characters</v-card-title>
        <v-data-table
          :headers="characterHeaders"
          :items="user.characters"
          hide-default-footer
        />
      </v-card>
      <br />

      <v-card
        :loading="changePasswordInProgress"
        max-width="600"
        class="mx-auto"
      >
        <v-card-title>Change password</v-card-title>
        <v-card-text> You may change your password. </v-card-text>
        <v-expand-transition>
          <v-card-text v-show="changePasswordExpand">
            <v-form v-model="changePasswordValid" class="px-12">
              <v-text-field
                type="password"
                v-model="currentPassword"
                label="Current password"
                required
                :rules="rules.passwod"
              />
              <v-text-field
                type="password"
                v-model="newPassword1"
                label="New password"
                required
                :rules="rules.password"
              />
              <v-text-field
                type="password"
                v-model="newPassword2"
                label="New password (repeat)"
                required
                :rules="rules.passwordMatch(() => newPassword1)"
              />
              <v-btn
                v-on:click="changePassword"
                :disabled="!changePasswordValid"
                text
                color="primary"
                >Submit</v-btn
              >
            </v-form>
          </v-card-text>
        </v-expand-transition>
        <v-card-actions>
          <v-layout justify-center>
            <v-btn
              v-on:click="changePasswordExpand = !changePasswordExpand"
              text
            >
              {{ !changePasswordExpand ? 'Change password' : 'Close' }}
            </v-btn>
          </v-layout>
        </v-card-actions>
      </v-card>
      <br />

      <v-card max-width="600" class="mx-auto" :loading="deleteIsInProgress">
        <v-card-title>Delete account</v-card-title>
        <v-card-text>
          If you can't login trough the game client anymore that means that the
          data associated with this account is corrupted. Delete the account to
          start anew.
        </v-card-text>
        <v-expand-transition>
          <v-card-text v-show="deletePrompt">
            <p>Please confirm your password before continuing:</p>
            <v-layout row align-baseline="" class="px-12">
              <v-text-field
                type="password"
                v-model="confirmPassword"
                label="Password"
                required
                :rules="rules.password"
              ></v-text-field>
              <v-btn v-on:click="deleteAccount" text color="error"
                >Confirm</v-btn
              >
            </v-layout>
          </v-card-text>
        </v-expand-transition>
        <v-card-actions>
          <v-layout justify-center>
            <v-btn
              v-on:click="deletePrompt = !deletePrompt"
              text
              :color="deletePrompt ? '' : 'error'"
            >
              {{ !deletePrompt ? 'Delete' : 'Close' }}
            </v-btn>
          </v-layout>
        </v-card-actions>
      </v-card>
      <br />
    </v-flex>
  </v-layout>
</template>

<script>
const service = require('../services/userservice');

export default {
  Name: 'Login',
  props: ['user'],
  data: () => ({
    rules: require('../services/rules'),
    characterHeaders: [
      { text: 'Name', value: 'name' },
      { text: 'Sex', value: 'sex' },
    ],

    message: null,

    deletePrompt: false,
    deleteValid: false,
    deleteIsInProgress: false,
    confirmPassword: '',

    changePasswordExpand: false,
    changePasswordValid: false,
    changePasswordInProgress: false,
    currentPassword: '',
    newPassword1: '',
    newPassword2: '',
  }),

  methods: {
    validatePassword: function (v) {
      return this.newPassword1 == v || "Passwords don't match!";
    },

    deleteAccount: function () {
      this.deleteIsInProgress = true;
      this.message = null;

      service
        .delete(this.user, this.confirmPassword)
        .then(() => {
          this.$emit('deletedaccount');
        })
        .catch((ex) => {
          if (ex != undefined) {
            this.message = { type: 'error', text: 'Server error.' };
          } else {
            this.message = { type: 'error', text: 'Connection error.' };
          }
        })
        .then(() => {
          this.deleteIsInProgress = false;
        });
    },

    changePassword: function () {
      this.changePasswordInProgress = true;
      this.message = null;

      service
        .changePassword(this.user, this.currentPassword, this.newPassword1)
        .then(() => {
          this.message = { type: 'success', text: 'Password changed.' };
        })
        .catch((ex) => {
          if (ex == undefined) {
            this.message = { type: 'error', text: 'Wrong password.' };
          } else {
            this.message = { type: 'error', text: 'Connection error.' };
          }
        })
        .then(() => {
          this.changePasswordInProgress = false;
        });
    },
  },
};
</script>

<style scoped></style>
