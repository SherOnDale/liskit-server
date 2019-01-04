import express from 'express';
import liskCtrl from '../controllers/lisk.controller';

const router = express.Router();

router.route('/').get(liskCtrl.list);

export default router;
