// import prisma client
const prisma = require('../prisma/client');

// import validationResult form express-validator
const { validationResult } = require('express-validator');

// function createBook
const createBook = async (req, res) => {
    // periksa hasil validasi
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        // jika ada error, kembalikan error ke pengguna
        return res.status(422).json({
            success: false,
            message: 'Validation error',
            errors: errors.array(),
        }); 
    }

    try{
        // insert data
        const book = await prisma.book.create({
            data: {
                code: req.body.code,
                title: req.body.title,
                author: req.body.author,
                stock: req.body.stock
            }
        })

        res.status(200).send({
            success: true,
            message: 'Book created successfully',
            data: book,
        })
    }catch(error){
        res.status(500).send({
            success: false,
            message: 'Internal server error',
        })
    }


}

// Menampilkan semua buku yang ada dan jumlahnya
const showAvailableBooks = async (req, res) => {
    const books = await prisma.book.findMany();
    const rentals = await prisma.rental.findMany({
        where: {returnedAt: null}
    });

    const booksWithAvailableBooks = books.map(book => {
        const rentedCount = rentals.filter(rental => rental.bookId === book.id).length;
        return {
            ...book,
            availableQuantity: book.stock - rentedCount
        }
    });

    res.status(200).send({
        success: true,
        message: 'Available books',
        data: booksWithAvailableBooks,
    });
}




module.exports = {createBook, showAvailableBooks}