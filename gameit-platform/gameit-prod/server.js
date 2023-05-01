const express = require('express');
const path = require('path');
const port = 80;
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const mysql = require('mysql2');
const AUTH_API = 'http://gameit.ai:9080';

const mailjetApiKey = '266655bcdfca162063dd4efeada6159a';
const mailjetSecretKey = '7cb0d140277447ba2e5e508e593cdcfa';

var gameitTech = 'ali.cakici@gameit.ai';
var gameitInfo = 'ali.cakici@gameit.ai';

var config = {
    host: 'gameit.ai',
    user: 'root',
    password: 'F3r4!ttr',
    database: 'preregister',
    port: 3306,
};

const conn = new mysql.createConnection(config);

conn.connect(function (err) {
    if (err) {
        console.log('!!! Cannot connect !!! Error:');
        throw err;
    } else {
        console.log('Connection established.');
    }
});

function sendMail(data) {
    const mailjet = require('node-mailjet').connect(
        mailjetApiKey,
        mailjetSecretKey
    );
    const request = mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
            {
                From: {
                    Email: 'noreply@gameit.ai',
                    Name: 'GameIT Pre-registration',
                },
                To: [
                    {
                        Email: gameitTech,
                        Name: 'GameIT Tech',
                    },
                ],
                TemplateID: 3484793,
                TemplateLanguage: true,
                Subject: 'New pre-registration',
                Variables: data,
            },
        ],
    });
    request
        .then((result) => {
            // console.log(result.body);
        })
        .catch((err) => {
            console.log(err.statusCode);
        });
}

function sendContactMail(data) {
    const mailjet = require('node-mailjet').connect(
        mailjetApiKey,
        mailjetSecretKey
    );
    const request = mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
            {
                From: {
                    Email: 'noreply@gameit.ai',
                    Name: 'GameIT Contact',
                },
                To: [
                    {
                        Email: gameitInfo,
                        Name: 'GameIT Info',
                    },
                ],
                TemplateID: 3485426,
                TemplateLanguage: true,
                Subject: 'GameIT Contact Message Received',
                Variables: data,
            },
        ],
    });
    request
        .then((result) => {
            // console.log(result.body);
        })
        .catch((err) => {
            console.log(err.statusCode);
        });
}

// app.use(cors({
//     origin: ['*', 'http://localhost:4200/']
// }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());


app.use('/admin', express.static('./dist/gameit-admin'));
app.use('/gp', express.static('./dist/gameit-gp'));
app.use('/sp', express.static('./dist/gameit-sp'));
app.use('/', express.static('./dist/gameit-www'));

app.get('/api/auth/confirm-account', (req, res) => {
    // console.log(req.originalUrl);

    axios
        .get(AUTH_API + req.originalUrl)
        .then(function (response) {
            res.send(response.data);
        })
        .catch(function (error) {
            //console.log(error.response.data);
            res.send(error.response.data);
        });
});

app.get('/api/student/students', (req, res) => {
    axios
        .get(AUTH_API + '/api/student/students', {
            headers: {
                Cookie: req.headers['cookie'],
            },
        })
        .then(function (response) {
            res.send(response.data);
        })
        .catch(function (error) {
            res.send(error.response.data);
        });
});

app.get('/api/student/getstudent', (req, res) => {
    // console.log(req.query);
    axios
        .get(AUTH_API + '/api/student/studentDetail', {
            headers: {
                Cookie: req.headers['cookie'],
            },
            params: req.query,
        })
        .then(function (response) {
            console.log(response.data);
            res.send(response.data);
        })
        .catch(function (error) {
            res.send(error.response.data);
        });
});

app.get('/api/student/addGame', (req, res) => {
    // console.log(req.query);
    axios
        .get(AUTH_API + '/api/student/addGame', {
            headers: {
                Cookie: req.headers['cookie'],
            },
            params: req.query,
        })
        .then(function (response) {
            res.send(response);
        })
        .catch(function (error) {
            res.send(error.response);
        });
});

