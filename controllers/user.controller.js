import AppError from "../utils/appError.js";
import User from "../models/user.model.js";
import logger from "../utils/logger.js";
import jwt from "jsonwebtoken";
import createToken from "../utils/createJWT.js";

export const loginController = async (req, res, next) => {
	const { email, password } = req.body;
	const user = await User.login(email, password);
	const signed = createToken(user._id);
	res.json({
		success: true,
		token: signed,
	});
};
