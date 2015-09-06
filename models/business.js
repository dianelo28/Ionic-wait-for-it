var mongoose = require("mongoose"),
	Schema = mongoose.Schema;

var Comment = require("./comment.js");

var BusinessSchema = new Schema({
	business_id: {type: String, require: true},
	twoWait: {type: Number, expires: 60 * 15},
	fourWait: {type: Number, expires: 60 * 15},
	fiveWait: {type: Number, expires: 60 * 15},
	comments: [Comment.schema]
});

var Business = mongoose.model("Business", BusinessSchema);

module.exports = Business;