// import express
const express = require('express')

// import moment-timezone
const moment = require('moment-timezone');

// import CORS
const CORS = require('cors')

// import body-parser
const bodyParser = require('body-parser')

// import routes
const router = require('./routes')

// import swagger
const setupSwagger   = require('./swagger')


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

// set UTC+7
moment.tz.setDefault('UTC+7')


// Serve Swagger UI
setupSwagger(app);

// define routes
app.use('/api', router)

// start server
app.listen(port, () => {
    console.log(`Server started on port :${port}`)
})