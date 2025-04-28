const bcrypt = require('bcrypt');
const userPassword = 'user_password_entered_during_login'; // This is the password entered by the user trying to log in
const savedHash = '$2a$10$QvZWV4f4rzl8dDWSyIL1wuzobWqA7Pfro87LkF4Y/VGiYHwFu5m0.'; // The hashed password from the DB

bcrypt.compare(userPassword, savedHash, (err, result) => {
  if (result) {
    console.log('Password is correct!');
  } else {
    console.log('Password is incorrect!');
  }
});
