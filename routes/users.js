var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users');

// GET all users (except soft deleted)
router.get('/', async function (req, res, next) {
  let users = await userModel.find({
    isDeleted: false
  }).populate({
    path: 'role',
    select: 'name description'
  });
  res.send(users);
});

// GET user by id
router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let user = await userModel.findById(id).populate({
      path: 'role',
      select: 'name description'
    });
    if (!user || user.isDeleted) {
      return res.status(404).send({ message: 'ID NOT FOUND' });
    }
    res.send(user);
  } catch (error) {
    res.status(404).send({ message: 'ID NOT FOUND' });
  }
});

// CREATE user
router.post('/', async function (req, res, next) {
  try {
    let newUser = new userModel({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      status: req.body.status,
      role: req.body.role,
      loginCount: req.body.loginCount
    });
    await newUser.save();
    res.send(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

// UPDATE user
router.put('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let user = await userModel.findById(id);
    if (!user || user.isDeleted) {
      return res.status(404).send({ message: 'ID NOT FOUND' });
    }

    let keys = Object.keys(req.body);
    for (const key of keys) {
      user[key] = req.body[key];
    }
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// SOFT DELETE user
router.delete('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let user = await userModel.findById(id);
    if (!user || user.isDeleted) {
      return res.status(404).send({ message: 'ID NOT FOUND' });
    }

    user.isDeleted = true;
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(404).send({ message: 'ID NOT FOUND' });
  }
});

// Enable account by email + username
router.post('/enable', async function (req, res, next) {
  let result = await userModel.findOneAndUpdate(
    {
      email: req.body.email,
      username: req.body.username,
      isDeleted: false
    },
    {
      status: true
    },
    {
      new: true
    }
  );

  if (!result) {
    return res.status(404).send({ message: 'email hoac username khong dung' });
  }
  res.send(result);
});

// Disable account by email + username
router.post('/disable', async function (req, res, next) {
  let result = await userModel.findOneAndUpdate(
    {
      email: req.body.email,
      username: req.body.username,
      isDeleted: false
    },
    {
      status: false
    },
    {
      new: true
    }
  );

  if (!result) {
    return res.status(404).send({ message: 'email hoac username khong dung' });
  }
  res.send(result);
});

module.exports = router;
