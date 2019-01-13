import express from 'express';
import userCtrl from '../../controllers/joji-coin/user.controller';

const router = express.Router();

router.route('/').post(userCtrl.create);

export default router;
