// import express validator
const { body } = require('express-validator');

// definisikan valudasi book
const validateBook = [
    body('code').notEmpty().withMessage('Code is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('author').notEmpty().withMessage('Author is required'),
    body('stock').isNumeric().notEmpty().withMessage('Stock is required'),
]

module.exports = { validateBook }