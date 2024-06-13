import { connect, set } from 'mongoose';
import { NODE_ENV, DB_HOST, DB_PORT, DB_DATABASE } from '@config';

export const dbConnection = async () => {
  const dbConfig = {
    url: `mongodb+srv://Namnguyenthanh:1234@cluster0.r59i10r.mongodb.net/ExamHub`,
  };

  if (NODE_ENV !== 'production') {
    set('debug', true);
  }

  await connect(dbConfig.url);
};
