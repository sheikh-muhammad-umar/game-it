const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const mysql = require('mysql2');
const op = require('object-path');
const expressSession = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');

// Express app
const app = express();

// Sequelize integration
const db = require('./sequelize/init-models');

const env = op(process.env || {});

// const AUTH_API = 'http://api.gameit.ai:9080';
const AUTH_API = env.get('AUTH_API_URL', '');

const propertyId = '306976163';
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const analyticsDataClient = new BetaAnalyticsDataClient({
    keyFilename: `${__dirname}/gameit-platform-ksa-key.json`,
});

const mailjetApiKey = '266655bcdfca162063dd4efeada6159a';
const mailjetSecretKey = '7cb0d140277447ba2e5e508e593cdcfa';
const gameitTech = 'tech@gameit.ai';
const gameitInfo = 'info@gameit.ai';

const config = {
    host: env.get('DATABASE_HOST', ''),
    user: env.get('DATABASE_USERNAME', ''),
    password: env.get('DATABASE_PASSWORD', ''),
    database: env.get('DATABASE_DB1', ''),
    port: env.get('DATABASE_PORT', ''),
};

const conn = new mysql.createConnection(config);
const conn2 = new mysql.createConnection(config);

conn.connect(function (err) {
    if (err) {
        console.log('!!! Cannot connect preregister !!! Error:');
        throw err;
    } else {
        console.log('Connection established.');
    }
});
conn2.connect(function (err) {
    if (err) {
        console.log('!!! Cannot connect gameit-pf !!! Error:');
        throw err;
    } else {
        console.log('Connection established.');
    }
});

const sendMail = data => {
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
};

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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, x-corralation-id, Content-Type, Accept, Authorization");
    next();
  });

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(passport.initialize());
// app.use(passport.session());
// app.use(expressSession({secret: 'secret', resave: false, saveUninitialized: false}));

app.use('/admin', express.static('./dist/gameit-admin'));
app.use('/portal', express.static('./dist/gameit-portal'));
app.use('/gp', express.static('./dist/gameit-gp'));
app.use('/', express.static('./dist/gameit-www'));

// Import controller files
require('./utils/express/controllers-loader')({app, db});

app.post('/api/auth/getstats', async (req, res) => {

    const dateRange = req.body.dateRange;
    // console.log("req.body: ", dateRange, `${dateRange[0]}`);

    const data = {
        studentsCount: 0,
        guardiansCount: 0,
        totalGameDownloades: 0,
        playTime: 0,
    };

    const getStdQuery = "SELECT COUNT(`u`.`userid`) AS `total` FROM `user` `u` WHERE `u`.`user_type` = \'student\'" + " AND (creation_time >= " + `\'${dateRange[0]}\'` + " AND creation_time < "  + `\'${dateRange[1]}\')`;
    await conn2
        .promise()
        .query(getStdQuery)
        .then((result) => {
            // console.log('studentsCount: ', result[0][0]);
            data.studentsCount = result[0][0].total;
        })
        .catch((err) => {
        
        });

        const getGuardQuery = "SELECT COUNT(`u`.`userid`) AS `guardiansCount` FROM `user` `u` WHERE `u`.`user_type` = \'guardian\'" + " AND (creation_time >= " + `\'${dateRange[0]}\'` + " AND creation_time < "  + `\'${dateRange[1]}\')`;
        await conn2
        .promise()
        .query(getGuardQuery)
        .then((result) => {
            // console.log('guardiansCount: ', result[0][0]);
            data.guardiansCount = result[0][0].guardiansCount;
        })
        .catch((err) => {
            if (err) throw err;
        });

        const getDownloadQuery = "SELECT COUNT(DISTINCT StudentID) AS totalGameDownloades FROM gamesession WHERE " + "(Date >= " + `\'${dateRange[0]}\'` + " AND Date < "  + `\'${dateRange[1]}\')`;
        await conn2
        .promise()
        .query(getDownloadQuery)
        .then((result) => {
            // console.log('totalGameDownloades: ', result[0][0]);
            data.totalGameDownloades = result[0][0].totalGameDownloades;
        })
        .catch((err) => {
            if (err) throw err;
        });

        const getPlayTimeQuery = "SELECT SUM(playTime) AS time FROM studentgame WHERE " + "(CreatedDate >= " + `\'${dateRange[0]}\'` + " AND CreatedDate < "  + `\'${dateRange[1]}\')`;
        await conn2
        .promise()
        .query(getPlayTimeQuery)
        .then((result) => {
            // console.log('playTime: ', result[0][0]);
            data.playTime = result[0][0].time;
        })
        .catch((err) => {
            if (err) throw err;
        });

    // console.log('data: ', data);

    res.status(200).send({ status: true, message: 'All stats.', data });
});

