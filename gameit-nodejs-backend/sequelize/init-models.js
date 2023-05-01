const glob = require('glob');
const path = require('path');
const Sequelize = require('sequelize');

/**
 * @typedef SequelizeModelsDefs
 * @property {import('sequelize').ModelStatic<Admin>&Admin} Admin - Admin model
 * @property {import('sequelize').ModelStatic<Agreement>&Agreement} Agreement - Agreement model
 * @property {import('sequelize').ModelStatic<Classroom>&Classroom} Classroom - Classroom model
 * @property {import('sequelize').ModelStatic<ClassStudent>&ClassStudent} ClassStudent - ClassStudent model
 * @property {import('sequelize').ModelStatic<Diagnose>&Diagnose} Diagnose - Diagnose model
 * @property {import('sequelize').ModelStatic<Game>&Game} Game - Game model
 * @property {import('sequelize').ModelStatic<GuardianInvitation>&GuardianInvitation} GuardianInvitation - GuardianInvitation model
 * @property {import('sequelize').ModelStatic<Invoice>&Invoice} Invoice - Invoice model
 * @property {import('sequelize').ModelStatic<MailTemplate>&MailTemplate} MailTemplate - MailTemplate model
 * @property {import('sequelize').ModelStatic<Order>&Order} Order - Order model
 * @property {import('sequelize').ModelStatic<OrderItem>&OrderItem} OrderItem - OrderItem model
 * @property {import('sequelize').ModelStatic<OrderPromotion>&OrderPromotion} OrderPromotion - OrderPromotion model
 * @property {import('sequelize').ModelStatic<Product>&Product} Product - Product model
 * @property {import('sequelize').ModelStatic<ProductType>&ProductType} ProductType - ProductType model
 * @property {import('sequelize').ModelStatic<Promotion>&Promotion} Promotion - Promotion model
 * @property {import('sequelize').ModelStatic<Refund>&Refund} Refund - Refund model
 * @property {import('sequelize').ModelStatic<School>&School} School - School model
 * @property {import('sequelize').ModelStatic<ShoppingCart>&ShoppingCart} ShoppingCart - ShoppingCart model
 * @property {import('sequelize').ModelStatic<Student>&Student} Student - Student model
 * @property {import('sequelize').ModelStatic<Subscription>&Subscription} Subscription - Subscription model
 * @property {import('sequelize').ModelStatic<TeacherSchool>&TeacherSchool} TeacherSchool - TeacherSchool model
 * @property {import('sequelize').ModelStatic<TeacherStudents>&TeacherStudents} TeacherStudents - TeacherStudents model
 * @property {import('sequelize').ModelStatic<User>&User} User - User model
 * @property {import('sequelize').ModelStatic<UserSubscription>&UserSubscription} UserSubscription - UserSubscription model
 * @property {import('sequelize').ModelStatic<Vat>&Vat} Vat - Vat model
 * @property {import('sequelize').ModelStatic<Wallet>&Wallet} Wallet - Wallet model
 * @property {import('sequelize').ModelStatic<WalletHistory>&WalletHistory} WalletHistory - WalletHistory model
 * @property {import('sequelize').ModelStatic<State>&State} State - State model
 * @property {import('sequelize').ModelStatic<GameSession>&GameSession} GameSession - GameSession model
 * @property {import('sequelize').ModelStatic<StudentGame>&StudentGame} StudentGame - StudentGame model
 * @property {import('sequelize').ModelStatic<StudentGameGoal>&StudentGameGoal} StudentGameGoal - StudentGameGoal model
 * @property {import('sequelize').ModelStatic<Skill>&Skill} Skill - Skill model
 * @property {import('sequelize').ModelStatic<UserGame>&UserGame} UserGame - UserGame model
 */

