import Lisk from '../models/lisk.model';

const list = (req, res) => {
  Lisk.find({ private: false })
    .sort({
      updated: -1,
    })
    .skip(0)
    .limit(10)
    .exec((error, lisks) => {
      if (error) {
        return res.status(500).json({
          error: true,
          code: '100',
          message: 'Error retreiving lisk list. Please try again later',
        });
      }
      return res.status(200).json({
        error: false,
        code: '000',
        message: 'Successfullly retrieved the lisk list',
        payload: {
          lisks,
        },
      });
    });
};

export default { list };
