import config from "../config/default.js";
import logger from "../utils/logger.js";
import mongoose from "mongoose";
function connectDB() {
	mongoose
		.connect(config.mongoURI)
		.then(() => {
			logger.info("DB Connected");
		})
		.catch((e) => {
			logger.error("ERROR!");
			logger.error(e.message);
			process.exit(1);
		});
}
export default connectDB;
