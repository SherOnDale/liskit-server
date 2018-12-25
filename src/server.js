import express from 'express';
import logger from 'morgan';
import '@babel/polyfill';
import userRoutes from './routes/user.route';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));

app.use('/liskit/user/', userRoutes);

app.listen(process.env.SERVER_PORT);
