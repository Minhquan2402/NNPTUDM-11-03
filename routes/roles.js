var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/roles');
let userModel = require('../schemas/users');

// GET all roles (except soft deleted)
router.get('/', async function (req, res, next) {
  let roles = await roleModel.find({
    isDeleted: false
  });
  res.send(roles);
});

// GET role by id
router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let role = await roleModel.findById(id);
    if (!role || role.isDeleted) {
      return res.status(404).send({ message: 'ID NOT FOUND' });
    }
    res.send(role);
  } catch (error) {
    res.status(404).send({ message: 'ID NOT FOUND' });
  }
});

// GET all users of role id
router.get('/:id/users', async function (req, res, next) {
  try {
    let id = req.params.id;
    let role = await roleModel.findById(id);
    if (!role || role.isDeleted) {
      return res.status(404).send({ message: 'ROLE ID NOT FOUND' });
    }

    let users = await userModel.find({
      role: id,
      isDeleted: false
    }).populate({
      path: 'role',
      select: 'name description'
    });

    res.send(users);
  } catch (error) {
    res.status(404).send({ message: 'ROLE ID NOT FOUND' });
  }
});

// CREATE role
router.post('/', async function (req, res, next) {
  try {
    let newRole = new roleModel({
      name: req.body.name,
      description: req.body.description
    });
    await newRole.save();
    res.send(newRole);
  } catch (error) {
    res.status(400).send(error);
  }
});

// UPDATE role
router.put('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let role = await roleModel.findById(id);
    if (!role || role.isDeleted) {
      return res.status(404).send({ message: 'ID NOT FOUND' });
    }

    let keys = Object.keys(req.body);
    for (const key of keys) {
      role[key] = req.body[key];
    }
    await role.save();
    res.send(role);
  } catch (error) {
    res.status(400).send(error);
  }
});

// SOFT DELETE role
router.delete('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let role = await roleModel.findById(id);
    if (!role || role.isDeleted) {
      return res.status(404).send({ message: 'ID NOT FOUND' });
    }

    role.isDeleted = true;
    await role.save();
    res.send(role);
  } catch (error) {
    res.status(404).send({ message: 'ID NOT FOUND' });
  }
});
 
 module.exports = router;
