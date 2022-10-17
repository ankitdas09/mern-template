import mongoose, { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import AppError from "../utils/appError.js";
const saltRounds = 10;
const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	token: {
		type: String,
	},
});

userSchema.pre("save", async function (next) {
	const user = this;
	try {
		if (user.isModified("password")) {
			const salt = await bcrypt.genSalt(saltRounds);
			const hash = await bcrypt.hash(this.password, salt);
			user.password = hash;
		}
		next();
	} catch (error) {
		next(error);
	}
});

userSchema.methods.comparePassword = async function (plainPassword) {
	try {
		const res = await bcrypt.compare(plainPassword, this.password);
		return res;
	} catch (error) {
		return false;
	}
};

userSchema.statics.login = async function (email, password) {
	try {
		const user = await this.findOne({ email });
		if (!user) throw new AppError(403, "Invalid email or password!");
		const auth = await user.comparePassword(password);
		if (!auth) throw new AppError(403, "Invalid email or password!");
		return user;
	} catch (error) {
		throw new AppError(500, error.message);
	}
};

const User = model("User", userSchema);
export default User;
