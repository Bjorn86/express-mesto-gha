// IMPORT PACKAGES
const router = require('express').Router();

// IMPORT CONTROLLERS
const {
  getAllUsers,
  getUser,
  getUserInfo,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

// GET ALL USERS ROUTE
router.get('/', getAllUsers);

// GET USER INFO
router.get('/me', getUserInfo);

// GET USER ROUTE
router.get('/:userId', getUser);

// UPDATE USER INFO
router.patch('/me', updateUserInfo);

// UPDATE USER AVATAR
router.patch('/me/avatar', updateUserAvatar);

// MODULE EXPORT
module.exports = router;
