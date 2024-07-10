// import prisma client
const { validationResult } = require('express-validator');
const prisma = require('../prisma/client');
const bcrypt = require('bcryptjs');

// function findUsers
const findUsers = async (req, res) => {
    try {
        // get all users from database
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
            },
            orderBy: {
                id: 'desc',
            },
        });

        // send response
        res.status(200).send({
            success: true,
            message: 'Get all users successfully',
            data: users,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal server error',
        });
    }
}

// function createUser
const createUser = async (req, res) => {
    // periksa hasil validasi
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // jika ada error, kembalikan error ke user
        return res.status(422).json({
            success: false,
            message: 'Validation error',
            errors: errors.array(),
        });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try {
        // create new user
        const newUser = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            },
        });

        res.status(201).send({
            success: true,
            message: 'User created successfully',
            data: newUser,
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal server error',
        })
    }
}

// function findUserById
const findUserById = async (req, res) => {
    // get ID from params
    const { id } = req.params;

    try {
        // get user by ID
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id),
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        })

        // send response
        res.status(200).send({
            success: true,
            message: `Get user by ID :${id}`,
            data: user,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal server error',
        })
    }
}

// function updateUser
const updateUser = async (req, res) => {
    // get ID from params
    const { id } = req.params;

    // periksa hasil validasi
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // jika ada error, kembalikan error ke user
        return res.status(422).json({
            success: false,
            message: 'Validation error',
            errors: errors.array(),
        });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try {
        // update user
        const updatedUser = await prisma.user.update({
            where: {
                id: Number(id),
            },
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            },
        });

        // send response
        res.status(200).send({
            success: true,
            message: `Update user by ID :${id}`,
            data: updatedUser,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal server error',
        })
    }
};


// function deleteUser
const deleteUser = async (req, res) => {
    // get ID from params
    const { id } = req.params;

    try {

        // get user by ID
        const userId = await prisma.user.findUnique({
            where: {
                id: Number(id),
            },
        })

        if (!userId) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // delete user
        await prisma.user.delete({
            where: {
                id: Number(id),
            },
        })

        // send response
        res.status(200).send({
            success: true,
            message: `Delete user by ID :${id}`,
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal server error',
        })
    }
}


module.exports = { findUsers, createUser, findUserById, updateUser, deleteUser };