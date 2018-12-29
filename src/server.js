import express from 'express';
import logger from 'morgan';
import '@babel/polyfill';
import userRoutes from './routes/user.route';
import middlewares from './middlewares';

const app = express();

app.use(express.json({ limit: 1e6 }));
app.use(logger('dev'));

app.use(middlewares.handleEmptyPayload);
app.use(middlewares.contentTypeSet);
app.use(middlewares.contentTypejson);
app.use(middlewares.handleErrors);

app.use('/liskit/users/', userRoutes);

app.listen(process.env.SERVER_PORT);
