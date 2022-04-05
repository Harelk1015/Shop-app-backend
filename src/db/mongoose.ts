import mongoose from 'mongoose';

mongoose
  .connect(
    'mongodb+srv://user:ySuVZNb4Jq90JRg3@cluster0.1szjm.mongodb.net/shopApp'
  )
  .then(() => {
    console.log('DB Connected');
  })
  .catch((e: typeof mongoose.Error) => {
    console.log(e);
  });
