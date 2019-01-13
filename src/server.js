import express from 'express';
import logger from 'morgan';
import mongoose from 'mongoose';
import '@babel/polyfill';
import userRoutes from './routes/user.route';
import liskRoutes from './routes/lisk.route';
import jojiCoinUserRoutes from './routes/joji-coin/user.route';
import middlewares from './middlewares';

const app = express();

mongoose.set('useCreateIndex', true);
mongoose
  .connect(
    `${process.env.MONGO_PROTOCOL}://${process.env.MONGO_HOSTNAME}/${process.env.MONGO_DB}`,
    { useNewUrlParser: true },
  )
  .then(() => console.log('Connected to database'))
  .catch(error => console.error(error));

app.use(express.json({ limit: 1e6 }));
app.use(logger('dev'));

app.use(middlewares.handleEmptyPayload);
app.use(middlewares.contentTypeSet);
app.use(middlewares.contentTypejson);
app.use(middlewares.handleErrors);

app.use('/liskit/users/', userRoutes);
app.use('/liskit/lisks/', liskRoutes);
app.use('/joji/users', jojiCoinUserRoutes);

app.listen(process.env.SERVER_PORT);
