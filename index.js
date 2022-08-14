const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, "Please provide a username"],
		minlength: 1,
	},
});

const User = mongoose.model("User", userSchema);

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

const Exercise = mongoose.model("Exercise", exerciseSchema);

app.get("/api/users", async (req, res) => {
	const users = await User.find({});
	res.status(200).json(users);
});

app.post("/api/users", async (req, res) => {
	const { username } = req.body;
	if (!username) {
		res.status(400).json({"msg": "Please provide a username"});
	}
	const user = await User.create({ username });
	res.status(201).json(user);
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  const { _id } = req.params;
	const { description, duration, date } = req.body;
	if (!_id || !description || !duration) {
		res.status(400).json({"msg": "Please provide the user id, description, duration and date"});
	}
  const user = await User.findById(_id).select('-__v');
  if(!user){
    res.status(400).json({"msg": "No user found for this id"});
  }
  
  let dateData;
  if(date){
    dateData = new Date(date).setHours(0, 0, 0, 0)
  }else{
    dateData = new Date(Date.now()).setHours(0, 0, 0, 0)
  }
	const exercise = await Exercise.create({ user: _id, description, duration, date: dateData });
	res.status(201).json({...user._doc, description: exercise.description, duration: exercise.duration, date: exercise.date.toDateString()});
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const { _id } = req.params;
  const {from, to, limit}=req.query;
  
  const user = await User.findById(_id).select('-__v');
  if(!user){
    res.status(400).json({"msg": "No user found for this id"});
  }

  let limitQuery = limit ?? 0;
  let dateQuery = {};
  let filter= {
    user: _id
  }
  console.log("From" + from)
  if(from){
    console.log("In From")
    let fromDate = new Date(from);
    if(fromDate && fromDate.toString() !== 'Invalid Date'){
      console.log("In Valid From")
     dateQuery['$gte'] = fromDate; 
    }
  }
  console.log("To" + to);
  if(to){
    console.log("In To")
    let toDate = new Date(to);
    if(toDate && toDate.toString() !== 'Invalid Date'){
      console.log("In Valid To")
     dateQuery['$lte'] = toDate; 
    }
  }
  if(from || to){
    filter.date = dateQuery
  }
	const exercise = await Exercise.find(filter).select('-user -_id -__v').limit(parseInt(limitQuery));

  let a = [];
  if(exercise.length > 0){
    a = exercise.map((el,i)=>{
      let b = {...el._doc};
      b.date = b.date.toDateString()
      return b;
    });
  }

  let result = {...user._doc, count: a.length ,log:  a};

	res.status(200).json(result);
});

mongoose.connect(process.env.MONGO_URI);
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
