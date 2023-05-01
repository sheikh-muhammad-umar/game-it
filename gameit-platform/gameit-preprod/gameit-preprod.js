const express = require('express');
const path = require('path')
const port = 8888;
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const mysql = require('mysql2');
const { convertToObject } = require('typescript');
const AUTH_API = 'http://api.gameit.ai:9080';

const mailjetApiKey = "266655bcdfca162063dd4efeada6159a";
const mailjetSecretKey = "7cb0d140277447ba2e5e508e593cdcfa";

var gameitTech = 'tech@gameit.ai';
var gameitInfo = 'info@gameit.ai';

var config = {
    host: 'api.gameit.ai',
    user: 'root',
    password: 'F3r4!ttr',
    database: 'preregister',
    port: 3306
};

//const conn = new mysql.createConnection(config);
const pool = mysql.createPool(config);
/*
conn.connect(
    function(err) {
        if (err) {
            console.log("!!! Cannot connect !!! Error:");
            throw err;
        } else {
            console.log("Connection established.");
        }
    });
*/
function sendMail(data) {
    const mailjet = require('node-mailjet')
        .connect(mailjetApiKey, mailjetSecretKey)
    const request = mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [{
                "From": {
                    "Email": "noreply@gameit.ai",
                    "Name": "GameIT Pre-registration"
                },
                "To": [{
                    "Email": gameitTech,
                    "Name": "GameIT Tech"
                }],
                "TemplateID": 3484793,
                "TemplateLanguage": true,
                "Subject": "New pre-registration",
                "Variables": data
            }]
        })
    request
        .then((result) => {
            console.log(result.body)
        })
        .catch((err) => {
            console.log(err.statusCode)
        })
};

function sendMailVisitor(data) {
    console.log(data.emailId);
    const mailjet = require('node-mailjet')
        .connect(mailjetApiKey, mailjetSecretKey)
    const request = mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [{
                "From": {
                    "Email": "noreply@gameit.ai",
                    "Name": "GameIT"
                },
                "To": [{
                    "Email": data.emailId,
                    "Name": data.firstName + ' ' + data.lastName
                }],
                "TemplateID": 3540840,
                "TemplateLanguage": true,
                "Subject": "Thank you for registering",
                "Variables": {
                    "firstname": data.firstName
                }
            }]
        })
    request
        .then((result) => {
            console.log(result.body)
        })
        .catch((err) => {
            console.log(err.statusCode)
        })
};

function sendContactMail(data) {
    const mailjet = require('node-mailjet')
        .connect(mailjetApiKey, mailjetSecretKey)
    const request = mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [{
                "From": {
                    "Email": "noreply@gameit.ai",
                    "Name": "GameIT Contact"
                },
                "To": [{
                    "Email": gameitInfo,
                    "Name": "GameIT Info"
                }],
                "TemplateID": 3485426,
                "TemplateLanguage": true,
                "Subject": "GameIT Contact Message Received",
                "Variables": data
            }]
        })
    request
        .then((result) => {
            console.log(result.body)
        })
        .catch((err) => {
            console.log(err.statusCode)
        })
};


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(express.static('./dist/gameit-app'));

app.get('/api/auth/confirm-account', (req, res) => {
    console.log(req.originalUrl);

    axios.get(AUTH_API + req.originalUrl)
        .then(function(response) {
            res.send(response.data);
        })
        .catch(function(error) {
            console.log(error.response.data);
            res.send(error.response.data);
        });

});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/gameit-app/index.html'));
});

app.post('/api/auth/signin', (req, res) => {
    axios.post(AUTH_API + '/api/auth/login', req.body)
        .then(function(response) {
            console.log(response.data);
            res.send(response.data);
        })
        .catch(function(error) {
            console.log(error.response.data);
            res.status(401);
            res.send(error.response.data);
        });
});

app.post('/api/auth/signup', (req, res) => {
    console.log(req.body);
    axios.post(AUTH_API + '/api/auth/register', req.body)
        .then(function(response) {
            console.log(response.data);
            res.send(response.data);
        })
        .catch(function(error) {
            console.log(error.response.data);
            res.status(401);
            res.send(error.response.data);
        });

});

app.post('/api/auth/preregister', (req, res) => {
    console.log(req.body);
    pool.query(mysql.format('INSERT INTO visitors SET ?;', req.body),
        function(err, results) {
            msg = "Unexpected error, please try again later";
            if (err) {
                console.log(err);
                if (err.code === 'ER_DUP_ENTRY')
                    msg = "Email address has been used for registration before";
                res.status(500);
                res.send({ "message": msg });
            } else {
                console.log('Inserted ' + results.affectedRows + ' row(s).');
                sendMail(req.body);
                sendMailVisitor(req.body);
                res.status(200);
                res.send({ "message": "success" });
            }

        })

});

app.post('/api/auth/contact', (req, res) => {
    console.log(req.body);
    sendContactMail(req.body);
    res.status(200);
    res.send({ "message": "success" });
});



module.exports = app;