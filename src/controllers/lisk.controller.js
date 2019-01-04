import Lisk from '../models/lisk.model';

const list = (req, res) => {
  Lisk.find({}, (error, lisks) => {
    if (error) {
      return res.status(500).json({
        error: true,
        message: 'Error retreiving lisk list. Please try again later',
      });
    }
    return res.status(200).json({
      error: false,
      message: 'Successfullly retrieved the lisk list',
      payload: {
        lisks,
      },
    });
  });
};

export default { list };
