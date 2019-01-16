import express from 'express';
import userCtrl from '../../controllers/joji-coin/user.controller';
import authCtrl from '../../controllers/joji-coin/auth.controller';

const router = express.Router();

router
  .route('/')
  .get(userCtrl.list)
  .post(userCtrl.create, authCtrl.signin);

export default router;
