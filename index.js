const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { success, error } = require("consola");
// const authRoute = require('./Routes/routes');
const DB = require('./DB/user');

dotenv.config();

//initialize express.
const app = express();

app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Set the front-end folder to serve public assets.
// app.use(express.static('public'));

//set route middleware
// app.use('/', authRoute);

//route to see the data in the database
app.post('/getCertificate', async(req, res) => {
    console.log(req.body);
    const user = {
        course: req.body.course,
        phoneNo: req.body.phoneNo
    };
    DB.certificate.find(user, function(err, foundData) {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            console.log(foundData);
            if (foundData.length == 0) {
                res.send("No Data Found")
            } else if (foundData.length == 1) {
                var link = foundData[0]["driveLink"]
                res.redirect(link);
            } else {
                res.send("Multiple Data Found")
            }
        }
    });

});

//route to post user details to db
app.post('/certificate', async(req, res) => {
    const record = new DB.certificate({
        course: req.body.course,
        phoneNo: req.body.phoneNo,
        driveLink: req.body.driveLink
    });

    DB.certificate.find({ course: req.body.course, phoneNo: req.body.phoneNo }, async function(err, foundData) {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            if (foundData.length == 0) {
                const saveRecord = await record.save();
                res.send(saveRecord);
            } else {
                res.send("Record Already Exists.");
            }
        }
    });

});


app.get('/lfc/dataentry', function(req, res) {
    // res.sendFile(path('dataentry.html'));
    return res.render('certificates', { db_data: "first", message: "" });
});


// Set up a route for index.html.
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

// Start the server.
const startApp = async() => {
    try {
        // Connection With DB
        await mongoose.connect(
            process.env.MONGODB_URI, {
                useUnifiedTopology: true,
                useNewUrlParser: true
            }
        );

        success({
            message: `Successfully connected with the Database \n${process.env.MONGODB_URI}`,
            badge: true
        });

        const port = process.env.PORT || 5000
            // Start Listenting for the server on PORT
        app.listen(port, () =>
            success({ message: `Server started on PORT ${port}`, badge: true })
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