var mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	bcrypt = require("bcrypt"),
	salt = bcrypt.genSaltSync(10);

// var Comment = require("./comment.js");
var Business = require("./business.js");


var UserSchema = new Schema({
	email: {type: String, required: true},
	passwordDigest: {type: String, required: true},
	points: Number,
	// comments: [Comment.schema],
	favorites: [{
		type: Schema.Types.ObjectId,
		ref: "Business"
	}]
});


UserSchema.statics.createSecure = function(email, password, callback) {
	var that = this;
	bcrypt.genSalt(function(err, salt) {
		bcrypt.hash(password, salt, function(err, hash) {
			that.create({
				email: email,
				passwordDigest: hash},
				callback);
		});
	});
};

UserSchema.statics.authenticate = function(email, password, callback) {
	this.findOne({email: email}, function(err, user) {
		if (user === null) {
			callback(null);
		} else if (user.checkPassword(password)) {
			callback(null, user);
		} else {
			callback(null);
		};
	});
};

UserSchema.methods.checkPassword = function(password) {
	return bcrypt.compareSync(password, this.passwordDigest);
};

var User = mongoose.model("User", UserSchema);
module.exports = User;