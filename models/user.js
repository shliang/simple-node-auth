var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	email: {
		type: String,
		required: true
	},	
	
	passwordDigest: {
		type: String,
		required: true
	},	
	
	sessionToken: {
		type: String
	},
	
	created_at: {
		type: Date,
		default: Date.now
	}
});

UserSchema.methods.setPasswordDigest = function(password, cb) {
	bcrypt.genSalt(function(err, salt) {
		bcrypt.hash(password, salt, cb);
	});
};

UserSchema.methods.veryfyPassword = function(password) {
	return bcrypt.compareSync(password, this.passwordDigest);
};

UserSchema.methods.resetToken = function(cb) {
	var user = this;
	crypto.randomBytes(64, function(err, buf) {
		user.sessionToken = buf.toString("hex");
		user.save(cb);
	})
}

module.exports = mongoose.model('User', UserSchema);