import jwt from "jsonwebtoken";

const createToken = (id) => {
	return jwt.sign(
		{
			id: id,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: 60 * 60,
		}
	);
};

export default createToken;
