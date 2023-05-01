const axios = require('axios');
const op = require('object-path');

/** @type {objectPath~ObjectPathBound} */
const env = op(process.env);

/** @type {string} */
const AUTH_API = env.get('AUTH_API_URL', '');

/**
 * @param {import('express')} app - Express app instance
 * @param {SequelizeConfig} db - Sequelize mapping
 */
module.exports = ({app, db}) => {
  app.post('/api/student/addstudent', ( req, res ) => {
    // console.log(req.body);
    axios
      .post(`${AUTH_API}/api/student/students`, req.body, {
        headers: {
          Cookie: req.headers['cookie'],
        },
      })
      .then(response => {
        // console.log(response.data);
        res.send(response.data);
      })
      .catch(function ( error ) {
        //console.log(error);
        res.status(401);
        res.send(error);
      });
  });
};
