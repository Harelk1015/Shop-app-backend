import mongoose from 'mongoose';

mongoose
	.connect(
		`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1szjm.mongodb.net/shopApp`,
	)
	.then(() => {
		console.log('DB Connected');
	})
	.catch((e: typeof mongoose.Error) => {
		console.log(e);
	});
