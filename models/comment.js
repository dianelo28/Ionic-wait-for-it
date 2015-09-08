var mongoose = require("mongoose"),
	Schema = mongoose.Schema;

var User = require("./user.js");

var CommentSchema = new Schema({
	createdAt: { type: Date, default: Date.now },
	comments: {type: String, require: true}
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;