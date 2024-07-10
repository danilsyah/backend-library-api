// import express validator
const { body } = require('express-validator');

// definisikan valudasi rental
const validateRental = [
    body('bookId').notEmpty().withMessage('BookID is required'),
    body('memberID').notEmpty().withMessage('MemberID is required'),
]

module.exports = { validateRental }