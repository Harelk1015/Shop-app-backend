import mongoose from 'mongoose';
import ServerGlobal from '../server-global';

mongoose
	.connect(
		`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1szjm.mongodb.net/shopApp`,
	)
	.then(() => {
		ServerGlobal.getInstance().logger.info(
			'MongoDB database connection done successfully',
		);
	})
	.catch((e: typeof mongoose.Error) => {
		ServerGlobal.getInstance().logger.error(
			`MongoDB database connection has failed with error: ${e}`,
		);
	});
