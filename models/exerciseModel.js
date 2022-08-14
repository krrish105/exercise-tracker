import mongoose from "mongoose";
const { Schema, model } = mongoose;

const exerciseSchema = new mongoose.Schema({
	user: {
		type: String,
		required: [true, "Please provide a username"],
	},
	description: {
		type: String,
		required: [true, "Please provide a description"],
		minlength: 1,
	},
	duration: {
		type: Number,
		required: [true, "Please provide the duration"],
		minlength: 1,
	},
	date: {
		type: Date,
	},
});

export default mongoose.model("Exercise", exerciseSchema);