app.get('/google/totalusers', async (req, res) => {

    const [response] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [
            {
                startDate: '28daysAgo',
                endDate: 'today',
            },
        ],
        metrics: [
            {
                name: 'active1DayUsers',
            },
        ],
        metricAggregations: ['TOTAL'],
        dimensions: [
            {
                name: 'audienceName',
            },
        ],
    });

    // console.log('Report result:');
    
    var data= [];
    response.rows.forEach((row) => {
        data.push( {
            users: row.metricValues[0].value
        })
    });

    res.status(200).send({status: true, data});
});

app.get('/google/newusers', async (req, res) => {
    const [response] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [
            {
                startDate: '28daysAgo',
                endDate: 'today',
            },
        ],
        metrics: [
            {
                name: 'active1DayUsers',
            },
        ],
        metricAggregations: ['TOTAL'],
        dimensions: [
            {
                name: 'newVsReturning',
            },
        ],
    });

    // console.log('Report result:');
    
    var data = {
            new: response.rows[0].metricValues[0].value,
            returning: response.rows[1].metricValues[0].value,
        };

    res.status(200).send({status: true, data});
});

app.get('/api/auth/confirm-account', (req, res) => {
    // console.log(req.originalUrl);

    axios
        .get(AUTH_API + req.originalUrl)
        .then(function (response) {
            res.send(response.data);
        })
        .catch(function (error) {
            //console.log(error);
            res.send(error);
        });
});

app.get('/api/auth/reset_password', (req, res) => {
    axios
        .get(AUTH_API + req.originalUrl)
        .then(function (response) {
            res.send({ message: 'valid token' });
        })
        .catch(function (error) {
            res.send(error);
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
            res.send(error);
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
            // console.log(response.data);
            res.send(response.data);
        })
        .catch(function (error) {
            res.send(error);
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

app.get('/api/student/download', (req, res) => {
    // console.log(req.query);
    axios
        .get(AUTH_API + '/api/student/download', {
            params: req.query,
            responseType: 'stream',
        })
        .then(function (response) {
            for (const key in response.headers) {
                if (response.headers.hasOwnProperty(key)) {
                    const element = response.headers[key];
                    res.header(key, element);
                }
            }

            response.data.pipe(res);
        })
        .catch(function (error) {
            console.log(error);
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
            res.send(error);
        });
});

app.get('/api/student/studentGames', (req, res) => {
    // console.log(req.query);
    axios
        .get(AUTH_API + '/api/student/studentGames', {
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
            res.send(error);
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
            //console.log(error);
            res.send(error);
        });
});

app.get('/gp/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/gameit-gp/index.html'));
});

/*
app.get('/sp/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/gameit-sp/index.html'));
});
*/

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/gameit-www/index.html'));
});

app.post('/api/auth/signin', (req, res) => {
    // console.log('req: ', req.header);
    axios
        .post(AUTH_API + '/api/auth/login', req.body, { withCredentials: true })
        .then(function (response) {
            res.setHeader('set-cookie', response.headers['set-cookie']);
            res.send(response.data);
        })
        .catch(function (error) {
            //console.log(error);
            res.status(401);
            res.send(error);
        });
});

app.post('/api/auth/signup', (req, res) => {
    // console.log(req.body);
    axios
        .post(AUTH_API + '/api/auth/register', req.body)
        .then(function (response) {
            console.log(response.data);
            res.send(response.data);
        })
        .catch(function (error) {
            //console.log(error);
            res.status(401);
            res.send(error);
        });
});

app.post('/api/auth/forgot_password', (req, res) => {
    var p = 'email=' + req.body.email;
    // console.log(p);

    axios
        .post(AUTH_API + '/api/auth/forgot_password?' + p, req.body)
        .then(function (response) {
            // console.log(response.data);
            res.send({ message: response.data });
        })
        .catch(function (error) {
            console.log(error);
            res.send(error);
        });
});

app.post('/api/auth/reset_password', (req, res) => {
    // console.log(req.body);

    axios
        .post(AUTH_API + '/api/auth/reset_password', req.body)
        .then(function (response) {
            // console.log(response.data);
            res.send({ message: response.data });
        })
        .catch(function (error) {
            console.log(error);
            res.send(error);
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
        .then(response => {
            // console.log(response.data);
            res.send(response.data);
        })
        .catch(function (error) {
            //console.log(error);
            res.status(401);
            res.send(error);
        });
});

/**
 * @deprecated See /api/web/contact route for more details
 */
app.post('/api/auth/contact', (req, res) => {
    // console.log(req.body);
    sendContactMail(req.body);
    res.status(200);
    res.send({ message: 'success' });
});

module.exports = app;
