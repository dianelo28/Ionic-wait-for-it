var mongoose = require("mongoose"),
	Schema = mongoose.Schema;

var User = require("./user.js");

var CommentSchema = new Schema({
	comments: {type: String, expires: 60*15},
	author: [{
		type: Schema.Types.ObjectId,
		ref: "User" 
	}]
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;