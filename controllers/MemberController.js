// import prisma client
const prisma = require('../prisma/client');

// import validationResult form express-validator
const { validationResult } = require('express-validator');

// function createMember
const createMember = async (req, res) => {
    // periksa hasil validasi
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // jika ada error, kembalikan error ke pengguna
        return res.status(422).json({
            success: false,
            message: 'Validation error',
            errors: errors.array(),
        });
    }

    try {
        // insert data
        const member = await prisma.member.create({
            data: {
                code: req.body.code,
                name: req.body.name,
            }
        });

        res.status(200).send({
            success: true,
            message: 'Member created successfully',
            data: member,
        })
    }catch(error){
        res.status(500).send({
            success: false,
            message: 'Internal server error'
        });
    }
};

// find all members
const findAllMembers = async (req, res) => {
    try{
        // get all members from database
        const members = await prisma.member.findMany({
            include: {
                rentals: {
                    where: {
                        returnedAt: null
                    }
                }
            }
        });

        const membersWithBorrowedCount = members.map(member => {
            return {
                ...member,
                borrowCount: member.rentals.length
            };
        });

        // send response
        res.status(200).send({
            success: true,
            message: 'Get all members successfully',
            data: membersWithBorrowedCount,
        });
    } catch(error) {
        res.status(500).send({
            success: false,
            message: 'Internal server error'
        });
    }
}

// pinjam buku
const borrowBook = async (req, res) => {
    const memberId = parseInt(req.params.id)
    const  { bookId } = req.body;

    const member = await prisma.member.findUnique({
        where: { id: memberId},
        include: { rentals: true},
    });

    const book = await prisma.book.findUnique({
        where: {id: bookId},
    });

    if (!member || !book){
        return res.status(404).send({
            success: false,
            message: 'Member or book not found'
        });
    }

    // kondisi jika member belum mengembalikan buku tetapi akan melakukan peminjaman kembali
    const borrowedBooks = member.rentals.filter(rental => !rental.returnedAt);
    if (borrowedBooks.length >= 2){
        return res.status(200).send({
            success: false,
            message: 'Member sudah meminjam lebih dari 2 buku',
        })
    }

    // kondisi member yang kena penalty yang akan meminjam, jika member belum melewati waktu penalty 3 hari
    if (new Date() < new Date(member.penaltyEnd)){
        return res.status(200).send({
            success: false,
            message: 'Member saat ini masih terkena penalty',
        });
    }

    const statusBuku =  await prisma.rental.findFirst({
        where: {
            bookId,
            returnedAt: null,
        },
    });

    if (statusBuku) {
        return res.status(200).send({
            success: false,
            message: 'Buku sudah dipinjam',
        });
    }

    const rental = await prisma.rental.create({
        data: {
            memberId,
            bookId,
            borrowedAt: new Date(),
        },
    });

    // send response
    res.status(200).send({
        success: true,
        message: 'Buku berhasil dipinjam',
        data: rental,
        // include: {member, book}
    });

};

// pengembalian buku
const returnBook = async (req, res) => {
    const memberId = parseInt(req.params.id);
    const  { bookId } = req.body;

    const member = await prisma.member.findUnique({
        where: { id: memberId},
    });

    const book = await prisma.book.findUnique({
        where: {id: bookId},
    });

    const rental = await prisma.rental.findFirst({
        where: {
            memberId,
            bookId,
            returnedAt: null,
        },
    });

    if (!rental) {
        return res.status(404).send({
            success: false,
            message: 'Rental not found',
        });
    }

    const borrowedAt = new Date(rental.borrowedAt);
    // const now = new Date("July 20, 2024 00:00:00");
    const now = new Date();

    // difference day
    const diff = Math.floor((now - borrowedAt)) / (1000 * 60 * 60 * 24)

    // console.log(diff)

    let penaltyEnd = null;
    if (diff > 7) {
        // 3 days penalty
        penaltyEnd = new Date(now.setDate(now.getDate()+ 3 )); 
    }

    await prisma.rental.update({
        where: { id: rental.id},
        data: {returnedAt: new Date()},
    });

    if (penaltyEnd) {
        await prisma.member.update({
            where: { id: memberId},
            data: {penaltyEnd},
        });
    }

    // send response
    res.status(200).send({
        success: true,
        message: 'Buku berhasil dikembalikan',
        data: rental,
        include: {member, book}
    });
}

module.exports = { createMember, findAllMembers, borrowBook, returnBook };
