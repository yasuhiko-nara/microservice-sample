const express = require('express');
const model = require('../../models/follow.js');
const User = require('../../models/user.js').User;
const Follow = model.Follow;
const router = express.Router({ mergeParams: true });

router.get('/', (req, res, next) => {
  (async () => {
    if (!model.validateObjectId(req.params.id)) {
      res.status(400).json({ error: 'BadRequest' });
      return;
    }
    const records = await Follow.find({ userId: req.params.id }).exec();
    const followIds = records.map((follow) => follow.followId);
    const follows = await User.find({ _id: { $in: followIds } }).exec();
    res.status(200).json(follows);
  })().catch(next);
});

router.post('/', (req, res, next) => {
  (async () => {
    const follow = new Follow({
      userId: req.params.id,
      followId: req.body.followId,
    });
    const error = follow.validateSync();
    if (error) {
      res.status(400).json({ error: 'BadRequest' });
      return;
    }
    await follow.save();
    res.status(200).json({});
  })().catch(next);
});

router.delete('/', (req, res, next) => {
  (async () => {
    const result = await Follow.findOneAndDelete({
      userId: req.params.id,
      followId: req.query.followId,
    }).exec();
    if (result) {
      res.status(200).json({});
    } else {
      res.status(404).json({ error: 'NotFound' });
    }
  })().catch(next);
});

module.exports = router;
