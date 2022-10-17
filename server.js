import "dotenv/config";
import cors from "cors";
import config from "./config/default.js";

import logger from "./utils/logger.js";
import catchAsync from "./utils/catchAsync.js";
import AppError from "./utils/appError.js";
import cookieParser from "cookie-parser";
import express from "express";

import connectDB from "./services/connectDB.js";

import userRoutes from "./routes/user.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api/users", userRoutes);

app.get("/healthcheck", (req, res) => {
	res.sendStatus(200);
});

app.get("/expresserror", (req, res) => {
	throw new AppError(401, "express error");
});

// use return next(err) from an async function
app.get(
	"/error",
	catchAsync(async (req, res, next) => {
		next(new AppError(300, "async error"));
		res.send("hi");
	})
);

app.use((err, req, res, next) => {
	logger.error(err.message ? err.message : err);
	const { status = 500, message = "Something went wrong!" } = err;
	return res.status(status).json({
		error: true,
		message: message,
	});
});

if (process.env.NODE_ENV === "production") {
	app.use(express.static("app/build"));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "../app", "build", "index.html"));
	});
}

const port = config.port;
app.listen(port, () => {
	logger.info(`listening on ${port}`);
});
