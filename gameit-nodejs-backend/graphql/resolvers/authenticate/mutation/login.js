
const moment = require('moment');

/** Utils */
const UserAuth = require('../../../../helpers/fastify/auth/authenticate');
const JWTIdentity = require('../../../../helpers/fastify/auth/jwt-identity');
const RequestError = require('./../../../components/RequestError');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ( {Mutation}, fastify ) => {
	const { User, GuardianInvitation, Student } = fastify.db.models;

	const {setAuthCookie} = UserAuth(fastify);
	const {createToken} = JWTIdentity(fastify);

	/**
	 * Find and validate user identity
	 * @param {Object} input - Input data
	 * @param {Query~GraphQLContext} ctx - Fastify reply instance
	 * @returns {Promise<User>} - Promise instance
	 * @throws {RequestError} - On validation failed
	 */
	const findIdentity = async ( input, {request} ) => {
		const {username, password} = {...input};

		/** @type {import('sequelize').Model&User#} */
		const model = await User.findByEmailOrUsername(username);

		//<editor-fold desc="Error: Unknown email address.">
		if ( model === null ) {
			const msg = 'Invalid username or password';
			/** @type {string} */
			throw new RequestError(request.t(msg), 'INVALID_CREDENTIALS', {username: msg});
		}
		//</editor-fold>

		//<editor-fold desc="Error: Not a valid status">
		if ( !model.get('isEmailVerified') ) {
			/** @type {string} */
			const message = 'Your email address has pending verification.';
			throw new RequestError(request.t(message), `PENDING_ACTIVATION`, {username: message});
		}
		//</editor-fold>

		//<editor-fold desc="Error: Not a valid status">
		if ( !model.get('isActive') ) {
			/** @type {string} */
			const message = 'Your account has been deactivated.';

			throw new RequestError(request.t(message), `ACCESS_REVOKED`, {username: message});
		}
		//</editor-fold>

		//<editor-fold desc="Error: Invalid password">
		if ( !model.validatePassword(password) ) {
			/** @type {string} */
			const message = 'Incorrect username or password.';
			throw new RequestError(request.t(message), 'INVALID_PASSWORD', {password: message});
		}
		//</editor-fold>

		//<editor-fold desc="Update Guardian Invitation Status">
		await GuardianInvitation.updateStatus(model.get('email'));
		const studentIDs = await GuardianInvitation.getGuardianRelatedStudents(model.get('email'));

		for await (let studentID of studentIDs) {
			const student = await Student.findOne({
				where: {
					id: studentID,
				}
			});
			student.setJsonValue('guardian.id', model.get('id'));
			student.save();
		}
		//</editor-fold>

		return model;
	};

	/**
	 * Get request IP address
	 * @return {string}
	 */
	const getRequestIP = request => {
		return request.ip
			|| request.headers['x-forwarded-for']
			|| request.raw.connection.remoteAddress
			|| '';
	};

	/**
	 * @public
	 * @async
	 * (Mutation) Login user
	 * @param {Object} root - The object that contains the result returned from the resolver on the parent field
	 * @param {Object} args - The arguments passed into the field in the query
	 * @param {Mutation~GraphQLContext} ctx - Fastify reply instance
	 * @returns {Promise<(Error|boolean)>}
	 * @see Uses `@guest` directive
	 */
	Mutation.login = async ( root, {cookie, input}, ctx ) => {
		const {request, reply} = ctx;

		/** @type {import('sequelize').Model&User#} */
		const model = await findIdentity(input, ctx);

		//<editor-fold desc="Update auth details">
		model.set('lastLoginAt', new Date());
		model.setJsonValue('login', {
			ip: getRequestIP(request),
			dated: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
		});
		await model.save();
		//</editor-fold>

		/** @type {string} */
		const authKey = model.getAuthKey();

		/**
		 * Token data
		 * @type {Object} */
		const data = await createToken(authKey, model.toUserRole());

		if ( cookie ) {
			// Set auth cookie
			setAuthCookie(data, request, reply);
		}

		return {
			me: await User.toGraphMeObject(model, request.language),
			token: {
				token: data.token,
				expiredAt: moment(data.expiredAt).utc(true).toISOString(),
				issuedAt: moment(data.issued_at).utc(true).toISOString(),
			}
		};
	};
};
