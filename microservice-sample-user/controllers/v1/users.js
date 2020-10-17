const express = require('express');
const model = require('../../models/user.js');
const User = model.User;
const router = express.Router();

router.get('/', (req, res, next) => {
  (async () => {
    if (req.query.name) {
      const users = await User.find(
        { name: req.query.name },
        {},
        { sort: { name: 1 } }
      ).exec();
      res.status(200).json(users);
    } else {
      const users = await User.find().exec();
      res.status(200).json(users);
    }
  })().catch(next);
});

router.get('/:id', (req, res, next) => {
  (async () => {
    try {
      const user = await User.findById(req.params.id).exec();
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'NotFound' });
      }
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'BadRequest' });
    }
  })().catch(next);
});

router.post('/', (req, res, next) => {
  (async () => {
    try {
      const record = new User({
        name: req.body.name,
      });
      const savedRecord = await record.save();
      res.status(200).json(savedRecord);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'BadRequest' });
    }
  })().catch(next);
});

router.put('/:id', (req, res, next) => {
  (async () => {
    try {
      // idにloginUserを指定された場合は、ログインユーザー情報の登録or更新を行う
      if (req.params.id === 'loginUser') {
        const record = await User.findOneAndUpdate(
          { name: req.body.name },
          {
            name: req.body.name,
            avatarUrl: req.body.avatarUrl,
          },
          {
            new: true,
            upsert: true,
          }
        ).exec();
        res.status(200).json(record);
      } else {
        const record = await User.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
        }).exec();
        if (record) {
          res.status(200).json(record);
        } else {
          res.status(404).json({ error: 'NotFound' });
        }
      }
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'BadRequest' });
    }
  })().catch(next);
});

router.delete('/:id', (req, res, next) => {
  (async () => {
    try {
      const removedRecord = await User.findByIdAndDelete(req.params.id).exec();
      if (removedRecord) {
        res.status(200).json({});
      } else {
        res.status(404).json({ error: 'NotFound' });
      }
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'BadRequest' });
    }
  })().catch(next);
});

module.exports = router;
