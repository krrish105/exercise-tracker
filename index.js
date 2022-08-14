import express from "express";
import bodyParser from "body-parser";
const app = express();
import cors from "cors";
import { config } from "dotenv";
config({ path: "./.env" });
import connect from "./database/connect.js";
import userRouter from "./routes/userRouter.js";
import exerciseRouter from "./routes/exerciseRouter.js";
import logRouter from "./routes/logRouter.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/views/index.html");
});

app.use("/api/users", userRouter);
app.use("/api/users/:_id/exercises", exerciseRouter);
app.use("/api/users/:_id/logs", logRouter);

const port = process.env.PORT || 3000;
const start = async () => {
	try {
		await connect(process.env.MONGO_URI);
		app.listen(port, console.log(`Your app is listening on port ${port}`));
	} catch (error) {
		console.log(error);
	}
};

start();
