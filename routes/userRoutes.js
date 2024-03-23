const express = require('express');
const { addUser, deleteUser, getAllUsers, getUser, updateUser } = require('../controllers/userController');
const router = express.Router();

router.route('/').get(getAllUsers).post(addUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
module.exports = router;
