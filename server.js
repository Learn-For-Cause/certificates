const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { success, error } = require("consola");
const authRoute = require('./Routes/routes');

dotenv.config();

//initialize express.
const app = express();

app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Set the front-end folder to serve public assets.
app.use(express.static('static'));

//set route middleware
app.use('/', authRoute);

// Set up a route for index.html.
app.get('/', function(req, res) {
    res.sendFile(path.join('index.html'));
});

app.get('lfc/dataentry', function(req, res) {
    res.sendFile(path.join('dataentry.html'));
});


// Start the server.
const startApp = async() => {
    try {
        // Connection With DB
        await mongoose.connect(
            process.env.DB_CONNECT, {
                useUnifiedTopology: true,
                useNewUrlParser: true
            }
        );

        success({
            message: `Successfully connected with the Database \n${process.env.DB_CONNECT}`,
            badge: true
        });

        // Start Listenting for the server on PORT
        app.listen(process.env.PORT, () =>
            success({ message: `Server started on PORT ${process.env.PORT}`, badge: true })
        );
    } catch (err) {
        error({
            message: `Unable to connect with Database \n${err}`,
            badge: true
        });
        startApp();
    }
};

startApp();
