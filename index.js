// import express
const express = require('express')

// import CORS
const CORS = require('cors')

// import body-parser
const bodyParser = require('body-parser')

// import routes
const router = require('./routes')

// init app
const app = express()

// import dotenv
require('dotenv').config()

// use cors
app.use(CORS())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// define port
const port = process.env.PORT;

// route
app.get('/', (req, res) => {
    res.send('build with express')
})

// define routes
app.use('/api', router)

// start server
app.listen(port, () =>{
    console.log(`Server started on port :${port}`)
})