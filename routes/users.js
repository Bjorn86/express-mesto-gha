// IMPORT PACKAGES
const router = require('express').Router();

// IMPORT CONTROLLERS
const {
  getAllUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

// GET ALL USERS ROUTE
router.get('/', getAllUsers);

// GET USER ROUTE
router.get('/:userId', getUser);

// CREATE USER ROUTE
router.post('/', createUser);

// UPDATE USER INFO
router.patch('/me', updateUserInfo);

// UPDATE USER AVATAR
router.patch('/me/avatar', updateUserAvatar);

// MODULE EXPORT
module.exports = router;