app.get('/api/student/gamesession', (req, res) => {
    axios
        .get(AUTH_API + '/api/student/gameSession', {
            headers: {
                Cookie: req.headers['cookie'],
            },
            params: req.query,
        })
        .then(function (response) {
            res.send(response.data);
        })
        .catch(function (error) {
            res.send(error.response.data);
        });
});

app.get('/api/student/deletestudent', (req, res) => {
    // console.log(req.query);
    axios
        .delete(AUTH_API + '/api/student/deleteStudent', {
            headers: {
                Cookie: req.headers['cookie'],
            },
            params: req.query,
        })
        .then(function (response) {
            // console.log(response.data);
            res.send(response.data);
        })
        .catch(function (error) {
            //console.log(error.response.data);
            res.send(error.response.data);
        });
});

app.get('/gp/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/gameit-gp/index.html'));
});

app.get('/sp/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/gameit-sp/index.html'));
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/gameit-www/index.html'));
});

app.post('/api/auth/signin', (req, res) => {
    axios
        .post(AUTH_API + '/api/auth/login', req.body, { withCredentials: true })
        .then(function (response) {
            res.setHeader('set-cookie', response.headers['set-cookie']);
            res.send(response.data);
        })
        .catch(function (error) {
            //console.log(error.response.data);
            res.status(401);
            res.send(error.response.data);
        });
});

app.post('/api/auth/signup', (req, res) => {
    // console.log(req.body);
    axios
        .post(AUTH_API + '/api/auth/register', req.body)
        .then(function (response) {
            // console.log(response.data);
            res.send(response.data);
        })
        .catch(function (error) {
            //console.log(error.response.data);
            res.status(401);
            res.send(error.response.data);
        });
});

app.post('/api/auth/preregister', (req, res) => {
    // console.log(req.body);

    conn.query(
        'INSERT INTO visitors SET ?;',
        req.body,
        function (err, results, fields) {
            msg = 'Unexpected error, please try again later';
            if (err) {
                console.log(err);
                if (err.code === 'ER_DUP_ENTRY')
                    msg = 'Email address has been used for registration before';
                res.status(500);
                res.send({ message: msg });
            } else {
                // console.log('Inserted ' + results.affectedRows + ' row(s).');
                sendMail(req.body);
                res.status(200);
                res.send({ message: 'success' });
            }
        }
    );
});

app.put('/api/student/savestudent', (req, res) => {
    // console.log(req.body, req.query);
    axios
        .put(AUTH_API + '/api/student/editStudent', req.body, {
            headers: {
                Cookie: req.headers['cookie'],
            },
            params: req.query,
        })
        .then(function (response) {
            res.send(response);
        })
        .catch(function (error) {
            res.send(error.response);
        });
});

app.put('/api/auth/saveuser', (req, res) => {
    // console.log(req.body, req.query);
    axios
        .put(AUTH_API + '/api/auth/editGuardian', req.body, {
            headers: {
                Cookie: req.headers['cookie'],
            },
            params: req.query,
        })
        .then(function (response) {
            res.send(response);
        })
        .catch(function (error) {
            res.send(error.response);
        });
});

app.post('/api/student/addstudent', (req, res) => {
    // console.log(req.body);
    axios
        .post(AUTH_API + '/api/student/students', req.body, {
            headers: {
                Cookie: req.headers['cookie'],
            },
        })
        .then(function (response) {
            // console.log(response.data);
            res.send(response.data);
        })
        .catch(function (error) {
            //console.log(error.response.data);
            res.status(401);
            res.send(error.response.data);
        });
});

app.post('/api/auth/contact', (req, res) => {
    // console.log(req.body);
    sendContactMail(req.body);
    res.status(200);
    res.send({ message: 'success' });
});

app.listen(port, () => {
    console.log('Server is listening on port ' + port);
});
