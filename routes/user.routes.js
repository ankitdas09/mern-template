import Router from "express";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import User from "../models/user.model.js";
import logger from "../utils/logger.js";
import bcrypt from "bcrypt";

import { loginController } from "../controllers/user.controller.js";

const router = Router();

router.get("/", (req, res, next) => {
	res.cookie("test", true, { httpOnly: true, maxAge: 1000 * 60 * 60 });
	res.send("users");
});

router.post(
	"/del",
	catchAsync(async (req, res, next) => {
		await User.deleteMany({});
		return res.sendStatus(200);
	})
);

router.post(
	"/",
	catchAsync(async (req, res, next) => {
		const data = req.body;
		const user = new User(data);
		await user.save();
		return res.json({
			success: true,
			message: "User saved",
		});
	})
);

router.post("/test", async (req, res) => {
	const salt = await bcrypt.genSalt(10);
	logger.info(salt);
	res.sendStatus(200);
});

router.post("/login", catchAsync(loginController));

export default router;
