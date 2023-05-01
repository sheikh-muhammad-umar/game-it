// Utils
const {ajvInstance, ajvParseError} = require('./../../../../../../helpers/fastify/ajv');
const RequestError = require('./../../../../../components/RequestError');
const Country = require('./../../../../../../utils/data/country');

module.exports = ( {fastify, inputs, ctx} ) => {
  const {request} = ctx;
  const {School, User} = fastify.db.models;

  const validateNewSchoolInputs = async () => {
    const validate = ajvInstance({ajv: {allErrors: true}})
      .compile({
        type: 'object',
        title: 'School',
        properties: {
          name: {
            title: 'Name',
            type: 'string',
            errorMessage: {
              type: 'School name is required',
            }
          },
          city: {
            title: 'City',
            type: 'string',
            errorMessage: {
              type: 'City name is required',
            }
          },
        },
        required: ['name', 'city'],
        minProperties: 2,
        errorMessage: {
          minProperties: 'Both school name and city are required',
        }
      });

    if ( !validate({...inputs.school}) ) {
      const {message, key} = ajvParseError(validate, request);
      throw new RequestError(request.t(message), 'BAD_INPUT', {[key]: message});
    }
  };

  const validateSchoolInputs = async () => {
    if ( ![User.ROLE_SCHOOL_ADMIN, User.ROLE_TEACHER].includes(inputs.role) ) {
      return;
    }

    const school = {
      id: null,
      name: null,
      city: null,
      ...inputs.school,
    };

    if ( school.id ) {
      if ( !(await School.idExists(school.id, {where: {isActive: true}})) ) {
        throw new RequestError(request.t('No such school has registered with the given id'), 'NOT_FOUND', {
          'school.id': 'School is not registered with us'
        });
      }

      return undefined;
    }

    if ( school.name ) {
      if ( (await School.nameExists(school.name)) ) {
        throw new RequestError(request.t('School name is already registered'), 'SCHOOL_NAME_ALREADY_TAKEN');
      }

      return await validateNewSchoolInputs(school);
    }

    throw new RequestError(request.t('Either school ID or name is required'), 'INPUT_REQUIRED');
  };

  const runValidations = async () => {
    //<editor-fold desc="Basic validations">
    if ( (await User.usernameExists(inputs.username)) ) {
      throw new RequestError (request.t('Username is already taken by someone'), 'USERNAME_EXIST', {
        username: 'Username exists',
      });
    }

    if ( (await User.emailExists(inputs.email)) ) {
      throw new RequestError (request.t('Email is already registered'), 'EMAIL_EXIST', {
        email: 'Email exists',
      });
    }

    if ( !Country.isValidCode(inputs.country) ) {
      throw new RequestError (request.t('Country does not exist'), 'BAD_COUNTRY', {
        country: 'Bad country name',
      });
    }
    //</editor-fold>

    // School related (Role based)
    await validateSchoolInputs();
  };

  return {
    runValidations,
  };
};
