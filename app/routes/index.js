//import express
const express = require('express')

//init express router
const router = express.Router();

// import verify token
const authMiddleware = require('../middlewares/auth');

//import register controller
const registerController = require('../controllers/RegisterController');

// import login controller
const loginController = require('../controllers/LoginController');

// import user controller
const userController = require('../controllers/UserController');

// import member controller
const memberController = require('../controllers/MemberController');

// import book controller
const bookController = require('../controllers/BookController');

// import health controller
const healthController = require('../controllers/HealtController');

//import helper validate register and login
const { validateRegister, validateLogin } = require('../utils/validators/auth');

// import helper validate user
const { validateUser } = require('../utils/validators/user');

// import helper validate member
const { validateMember } = require('../utils/validators/member');

// import helper validate book
const { validateBook } = require('../utils/validators/book');

router.get('/ping', healthController.ping);


//define route for register
router.post('/register', validateRegister, registerController.register);

// define route for login
router.post('/login', validateLogin, loginController.login);

// ============ router users =================

// define route for user
router.get('/admin/users', authMiddleware, userController.findUsers);

// define route for user create
router.post('/admin/users', authMiddleware, validateUser, userController.createUser);

// define router for user by id
router.get('/admin/users/:id', authMiddleware, userController.findUserById);

// define route for user update
router.put('/admin/users/:id', authMiddleware, validateUser, userController.updateUser);

// define route for user delete
router.delete('/admin/users/:id', authMiddleware, userController.deleteUser);

// ============ router members =================

// define route for member create
router.post('/admin/members', authMiddleware, validateMember, memberController.createMember);

// define route for get all members
router.get('/admin/members', authMiddleware, memberController.findAllMembers);

// define route for pinjam buku
router.post('/admin/members/:id/borrow', authMiddleware, memberController.borrowBook);

// define route for kembalikan buku
router.post('/admin/members/:id/return', authMiddleware, memberController.returnBook);

// ============ router book ====================

// define route for create book
router.post('/admin/books', authMiddleware, validateBook, bookController.createBook)

// define route for get all books available
router.get('/admin/books', authMiddleware, bookController.showAvailableBooks)

//export router
module.exports = router