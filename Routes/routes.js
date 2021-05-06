const router = require('express').Router();
const DB = require('../DB/user');

//route to see the data in the database
router.post('/getCertificate', async(req, res) => {
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
router.post('/certificate', async(req, res) => {
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


module.exports = router;