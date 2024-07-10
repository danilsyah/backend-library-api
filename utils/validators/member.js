// import express validator
const { body } = require('express-validator');

// import prisma
// const prisma = require('../../prisma/client');

// definisikan validasi untuk member
const validateMember = [
    body('code').notEmpty().withMessage('Code is required'),
    body('name').notEmpty().withMessage('Name is required'),
]

module.exports = { validateMember }