module.exports = ( fastify, sequelize ) => {
  /** @type {SequelizeModelsDefs} */
  const models = {};
  
  let modelsDef = '';

  glob.sync('*.js', {cwd: `${__dirname}/models`})
    .forEach(file => {
      const model = require(path.join(__dirname, 'models', file))(sequelize, Sequelize.DataTypes, fastify);
      modelsDef += model.name + `\n`;
      models[model.name] = model;
    });
  
  const {
    Classroom,
    School,
    TeacherSchool,
    User,
    ClassStudent,
    TeacherStudents: TeacherStudent,
    Student,
    GuardianInvitation,
    Order,
    Agreement,
    OrderItem,
    OrderPromotion,
    Refund,
    Product,
    ProductType,
    Promotion,
    UserSubscription,
    Subscription,
    Invoice,
    Vat,
    ShoppingCart,
    WalletHistory,
    Wallet,
    GameSession,
    StudentGame,
    Game,
    StudentGameGoal,
    Skill,
    UserGame,
  } = models;
  
  Order.belongsTo(Agreement, {as: 'agreement', foreignKey: 'agreementId'});
  Agreement.hasMany(Order, {as: 'orders', foreignKey: 'agreementId'});
  ClassStudent.belongsTo(Classroom, {as: 'classroom', foreignKey: 'classroomId'});
  Classroom.hasMany(ClassStudent, {as: 'classStudents', foreignKey: 'classroomId'});
  GuardianInvitation.belongsTo(Classroom, {as: 'classroom', foreignKey: 'classroomId'});
  Classroom.hasMany(GuardianInvitation, {as: 'guardianInvitations', foreignKey: 'classroomId'});
  Invoice.belongsTo(Order, {as: 'order', foreignKey: 'orderId'});
  Order.hasMany(Invoice, {as: 'invoices', foreignKey: 'orderId'});
  OrderItem.belongsTo(Order, {as: 'order', foreignKey: 'orderId'});
  Order.hasMany(OrderItem, {as: 'orderItems', foreignKey: 'orderId'});
  OrderPromotion.belongsTo(Order, {as: 'order', foreignKey: 'orderId'});
  Order.hasMany(OrderPromotion, {as: 'orderPromotions', foreignKey: 'orderId'});
  Refund.belongsTo(Order, {as: 'order', foreignKey: 'orderId'});
  Order.hasMany(Refund, {as: 'refunds', foreignKey: 'orderId'});
  Product.belongsTo(ProductType, {as: 'productType', foreignKey: 'productTypeId'});
  ProductType.hasMany(Product, {as: 'products', foreignKey: 'productTypeId'});
  OrderItem.belongsTo(Product, {as: 'product', foreignKey: 'productId'});
  Product.hasMany(OrderItem, {as: 'orderItems', foreignKey: 'productId'});
  ShoppingCart.belongsTo(Product, {as: 'product', foreignKey: 'productId'});
  Product.hasMany(ShoppingCart, {as: 'shoppingCarts', foreignKey: 'productId'});
  OrderPromotion.belongsTo(Promotion, {as: 'promotion', foreignKey: 'promotionId'});
  Promotion.hasMany(OrderPromotion, {as: 'orderPromotions', foreignKey: 'promotionId'});
  ClassStudent.belongsTo(School, {as: 'school', foreignKey: 'schoolId'});
  School.hasMany(ClassStudent, {as: 'classStudents', foreignKey: 'schoolId'});
  Classroom.belongsTo(School, {as: 'school', foreignKey: 'schoolId'});
  School.hasMany(Classroom, {as: 'classrooms', foreignKey: 'schoolId'});
  TeacherSchool.belongsTo(School, {as: 'school', foreignKey: 'schoolId'});
  School.hasMany(TeacherSchool, {as: 'teacherSchools', foreignKey: 'schoolId'});
  ClassStudent.belongsTo(Student, {as: 'student', foreignKey: 'studentId'});
  Student.hasMany(ClassStudent, {as: 'classStudents', foreignKey: 'studentId'});
  GuardianInvitation.belongsTo(Student, {as: 'student', foreignKey: 'studentId'});
  Student.hasMany(GuardianInvitation, {as: 'guardianInvitations', foreignKey: 'studentId'});
  TeacherStudent.belongsTo(Student, {as: 'student', foreignKey: 'studentId'});
  Student.hasMany(TeacherStudent, {as: 'teacherStudents', foreignKey: 'studentId'});
  UserSubscription.belongsTo(Subscription, {as: 'subscription', foreignKey: 'subscriptionId'});
  Subscription.hasMany(UserSubscription, {as: 'userSubscriptions', foreignKey: 'subscriptionId'});
  Classroom.belongsTo(User, {as: 'owner', foreignKey: 'ownerId'});
  User.hasMany(Classroom, {as: 'classrooms', foreignKey: 'ownerId'});
  GuardianInvitation.belongsTo(User, {as: 'teacher', foreignKey: 'teacherId'});
  User.hasMany(GuardianInvitation, {as: 'guardianInvitations', foreignKey: 'teacherId'});
  Invoice.belongsTo(User, {as: 'user', foreignKey: 'userId'});
  User.hasMany(Invoice, {as: 'invoices', foreignKey: 'userId'});
  Order.belongsTo(User, {as: 'user', foreignKey: 'userId'});
  User.hasMany(Order, {as: 'orders', foreignKey: 'userId'});
  School.belongsTo(User, {as: 'owner', foreignKey: 'ownerId'});
  User.hasMany(School, {as: 'schools', foreignKey: 'ownerId'});
  ShoppingCart.belongsTo(User, {as: 'user', foreignKey: 'userId'});
  User.hasMany(ShoppingCart, {as: 'shoppingCarts', foreignKey: 'userId'});
  TeacherSchool.belongsTo(User, {as: 'teacher', foreignKey: 'teacherId'});
  User.hasMany(TeacherSchool, {as: 'teacherSchools', foreignKey: 'teacherId'});
  TeacherStudent.belongsTo(User, {as: 'teacher', foreignKey: 'teacherId'});
  User.hasMany(TeacherStudent, {as: 'teacherStudents', foreignKey: 'teacherId'});
  UserSubscription.belongsTo(User, {as: 'user', foreignKey: 'userId'});
  User.hasMany(UserSubscription, {as: 'userSubscriptions', foreignKey: 'userId'});
  Wallet.belongsTo(User, {as: 'user', foreignKey: 'userId'});
  User.hasMany(Wallet, {as: 'wallets', foreignKey: 'userId'});
  Order.belongsTo(Vat, {as: 'vat', foreignKey: 'vatId'});
  Vat.hasMany(Order, {as: 'orders', foreignKey: 'vatId'});
  WalletHistory.belongsTo(Wallet, {as: 'wallet', foreignKey: 'walletId'});
  Wallet.hasMany(WalletHistory, {as: 'walletHistories', foreignKey: 'walletId'});
  GameSession.belongsTo(Game, { as: "game", foreignKey: "gameId"});
  Game.hasMany(GameSession, { as: "GameSessions", foreignKey: "gameId"});
  GameSession.belongsTo(Student, { as: "student", foreignKey: "studentId"});
  Student.hasMany(GameSession, { as: "GameSessions", foreignKey: "studentId"});
  StudentGame.belongsTo(Game, { as: "game", foreignKey: "gameId"});
  Game.hasMany(StudentGame, { as: "studentGames", foreignKey: "gameId"});
  StudentGame.belongsTo(Student, { as: "student", foreignKey: "studentId"});
  Student.hasMany(StudentGame, { as: "studentGames", foreignKey: "studentId"});
  StudentGame.belongsTo(User, { as: "assigner", foreignKey: "userId"});
  User.hasMany(StudentGame, { as: "studentGames", foreignKey: "userId"});
  UserGame.belongsTo(Game, { as: "game", foreignKey: "game_id"});
  Game.hasMany(UserGame, { as: "userGames", foreignKey: "game_id"});
  UserGame.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(UserGame, { as: "userGames", foreignKey: "user_id"});
  StudentGameGoal.belongsTo(Game, { as: "game", foreignKey: "game_id"});
  Game.hasMany(StudentGameGoal, { as: "StudentGameGoal", foreignKey: "game_id"});
  StudentGameGoal.belongsTo(StudentGame, { as: "StudentGame", foreignKey: "student_game_id"});
  StudentGame.hasMany(StudentGameGoal, { as: "StudentGameGoal", foreignKey: "student_game_id"});
  StudentGameGoal.belongsTo(Student, { as: "student", foreignKey: "student_id"});
  Student.hasMany(StudentGameGoal, { as: "StudentGameGoal", foreignKey: "student_id"});
  StudentGameGoal.belongsTo(User, { as: "assigner", foreignKey: "assigner_id"});
  User.hasMany(StudentGameGoal, { as: "StudentGameGoal", foreignKey: "assigner_id"});
  Game.belongsTo(Skill, {as:"skills", foreignKey:"skillId"});

  //Game.sync();

  return models;
};