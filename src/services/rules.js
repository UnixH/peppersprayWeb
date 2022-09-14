exports.email = [
  (v) => !!v || 'E-mail is required.',
  (v) =>
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(v) ||
    'E-mail must be valid.',
];

exports.password = [
  (v) => !!v || 'Password is required.',
  (v) => v.length >= 6 || 'Minimum length is 6 characters',
];

exports.passwordMatch = function (cb) {
  return this.password.concat([(v) => v == cb() || 'Passwords should match.']);
};
