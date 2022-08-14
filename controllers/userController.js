import User from "../models/userModel.js";

const getUsers = async (req, res) => {
	const users = await User.find({});
	res.status(200).json(users);
};

const createUser = async (req, res) => {
	const { username } = req.body;
	if (!username) {
		res.status(400).json({ msg: "Please provide a username" });
	}
	const user = await User.create({ username });
	res.status(201).json(user);
};

export { getUsers, createUser };
