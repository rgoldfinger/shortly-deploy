var mongoose = require('mongoose');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');

mongoose.connect('mongodb://localhost:27017/db');

var db = mongoose.connection;

var linkSchema = mongoose.schema({
  url: String ,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number,
  createdAt: Date,
  updatedAt: Date
});

linkSchema.methods.createHash = function(){
  var shasum = crypto.createHash('sha1');
  shasum.update(this.get('url'));
  this.set('code', shasum.digest('hex').slice(0, 5));
};

var userSchema = mongoose.schema({
  username: String,
  password: String,
  createdAt: Date,
  updatedAt: Date
});

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
    callback(isMatch);
  });
};

userSchema.methods.hashPassword = function(){
  bcrypt.hash(this.get('password'), null, function(hash) {
      this.set('password', hash);
    });
};



module.exports.Links = mongoose.model('Links', linkSchema);
module.exports.Users = mongoose.model('Users', userSchema);




// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('base_url', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });
