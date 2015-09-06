var mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	bcrypt = require("bcryptjs"),
	salt = bcrypt.genSaltSync(10);

var Comment = require("./comment.js");
var Business = require("./business.js");


var UserSchema = new Schema({
	facebookId: {type: String, index: true},
	email: {type: String, unique: true, lowercase: true},
	password: {type: String, select: false},
	accessToken: String,
	points: Number,
	comments: [Comment.schema],
	favorites: [{
		type: Schema.Types.ObjectId,
		ref: "Business"
	}]
});

var User = mongoose.model("User", UserSchema);
module.exports = User;