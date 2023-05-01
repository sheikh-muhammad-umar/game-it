const op = require('object-path');
const Op = require('sequelize').Op;

// Utils
const graphqlFindOpts = require('../../../../helpers/graphql/graphql-find-options');
const {recordsFetcher} = require('../../../../helpers/graphql/pager-records-fetcher');
const {toGraphQLFilterMetaData} = require('../../../../helpers/graphql/graphql-meta-utils');
const objectPath = require('object-path');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ({Query}, fastify) => {
  const {Student, User, School, Classroom, ClassStudent, TeacherStudents} = fastify.db.models;

  /**
   * Apply search filters to main query
   * @param {Object} args - The arguments passed into the field in the query
   * @param {import('sequelize').WhereOptions} whereOptions=[] - Attribute whereOptions
   */
  const applySearchFilters = (args, whereOptions) => {
    const accessor = op(args.filters);

    accessor.has('name')
    && (whereOptions.fullName = {[Op.like]: `%${accessor.get('name')}%`})

    accessor.has('grade')
    && (whereOptions.grade = {[Op.eq]: accessor.get('grade')})

    accessor.has('guardian')
    && (whereOptions['meta.guardian.id'] = {[Op.eq]: accessor.get('guardian')})
  };

  /**
   * @public
   * @async
   * (Query) List countries
   * @param {Object} root - The object that contains the result returned from the resolver on the parent field
   * @param {Object} args - The arguments passed into the field in the query
   * @param {Query~GraphQLContext} ctx - Fastify reply instance
   * @param {Object} info - It contains information about the execution state of the query
   * @returns {Promise<Error|Array<Object>>}
   */
  Query.listStudents = async (root, args, ctx, info) => {
    /** @type {Array<Object>} */
    const pager = graphqlFindOpts.parsePagerArg(args);
    /** @type {objectPath~ObjectPathBound} */
    const filters = op(args.filters || {});

    /** @type {Array<string>} */
    const metaPaths = args.metaPaths || [];
    /** @type {number} */
    let limit = graphqlFindOpts.valueFromArgs('limit', pager, {
      default: 15, min: 1, max: 50,
    });

    /** @type {import('sequelize').WhereOptions} */
    const whereOptions = {
      // isActive: true,
    };

    applySearchFilters(args, whereOptions);

    const {language} = ctx.request;

    let sortOrder = graphqlFindOpts.parseSortOrder(args, {
      lang: language,
    });

    /** @type {ConnectionObject} */
    const response = graphqlFindOpts.emptyConnectionObject();
    const include = [];

    if (filters.get('teacherId')) {
      include.push({
        model: TeacherStudents,
        as: 'teacherStudents',
        attributes: ['teacherId'],
        where: {
          teacherId: filters.get('teacherId'),
        },
        required: true,
        include: [{
          model: User,
          as: 'teacher',
          attributes: [],
        }],
      });
    }

    if (filters.get('schoolId')) {
      include.push({
        model: ClassStudent,
        as: 'classStudents',
        attributes: ['schoolId'],
        where: {
          schoolId: filters.get('schoolId'),
        },
        required: true,
        include: [{
          model: School,
          as: 'school',
          attributes: [],
        }],
      });
    }

    if (filters.get('classId')) {
      include.push({
        model: ClassStudent,
        as: 'classStudents',
        attributes: ['classroomId'],
        where: {
          classroomId: filters.get('classId'),
        },
        required: true,
        include: [{
          model: Classroom,
          as: 'classroom',
          attributes: [],
        }],
      });
    }

    const rows = await recordsFetcher(Student, {
      limit, pager, response, sortOrder, whereOptions, info, include
    });


    response.nodes = [];
    /** @type {Array<Object>} */
    for await (const row of rows) {
      const record = await Student.toAssociateGraphObject(row, language);
      const model = await ClassStudent.findOne({
        where: {
          studentId: record.id,
        },
        attributes: ['schoolId'],
        raw: true,
      });

      model && (record.meta.schoolId = model.schoolId);

      toGraphQLFilterMetaData(metaPaths, record, {request: ctx.request})
      response.nodes.push(record);
    }

    return response;
  };
};
