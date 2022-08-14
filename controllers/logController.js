import Exercise from "../models/exerciseModel.js";
import User from "../models/userModel.js";

const getLog = async (req, res) => {
	const { _id } = req.params;
	const { from, to, limit } = req.query;

	const user = await User.findById(_id).select("-__v");
	if (!user) {
		res.status(400).json({ msg: "No user found for this id" });
	}

	let dateQuery = {};
	let filter = {
		user: _id,
	};

	if (from) {
		let fromDate = new Date(from);
		if (fromDate && fromDate.toString() !== "Invalid Date") {
			dateQuery["$gte"] = fromDate;
		}
	}

	if (to) {
		let toDate = new Date(to);
		if (toDate && toDate.toString() !== "Invalid Date") {
			dateQuery["$lte"] = toDate;
		}
	}
	if (from || to) {
		filter.date = dateQuery;
	}
	const exercise = await Exercise.find(filter)
		.select("-user -_id -__v")
		.limit(parseInt(limit ?? 0));

	let a = [];
	if (exercise.length > 0) {
		a = exercise.map((el, i) => {
			let b = { ...el._doc };
			b.date = b.date.toDateString();
			return b;
		});
	}

	let result = { ...user._doc, count: a.length, log: a };

	res.status(200).json(result);
};

export default getLog;
