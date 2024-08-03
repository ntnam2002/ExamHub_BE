import mongoose, { connect, set } from 'mongoose';
import { NODE_ENV } from '@config';

export const dbConnection = async () => {
  const dbConfig = {
    url: `mongodb+srv://Namnguyenthanh:1234@cluster0.r59i10r.mongodb.net/ExamHub`,
  };

  if (NODE_ENV !== 'production') {
    set('debug', true);
  }
  mongoose.set('strictQuery', false);
  await connect(dbConfig.url);
};
