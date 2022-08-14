import Exercise from "../models/exerciseModel.js";
import User from "../models/userModel.js";

const createExercise = async (req, res) => {
	const { _id } = req.params;
	const { description, duration, date } = req.body;

	if (!_id || !description || !duration) {
		return res.status(400).json({
			msg: "Please provide the user id, description, duration and date",
		});
	}
	const user = await User.findById(_id).select("-__v");
	if (!user) {
		return res.status(400).json({ msg: "No user found for this id" });
	}

	let dateData;
	if (date) {
		dateData = new Date(date).setHours(0, 0, 0, 0);
	} else {
		dateData = new Date(Date.now()).setHours(0, 0, 0, 0);
	}
	const exercise = await Exercise.create({
		user: _id,
		description,
		duration,
		date: dateData,
	});
	res.status(201).json({
		...user._doc,
		description: exercise.description,
		duration: exercise.duration,
		date: exercise.date.toDateString(),
	});
};

export default createExercise;
