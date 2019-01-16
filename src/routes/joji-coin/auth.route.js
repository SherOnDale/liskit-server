import express from 'express';
import authCtrl from '../../controllers/joji-coin/auth.controller';

const router = express.Router();

router
  .route('/')
  .get(authCtrl.signout)
  .post(authCtrl.signin);

export default router;
