import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
	username: {
		type: String,
		required: [true, "Please provide a username"],
		minlength: 1,
	},
});

export default model("User", userSchema);
