/*
 Navicat Premium Data Transfer

 Source Server         : Local MySQL
 Source Server Type    : MySQL
 Source Server Version : 80028
 Source Host           : localhost:3306
 Source Schema         : gameit_pf_global

 Target Server Type    : MySQL
 Target Server Version : 80028
 File Encoding         : 65001

 Date: 28/07/2022 17:15:08
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admins
-- ----------------------------
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `first_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'First name',
  `last_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Last name',
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Username',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Email',
  `auth_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Auth Key',
  `password` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Password',
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Password hash',
  `password_reset_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Password reset token',
  `deleted` tinyint unsigned DEFAULT '0' COMMENT 'Deleted',
  `active` tinyint unsigned DEFAULT '0' COMMENT 'Active',
  `created_at` datetime DEFAULT NULL COMMENT 'Created at',
  `updated_at` datetime DEFAULT NULL COMMENT 'Updated at',
  `last_login_at` datetime DEFAULT NULL COMMENT 'Last login at',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `IDX_admin_id` (`id`) USING BTREE,
  UNIQUE KEY `IDX_admin_email` (`email`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of admins
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for agreements
-- ----------------------------
DROP TABLE IF EXISTS `agreements`;
CREATE TABLE `agreements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `heading` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Heading',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Content',
  `version` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Version',
  `meta` json DEFAULT NULL COMMENT 'Meta data',
  `created_at` datetime DEFAULT NULL COMMENT 'Created',
  `updated_at` datetime DEFAULT NULL COMMENT 'Updated',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of agreements
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for class_students
-- ----------------------------
DROP TABLE IF EXISTS `class_students`;
CREATE TABLE `class_students` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `school_id` bigint unsigned NOT NULL COMMENT 'School',
  `classroom_id` bigint unsigned NOT NULL COMMENT 'Classroom',
  `student_id` bigint unsigned NOT NULL COMMENT 'Student',
  `meta` json DEFAULT NULL COMMENT 'Meta',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `IDX_class_students_student_id` (`student_id`) USING BTREE,
  KEY `IDX_class_students_school_id` (`school_id`) USING BTREE,
  KEY `IDX_class_students_classroom_id` (`classroom_id`) USING BTREE,
  CONSTRAINT `fk_class_students_classrooms_1` FOREIGN KEY (`classroom_id`) REFERENCES `classrooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_class_students_schools_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_class_students_students_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of class_students
-- ----------------------------
BEGIN;
INSERT INTO `class_students` (`id`, `school_id`, `classroom_id`, `student_id`, `meta`) VALUES (4, 19, 3, 4, '{\"meta\": {}}');
INSERT INTO `class_students` (`id`, `school_id`, `classroom_id`, `student_id`, `meta`) VALUES (5, 19, 3, 5, '{\"meta\": {}}');
COMMIT;

-- ----------------------------
-- Table structure for classrooms
-- ----------------------------
DROP TABLE IF EXISTS `classrooms`;
CREATE TABLE `classrooms` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `school_id` bigint unsigned NOT NULL COMMENT 'School',
  `owner_id` bigint unsigned NOT NULL COMMENT 'Owner',
  `name` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Name',
  `is_active` smallint DEFAULT '1' COMMENT 'Active',
  `created_at` datetime DEFAULT NULL COMMENT 'Created at',
  `updated_at` datetime DEFAULT NULL COMMENT 'Updated at',
  `meta` json DEFAULT NULL COMMENT 'Meta data',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `IDX_classrooms_owner_id` (`owner_id`) USING BTREE,
  KEY `IDX_school_id` (`school_id`) USING BTREE,
  CONSTRAINT `FK_schools_id_school_id` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_users_id_classrooms_user_id` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of classrooms
-- ----------------------------
BEGIN;
INSERT INTO `classrooms` (`id`, `school_id`, `owner_id`, `name`, `is_active`, `created_at`, `updated_at`, `meta`) VALUES (3, 19, 19, 'New Class', 1, '2022-06-01 10:13:05', '2022-06-01 10:13:05', '{\"code\": \"RLFPRI\", \"grade\": 4}');
INSERT INTO `classrooms` (`id`, `school_id`, `owner_id`, `name`, `is_active`, `created_at`, `updated_at`, `meta`) VALUES (4, 19, 9, 'Admin Class a', 1, '2022-06-09 11:50:46', '2022-06-09 11:50:46', '{\"code\": \"JTEVEJ\", \"grade\": 4}');
INSERT INTO `classrooms` (`id`, `school_id`, `owner_id`, `name`, `is_active`, `created_at`, `updated_at`, `meta`) VALUES (5, 19, 19, 'Admin Class a', 1, '2022-06-09 11:51:05', '2022-06-09 11:51:05', '{\"code\": \"OSRVET\", \"grade\": 4}');
INSERT INTO `classrooms` (`id`, `school_id`, `owner_id`, `name`, `is_active`, `created_at`, `updated_at`, `meta`) VALUES (6, 19, 19, 'Admin Class a', 1, '2022-06-09 11:51:14', '2022-06-09 11:51:14', '{\"code\": \"FXZDDA\", \"grade\": 4}');
COMMIT;

-- ----------------------------
-- Table structure for diagnoses
-- ----------------------------
DROP TABLE IF EXISTS `diagnoses`;
CREATE TABLE `diagnoses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `title` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Title',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Description',
  `is_active` tinyint unsigned DEFAULT '1' COMMENT 'Active',
  `meta` json DEFAULT NULL COMMENT 'Meta',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `UNQ_diagnoses_title` (`title`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of diagnoses
-- ----------------------------
BEGIN;
INSERT INTO `diagnoses` (`id`, `title`, `description`, `is_active`, `meta`) VALUES (1, 'Language problems', NULL, 1, '{\"i18n\": {\"ar-SA\": {\"title\": \"اضطرابات في اللغة\", \"description\": \"\"}}}');
INSERT INTO `diagnoses` (`id`, `title`, `description`, `is_active`, `meta`) VALUES (2, 'Speech problems', NULL, 1, '{\"i18n\": {\"ar-SA\": {\"title\": \"اضطرابات في الكلام\", \"description\": \"\"}}}');
INSERT INTO `diagnoses` (`id`, `title`, `description`, `is_active`, `meta`) VALUES (3, 'Learning challenges in School', NULL, 1, '{\"i18n\": {\"ar-SA\": {\"title\": \"تحديات في التعليم في المدرسة\", \"description\": \"\"}}}');
INSERT INTO `diagnoses` (`id`, `title`, `description`, `is_active`, `meta`) VALUES (4, 'Learning Disabilities', NULL, 1, '{\"ar-SA\": {\"title\": \"صعوبات تعلم\", \"description\": \"\"}}');
INSERT INTO `diagnoses` (`id`, `title`, `description`, `is_active`, `meta`) VALUES (5, 'Dyslexia', NULL, 1, '{\"i18n\": {\"ar-SA\": {\"title\": \"صعوبات القراءة\", \"description\": \"\"}}}');
INSERT INTO `diagnoses` (`id`, `title`, `description`, `is_active`, `meta`) VALUES (6, 'Writing problems', NULL, 1, '{\"i18n\": {\"ar-SA\": {\"title\": \"صعوبات الكتابة\", \"description\": \"\"}}}');
INSERT INTO `diagnoses` (`id`, `title`, `description`, `is_active`, `meta`) VALUES (7, 'Autism spectrum', NULL, 1, '{\"i18n\": {\"ar-SA\": {\"title\": \"طيف توحد\", \"description\": \"\"}}}');
INSERT INTO `diagnoses` (`id`, `title`, `description`, `is_active`, `meta`) VALUES (8, 'Social skills challenges', NULL, 1, '{\"i18n\": {\"ar-SA\": {\"title\": \"تحديات في المهارات الأجتماعية\", \"description\": \"\"}}}');
INSERT INTO `diagnoses` (`id`, `title`, `description`, `is_active`, `meta`) VALUES (9, 'Stuttering', NULL, 1, '{\"i18n\": {\"ar-SA\": {\"title\": \"تأتأة\", \"description\": \"\"}}}');
INSERT INTO `diagnoses` (`id`, `title`, `description`, `is_active`, `meta`) VALUES (10, 'Physical Disabilities', NULL, 1, '{\"i18n\": {\"ar-SA\": {\"title\": \"إعاقة حركية\", \"description\": \"\"}}}');
INSERT INTO `diagnoses` (`id`, `title`, `description`, `is_active`, `meta`) VALUES (11, 'Hearing Impairment', NULL, 1, '{\"i18n\": {\"ar-SA\": {\"title\": \"اضضطراب في القدرات السمعية\", \"description\": \"\"}}}');
INSERT INTO `diagnoses` (`id`, `title`, `description`, `is_active`, `meta`) VALUES (12, 'Depression', NULL, 1, '{\"i18n\": {\"ar-SA\": {\"title\": \"اكتئاب\", \"description\": \"\"}}}');
INSERT INTO `diagnoses` (`id`, `title`, `description`, `is_active`, `meta`) VALUES (13, 'Mental dysfunctions', NULL, 1, '{\"i18n\": {\"ar-SA\": {\"title\": \"اضطراب في القدرات الذهنية\", \"description\": \"\"}}}');
INSERT INTO `diagnoses` (`id`, `title`, `description`, `is_active`, `meta`) VALUES (14, 'Anger/ Aggression', NULL, 1, '{\"i18n\": {\"ar-SA\": {\"title\": \"الغضب الشديد/ العصبية\", \"description\": \"\"}}}');
COMMIT;

-- ----------------------------
-- Table structure for game_sessions
-- ----------------------------
DROP TABLE IF EXISTS `game_sessions`;
CREATE TABLE `game_sessions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `student_id` bigint unsigned NOT NULL COMMENT 'Student',
  `game_id` bigint unsigned NOT NULL COMMENT 'Game',
  `type` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Type',
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Game session key',
  `data` json DEFAULT NULL COMMENT 'Data',
  `meta` json DEFAULT NULL COMMENT 'Meta',
  `created_at` datetime DEFAULT NULL COMMENT 'Created at',
  `updated_at` datetime DEFAULT NULL COMMENT 'Updated at',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNQ_game_sessions_game_id_student_id` (`game_id`,`student_id`) USING BTREE,
  KEY `IDX_game_sessions_student_id` (`student_id`) USING BTREE,
  KEY `IDX_game_sessions_game_id` (`game_id`) USING BTREE,
  CONSTRAINT `FK_game_sessions_game` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_game_sessions_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of game_sessions
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for game_skills
-- ----------------------------
DROP TABLE IF EXISTS `game_skills`;
CREATE TABLE `game_skills` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Name',
  `description` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Description',
  `meta` json DEFAULT NULL COMMENT 'Meta',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNQ_skills_name` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of game_skills
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for games
-- ----------------------------
DROP TABLE IF EXISTS `games`;
CREATE TABLE `games` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `title` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Title',
  `description` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Description',
  `skill_title` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Skill (title)',
  `skill_description` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Skill (description)',
  `app` json NOT NULL COMMENT 'App (meta)',
  `levels` json DEFAULT NULL COMMENT 'Levels',
  `status` tinyint unsigned DEFAULT '10' COMMENT 'Status',
  `meta` json DEFAULT NULL COMMENT 'Meta data',
  `created_at` datetime DEFAULT NULL COMMENT 'Created',
  `updated_at` datetime DEFAULT NULL COMMENT 'Updated',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNQ_games_title` (`title`) USING BTREE,
  KEY `IDX_games_skill_title` (`skill_title`) USING BTREE,
  KEY `IDX_games_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of games
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for guardian_invitations
-- ----------------------------
DROP TABLE IF EXISTS `guardian_invitations`;
CREATE TABLE `guardian_invitations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `teacher_id` bigint unsigned NOT NULL COMMENT 'Teacher',
  `classroom_id` bigint unsigned NOT NULL COMMENT 'Class',
  `student_id` bigint unsigned NOT NULL COMMENT 'Student',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Email address',
  `status` smallint NOT NULL DEFAULT '10' COMMENT 'Status',
  `meta` json NOT NULL COMMENT 'Meta',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `IDX_guardian_invitations_email` (`email`) USING BTREE,
  KEY `IDX_guardian_invitations_status` (`status`) USING BTREE,
  KEY `fk_guardian_invitations_users_1` (`teacher_id`) USING BTREE,
  KEY `fk_guardian_invitations_classrooms_1` (`classroom_id`) USING BTREE,
  KEY `fk_guardian_invitations_students_1` (`student_id`) USING BTREE,
  CONSTRAINT `fk_guardian_invitations_classrooms_1` FOREIGN KEY (`classroom_id`) REFERENCES `classrooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_guardian_invitations_students_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_guardian_invitations_users_1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of guardian_invitations
-- ----------------------------
BEGIN;
INSERT INTO `guardian_invitations` (`id`, `teacher_id`, `classroom_id`, `student_id`, `email`, `status`, `meta`) VALUES (3, 19, 3, 4, 'muhammad.umar+3@invozone.com', 3, '{\"completedAt\": \"2022-06-28 17:22:01\", \"requestedAt\": \"2022-05-16 05:40:40\"}');
INSERT INTO `guardian_invitations` (`id`, `teacher_id`, `classroom_id`, `student_id`, `email`, `status`, `meta`) VALUES (4, 19, 3, 5, 'faizan.rasool+24@invozone.com', 10, '{\"expiredAt\": \"2022-06-05 05:55:52\", \"inviteCode\": \"094866\", \"requestedAt\": \"2022-06-02 10:55:52\"}');
COMMIT;

-- ----------------------------
-- Table structure for invoices
-- ----------------------------
DROP TABLE IF EXISTS `invoices`;
CREATE TABLE `invoices` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint unsigned NOT NULL COMMENT 'User',
  `order_id` bigint unsigned NOT NULL COMMENT 'Order',
  `type` enum('RESIDENTIAL','COMMERCIAL') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Type',
  `bill_to` json NOT NULL COMMENT 'Bill (address)',
  `meta` json DEFAULT NULL COMMENT 'Meta data',
  `created_at` datetime DEFAULT NULL COMMENT 'Created',
  `updated_at` datetime DEFAULT NULL COMMENT 'Updated',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `fk_users_id_invoices_user_id` (`user_id`) USING BTREE,
  KEY `fk_invoices_orders_1` (`order_id`) USING BTREE,
  CONSTRAINT `fk_invoices_orders_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_id_invoices_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of invoices
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for mail_templates
-- ----------------------------
DROP TABLE IF EXISTS `mail_templates`;
CREATE TABLE `mail_templates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Name',
  `label` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Label',
  `meta` json DEFAULT NULL COMMENT 'Meta',
  `is_active` tinyint unsigned DEFAULT '1' COMMENT 'Active',
  `created_at` datetime DEFAULT NULL COMMENT 'Created',
  `updated_at` datetime DEFAULT NULL COMMENT 'Updated',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `UNQ_mail_templates_label` (`label`) USING BTREE,
  KEY `IDX_mail_templates_is_active` (`is_active`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of mail_templates
-- ----------------------------
BEGIN;
INSERT INTO `mail_templates` (`id`, `name`, `label`, `meta`, `is_active`, `created_at`, `updated_at`) VALUES (1, 'Welcome Admin', 'admin_new_account', '{\"languages\": {\"ar_SA\": {\"subject\": \"تم انشاء حسابك بنجاح\", \"templateData\": {\"rtl\": true, \"text\": \"باستخداماسمالمستخدموكلمةالمرورالتياخترتها،يمكنكالوصولإلىملفالتعريفالخاصبكوتعديلهحسبالحاجة.{username} :تمالتحققمنبريدكالإلكترونيبنجاح.,اسمالمستخدم<br><br>, {firstname}مرحبا\", \"header\": \"تم انشاء حسابك بنجاح\", \"buttonLink\": \"{webPortalUrl}\", \"buttonText\": \"تسجيل دخول\"}}, \"en_US\": {\"subject\": \"Your account has been created successfully\", \"templateData\": {\"rtl\": false, \"text\": \"Hello {firstname},<br><br>Your email has been successfully verified.<br><br>User name:{username}<br><br>With your user name and your chosen password, you can access and edit your profile as needed.\", \"header\": \"Your Account Has Been Created\", \"buttonLink\": \"{webPortalUrl}/login\", \"buttonText\": \"Click to Login\"}}}, \"templateId\": \"d-0995d792612d4c00b948987c093236c4\"}', 1, '2022-05-27 11:52:40', '2022-05-27 11:52:40');
INSERT INTO `mail_templates` (`id`, `name`, `label`, `meta`, `is_active`, `created_at`, `updated_at`) VALUES (6, 'Success Account Created', 'user_signup_success', '{\"languages\": {\"ar_SA\": {\"subject\": \"تم انشاء حسابك بنجاح\", \"templateData\": {\"rtl\": true, \"text\": \"باستخداماسمالمستخدموكلمةالمرورالتياخترتها،يمكنكالوصولإلىملفالتعريفالخاصبكوتعديلهحسبالحاجة.{username} :تمالتحققمنبريدكالإلكترونيبنجاح.,اسمالمستخدم<br><br>, {firstname}مرحبا\", \"header\": \"تم انشاء حسابك بنجاح\", \"buttonLink\": \"{webPortalUrl}\", \"buttonText\": \"تسجيل دخول\"}}, \"en_US\": {\"subject\": \"Your account has been created successfully\", \"templateData\": {\"rtl\": false, \"text\": \"Hello {firstname},<br><br>Your email has been successfully verified.<br><br>User name:{username}<br><br>With your user name and your chosen password, you can access and edit your profile as needed.\", \"header\": \"Your Account Has Been Created\", \"buttonLink\": \"{webPortalUrl}/login\", \"buttonText\": \"Click to Login\"}}}, \"templateId\": \"d-0995d792612d4c00b948987c093236c4\"}', 1, '2022-05-27 11:52:40', '2022-05-27 11:52:40');
INSERT INTO `mail_templates` (`id`, `name`, `label`, `meta`, `is_active`, `created_at`, `updated_at`) VALUES (7, 'Password Reset - With Code', 'user_reset_password_request_code', '{\"languages\": {\"ar_SA\": {\"subject\": \"Password Reset\", \"templateData\": {\"rtl\": true, \"text\": \"Hello {firstname},<br><br>We\'ve received a request to reset your password on your Gameit account.<br><br>Here\'s the code you need.<br><br><div class=\'code\'>{code}</div><br>If you did not attempt this action, please change your password immediately.<br><br>This code will expire in {expiry} after this email was sent.\", \"header\": \"Password Reset\"}}, \"en_US\": {\"subject\": \"Password Reset\", \"templateData\": {\"rtl\": false, \"text\": \"Hello {firstname},<br><br>We\'ve received a request to reset your password on your Gameit account.<br><br>Here\'s the code you need.<br><br><div class=\'code\'>{code}</div><br>If you did not attempt this action, please change your password immediately.<br><br>This code will expire in {expiry} after this email was sent.\", \"header\": \"Password Reset\"}}}, \"templateId\": \"d-0995d792612d4c00b948987c093236c4\"}', 1, '2022-05-27 11:52:40', '2022-05-27 11:52:40');
INSERT INTO `mail_templates` (`id`, `name`, `label`, `meta`, `is_active`, `created_at`, `updated_at`) VALUES (10, 'Forgot Password', 'user_reset_password_request', '{\"languages\": {\"ar_SA\": {\"subject\": \"Password Reset\", \"templateData\": {\"rtl\": true, \"text\": \"Hello {firstname},<br><br>We\'ve received a request to reset your password on your Gameit account.<br><br>You can reset your password by clicking on the button below.<br><br>If the button doesn\'t work, please copy paste the following link in your browser:<br><br>{webPortalUrl}/reset-password\", \"header\": \"Password Reset\", \"buttonLink\": \"{webPortalUrl}/reset-password\", \"buttonText\": \"Reset Password\"}}, \"en_US\": {\"subject\": \"Password Reset\", \"templateData\": {\"rtl\": false, \"text\": \"Hello {firstname},<br><br>We\'ve received a request to reset your password on your Gameit account.<br><br>You can reset your password by clicking on the button below.<br><br>If the button doesn\'t work, please copy paste the following link in your browser:<br><br>{webPortalUrl}/reset-password\", \"header\": \"Password Reset\", \"buttonLink\": \"{webPortalUrl}/reset-password\", \"buttonText\": \"Reset Password\"}}}, \"templateId\": \"d-0995d792612d4c00b948987c093236c4\"}', 1, '2022-05-27 11:52:40', '2022-05-27 11:52:40');
INSERT INTO `mail_templates` (`id`, `name`, `label`, `meta`, `is_active`, `created_at`, `updated_at`) VALUES (11, 'Welcome to GameIT - With Code', 'user_email_verification_code', '{\"languages\": {\"ar_SA\": {\"subject\": \"Welcome to Gameit\", \"templateData\": {\"rtl\": true, \"text\": \"Hello {firstname},<br><br>Thank you for signing up for GameIT.<br><br>In order to get started, please use the code below to verify your email.<br><br><div class=\'code\'>{code}</div><br>This code will expire in {expiry} after this email was sent.\", \"header\": \"Welcome to Gameit\"}}, \"en_US\": {\"subject\": \"Welcome to Gameit\", \"templateData\": {\"rtl\": false, \"text\": \"Hello {firstname},<br><br>Thank you for signing up for GameIT.<br><br>In order to get started, please use the code below to verify your email.<br><br><div class=\'code\'>{code}</div><br>This code will expire in {expiry} after this email was sent.\", \"header\": \"Welcome to Gameit\"}}}, \"templateId\": \"d-0995d792612d4c00b948987c093236c4\"}', 1, '2022-05-27 11:52:40', '2022-05-27 11:52:40');
INSERT INTO `mail_templates` (`id`, `name`, `label`, `meta`, `is_active`, `created_at`, `updated_at`) VALUES (12, 'Welcome to GameIT', 'user_email_verification', '{\"languages\": {\"ar_SA\": {\"subject\": \"Welcome to Gameit\", \"templateData\": {\"rtl\": true, \"text\": \"Hello {firstname},<br><br>Welcome to GameIT. Please confirm your email address by clicking on the button below.<br><br>If the button doesn\'t work, please copy paste the following link in your browser:<br><br>{confirmation_link}\", \"header\": \"Welcome to Gameit\", \"buttonLink\": \"{confirmation_link}\", \"buttonText\": \"Verify Email\"}}, \"en_US\": {\"subject\": \"Welcome to Gameit\", \"templateData\": {\"rtl\": false, \"text\": \"Hello {firstname},<br><br>Welcome to GameIT. Please confirm your email address by clicking on the button below.<br><br>If the button doesn\'t work, please copy paste the following link in your browser:<br><br>{confirmation_link}\", \"header\": \"Welcome to Gameit\", \"buttonLink\": \"{confirmation_link}\", \"buttonText\": \"Verify Email\"}}}, \"templateId\": \"d-0995d792612d4c00b948987c093236c4\"}', 1, '2022-05-27 11:52:40', '2022-05-27 11:52:40');
INSERT INTO `mail_templates` (`id`, `name`, `label`, `meta`, `is_active`, `created_at`, `updated_at`) VALUES (13, 'Welcome Guest', 'subscription_success', '{\"languages\": {\"ar_SA\": {\"subject\": \"Welcome to Gameit\", \"templateData\": {\"rtl\": true, \"text\": \"Hello {firstname},<br><br>Thank you for registering your information. We will contact you soon.\", \"header\": \"Welcome to Gameit\"}}, \"en_US\": {\"subject\": \"Welcome to Gameit\", \"templateData\": {\"rtl\": false, \"text\": \"Hello {firstname},<br><br>Thank you for registering your information. We will contact you soon.\", \"header\": \"Welcome to Gameit\"}}}, \"templateId\": \"d-0995d792612d4c00b948987c093236c4\"}', 1, '2022-05-27 11:52:40', '2022-05-27 11:52:40');
INSERT INTO `mail_templates` (`id`, `name`, `label`, `meta`, `is_active`, `created_at`, `updated_at`) VALUES (15, 'Join to School Rejected', 'school_join_request_rejected', '{\"languages\": {\"ar_SA\": {\"subject\": \"Your request has been rejected\", \"templateData\": {\"rtl\": true, \"text\": \"Hello {firstname},<br><br>Your request to join {schoolName} has been rejected<br><br>You can either select the same school to join if you have been rejected by mistake or select the correct school if you have selected the wrong one.<br><br>Please use the following link and user name to access your profile:<br><br><a href=\'{webPortalUrl}/login\'>Click Here</a><br><br>User name:{username}<br><br>With your user name and your chosen password, you can access and edit your profile as needed.\", \"header\": \"Your request has been rejected\"}}, \"en_US\": {\"subject\": \"Your request has been rejected\", \"templateData\": {\"rtl\": false, \"text\": \"Hello {firstname},<br><br>Your request to join {schoolName} has been rejected<br><br>You can either select the same school to join if you have been rejected by mistake or select the correct school if you have selected the wrong one.<br><br>Please use the following link and user name to access your profile:<br><br><a href=\'{webPortalUrl}/login\'>Click Here</a><br><br>User name:{username}<br><br>With your user name and your chosen password, you can access and edit your profile as needed.\", \"header\": \"Your request has been rejected\"}}}, \"templateId\": \"d-0995d792612d4c00b948987c093236c4\"}', 1, '2022-05-27 11:52:40', '2022-05-27 11:52:40');
INSERT INTO `mail_templates` (`id`, `name`, `label`, `meta`, `is_active`, `created_at`, `updated_at`) VALUES (16, 'Join to School Accepted', 'school_join_request_accepted', '{\"languages\": {\"ar_SA\": {\"subject\": \"Joined to School\", \"templateData\": {\"rtl\": true, \"text\": \"Hello {firstname},<br><br>Your request to join {schoolName} has been accepted<br><br>Please use the following link and user name to access your profile:<br><br><a href=\'{webPortalUrl}/login\'>Click Here</a><br><br>User name:{username}<br><br>With your user name and your chosen password, you can access and edit your profile as needed.\", \"header\": \"Joined to School\"}}, \"en_US\": {\"subject\": \"Joined to School\", \"templateData\": {\"rtl\": false, \"text\": \"Hello {firstname},<br><br>Your request to join {schoolName} has been accepted<br><br>Please use the following link and user name to access your profile:<br><br><a href=\'{webPortalUrl}/login\'>Click Here</a><br><br>User name:{username}<br><br>With your user name and your chosen password, you can access and edit your profile as needed.\", \"header\": \"Joined to School\"}}}, \"templateId\": \"d-0995d792612d4c00b948987c093236c4\"}', 1, '2022-05-27 11:52:40', '2022-05-27 11:52:40');
INSERT INTO `mail_templates` (`id`, `name`, `label`, `meta`, `is_active`, `created_at`, `updated_at`) VALUES (17, 'Authorization Request - School Admin', 'school_join_request', '{\"languages\": {\"ar_SA\": {\"subject\": \"Authorization Request\", \"templateData\": {\"rtl\": true, \"text\": \"Hello {firstname},<br><br>{teacherName} asking to join {schoolName}<br><br>You can authorize user by clicking on the button below.<br><br>If the button doesn\'t work, please copy paste the following link in your browser:<br><br>{webPortalUrl}/school/join-request?id={requestId}\", \"header\": \"Authorization Request\", \"buttonLink\": \"{webPortalUrl}/school/join-request?id={requestId}\", \"buttonText\": \"Authorize User\"}}, \"en_US\": {\"subject\": \"Authorization Request\", \"templateData\": {\"rtl\": false, \"text\": \"Hello {firstname},<br><br>{teacherName} asking to join {schoolName}<br><br>You can authorize user by clicking on the button below.<br><br>If the button doesn\'t work, please copy paste the following link in your browser:<br><br>{webPortalUrl}/school/join-request?id={requestId}\", \"header\": \"Authorization Request\", \"buttonLink\": \"{webPortalUrl}/school/join-request?id={requestId}\", \"buttonText\": \"Authorize User\"}}}, \"templateId\": \"d-0995d792612d4c00b948987c093236c4\"}', 1, '2022-05-27 11:52:40', '2022-05-27 11:52:40');
INSERT INTO `mail_templates` (`id`, `name`, `label`, `meta`, `is_active`, `created_at`, `updated_at`) VALUES (18, 'Password Changed', 'password_changed', '{\"languages\": {\"ar_SA\": {\"subject\": \"Password Changed\", \"templateData\": {\"rtl\": true, \"text\": \"Hello {firstname},<br><br>You have successfully changed your Gameit account password.<br><br>If you did not make this request, please reset the passwords of your email address and Gameit account.\", \"header\": \"Password Changed\"}}, \"en_US\": {\"subject\": \"Password Changed\", \"templateData\": {\"rtl\": false, \"text\": \"Hello {firstname},<br><br>You have successfully changed your Gameit account password.<br><br>If you did not make this request, please reset the passwords of your email address and Gameit account.\", \"header\": \"Password Changed\"}}}, \"templateId\": \"d-0995d792612d4c00b948987c093236c4\"}', 1, '2022-05-27 11:52:40', '2022-05-27 11:52:40');
INSERT INTO `mail_templates` (`id`, `name`, `label`, `meta`, `is_active`, `created_at`, `updated_at`) VALUES (19, 'Teacher\'s Invitation - Guardian', 'guardian_invitation_by_teacher', '{\"languages\": {\"ar_SA\": {\"subject\": \"Invitation\", \"templateData\": {\"rtl\": true, \"text\": \"Dear Parent / Guardian,<br><br>Here’s an update about {studentName}. This year, the students will be using this exciting educational program Gameit to improve their skills.<br><br>While we do use Gameit during school hours, I’ll be giving additional assignments on Gameit that students can work on at home. It’d be great if you can encourage {studentName} to work on these assignments regularly. Your involvement will boost confidence and accelerate the pace of learning of {studentName}.<br><br>Besides doing home assignments, {studentName} can develop learning skills through regular practice at home. Also, you can see {studentName}\'s progress through Gameit’s comprehensive reports and keep track of your child’s learning.<br><br>To get started, setup your parent / guardian account by clicking the button below:<br><br>If the button doesn\'t work, please copy paste the following link in your browser:<br><br>{webPortalUrl}/register?email={email}&invitation={code}<br><br>Thanks,<br><br>{teacherName}<br>{school_name}<br><br>P.S. Please note that you will be signing up for a limited version of Gameit that is completely free of cost. This version will give you access to my assigned practices and progress reports.\", \"header\": \"Invitation\", \"buttonLink\": \"{webPortalUrl}/register?email={email}&invitation={code}\", \"buttonText\": \"Setup Parent / Guardian Account \"}}, \"en_US\": {\"subject\": \"Invitation\", \"templateData\": {\"rtl\": false, \"text\": \"Dear Parent / Guardian,<br><br>Here’s an update about {studentName}. This year, the students will be using this exciting educational program Gameit to improve their skills.<br><br>While we do use Gameit during school hours, I’ll be giving additional assignments on Gameit that students can work on at home. It’d be great if you can encourage {studentName} to work on these assignments regularly. Your involvement will boost confidence and accelerate the pace of learning of {studentName}.<br><br>Besides doing home assignments, {studentName} can develop learning skills through regular practice at home. Also, you can see {studentName}\'s progress through Gameit’s comprehensive reports and keep track of your child’s learning.<br><br>To get started, setup your parent / guardian account by clicking the button below:<br><br>If the button doesn\'t work, please copy paste the following link in your browser:<br><br>{webPortalUrl}/register?email={email}&invitation={code}<br><br>Thanks,<br><br>{teacherName}<br>{school_name}<br><br>P.S. Please note that you will be signing up for a limited version of Gameit that is completely free of cost. This version will give you access to my assigned practices and progress reports.\", \"header\": \"Invitation\", \"buttonLink\": \"{webPortalUrl}/register?email={email}&invitation={code}\", \"buttonText\": \"Setup Parent / Guardian Account \"}}}, \"templateId\": \"d-0995d792612d4c00b948987c093236c4\"}', 1, '2022-05-27 11:52:40', '2022-05-27 11:52:40');
INSERT INTO `mail_templates` (`id`, `name`, `label`, `meta`, `is_active`, `created_at`, `updated_at`) VALUES (20, 'Contact Message', 'contact_form_submit', '{\"languages\": {\"ar_SA\": {\"subject\": \"New Contact Message\", \"templateData\": {\"rtl\": true, \"text\": \"Contact form filled by a visitor on Gameit website.<br><br>Name: {{name}<br><br>Email: {email}<br><br>Phone: {phone}<br><br>Message: {message}\", \"header\": \"New Contact Message\"}}, \"en_US\": {\"subject\": \"New Contact Message\", \"templateData\": {\"rtl\": false, \"text\": \"Contact form filled by a visitor on Gameit website.<br><br>Name: {{name}<br><br>Email: {email}<br><br>Phone: {phone}<br><br>Message: {message}\", \"header\": \"New Contact Message\"}}}, \"templateId\": \"d-0995d792612d4c00b948987c093236c4\"}', 1, '2022-05-27 11:52:40', '2022-05-27 11:52:40');
INSERT INTO `mail_templates` (`id`, `name`, `label`, `meta`, `is_active`, `created_at`, `updated_at`) VALUES (21, 'Password Reset Admin', 'admin_reset_password_request', '{\"languages\": {\"ar_SA\": {\"subject\": \"Password Reset\", \"templateData\": {\"rtl\": true, \"text\": \"You have requested to reset your password.<br><br>You can reset your password by clicking on the button below.<br><br>If the button doesn\'t work, please copy paste the following link in your browser:<br><br>{resetpassword_link}\", \"header\": \"Password Reset\", \"buttonLink\": \"{resetpassword_link}\", \"buttonText\": \"Reset Password\"}}, \"en_US\": {\"subject\": \"Password Reset\", \"templateData\": {\"rtl\": false, \"text\": \"You have requested to reset your password.<br><br>You can reset your password by clicking on the button below.<br><br>If the button doesn\'t work, please copy paste the following link in your browser:<br><br>{resetpassword_link}\", \"header\": \"Password Reset\", \"buttonLink\": \"{resetpassword_link}\", \"buttonText\": \"Reset Password\"}}}, \"templateId\": \"d-0995d792612d4c00b948987c093236c4\"}', 1, '2022-05-27 11:52:40', '2022-05-27 11:52:40');
COMMIT;

-- ----------------------------
-- Table structure for order_items
-- ----------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `order_id` bigint unsigned NOT NULL COMMENT 'Order',
  `product_id` bigint unsigned NOT NULL COMMENT 'Product',
  `product_type` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Product type',
  `quantity` int NOT NULL COMMENT 'Quantity',
  `coins` bigint unsigned NOT NULL COMMENT 'Coins',
  `meta` json DEFAULT NULL COMMENT 'Meta data',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `UNQ_order_items_order_id` (`order_id`) USING BTREE COMMENT 'Order id',
  KEY `UNQ_order_items_product_id` (`product_id`) USING BTREE COMMENT 'Product id',
  CONSTRAINT `fk_order_items_orders_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_order_items_products_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of order_items
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for order_promotion
-- ----------------------------
DROP TABLE IF EXISTS `order_promotion`;
CREATE TABLE `order_promotion` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `order_id` bigint unsigned NOT NULL COMMENT 'Order',
  `promotion_id` bigint unsigned NOT NULL COMMENT 'Promotion',
  `meta` json DEFAULT NULL COMMENT 'Meta data',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `fk_order_promotion_promotions_1` (`promotion_id`) USING BTREE,
  KEY `fk_order_promotion_orders_1` (`order_id`) USING BTREE,
  CONSTRAINT `fk_order_promotion_orders_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_order_promotion_promotions_1` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of order_promotion
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint unsigned NOT NULL COMMENT 'User',
  `agreement_id` bigint unsigned NOT NULL COMMENT 'Agreement',
  `vat_id` bigint unsigned NOT NULL COMMENT 'VAT',
  `payment_status` tinyint unsigned DEFAULT NULL COMMENT 'Payment Status',
  `payment_method` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Payment Method',
  `coins_total` bigint unsigned NOT NULL COMMENT 'Coins (Total)',
  `coins_discount` bigint unsigned NOT NULL COMMENT 'Coins (discount)',
  `coins_payable` bigint unsigned NOT NULL COMMENT 'Coins (payable)',
  `meta` json DEFAULT NULL COMMENT 'Meta data',
  `created_at` datetime DEFAULT NULL COMMENT 'Created',
  `payment_processed_at` datetime DEFAULT NULL COMMENT 'Payment Processed',
  `updated_at` datetime DEFAULT NULL COMMENT 'Updated',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_orders_order_id_users_id` (`user_id`) USING BTREE,
  KEY `fk_orders_agreements_1` (`agreement_id`) USING BTREE,
  KEY `fk_orders_vats_1` (`vat_id`) USING BTREE,
  CONSTRAINT `fk_orders_agreements_1` FOREIGN KEY (`agreement_id`) REFERENCES `agreements` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_orders_order_id_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_vats_1` FOREIGN KEY (`vat_id`) REFERENCES `vats` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of orders
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for product_types
-- ----------------------------
DROP TABLE IF EXISTS `product_types`;
CREATE TABLE `product_types` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Name',
  `description` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Description',
  `status` tinyint unsigned DEFAULT NULL COMMENT 'Status',
  `meta` json DEFAULT NULL COMMENT 'Meta data',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `IDX_product_types_status` (`status`) USING BTREE,
  KEY `UNQ_product_types_name` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of product_types
-- ----------------------------
BEGIN;
INSERT INTO `product_types` (`id`, `name`, `description`, `status`, `meta`) VALUES (1, 'Game', 'Game', 10, '{\"type\": \"GAME\"}');
INSERT INTO `product_types` (`id`, `name`, `description`, `status`, `meta`) VALUES (2, 'Subscription', 'Subscription', 10, '{\"type\": \"SUBSCRIPTION\"}');
INSERT INTO `product_types` (`id`, `name`, `description`, `status`, `meta`) VALUES (3, 'Prepaid', 'Prepaid', 10, '{\"type\": \"PREPAID\"}');
COMMIT;

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `product_type_id` bigint unsigned NOT NULL COMMENT 'Product type',
  `name` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Name',
  `description` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coins` bigint unsigned NOT NULL COMMENT 'Coins',
  `meta` json DEFAULT NULL COMMENT 'Meta data',
  `created_at` datetime DEFAULT NULL COMMENT 'Created',
  `updated_at` datetime DEFAULT NULL COMMENT 'Updated',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `UNQ_producet_name` (`name`) USING BTREE,
  KEY `IDX_producet_coins` (`coins`) USING BTREE,
  KEY `fk_products_product_types_1` (`product_type_id`) USING BTREE,
  CONSTRAINT `fk_products_product_types_1` FOREIGN KEY (`product_type_id`) REFERENCES `product_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of products
-- ----------------------------
BEGIN;
INSERT INTO `products` (`id`, `product_type_id`, `name`, `description`, `coins`, `meta`, `created_at`, `updated_at`) VALUES (1, 2, 'Basic Subscription (15 days)', NULL, 50, '{\"subscription\": {\"id\": 1}}', '2022-06-08 11:20:40', '2022-06-08 11:20:43');
INSERT INTO `products` (`id`, `product_type_id`, `name`, `description`, `coins`, `meta`, `created_at`, `updated_at`) VALUES (2, 1, 'The Adventure of Gizmo and Azzo', NULL, 100, '{\"game\": {\"id\": 1}}', '2022-06-08 11:24:46', '2022-06-08 11:24:49');
INSERT INTO `products` (`id`, `product_type_id`, `name`, `description`, `coins`, `meta`, `created_at`, `updated_at`) VALUES (3, 3, 'Prepaid (200 Coins)', NULL, 200, '{}', '2022-06-08 11:26:34', '2022-06-08 11:26:36');
COMMIT;

-- ----------------------------
-- Table structure for promotions
-- ----------------------------
DROP TABLE IF EXISTS `promotions`;
CREATE TABLE `promotions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `label` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Label',
  `code` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Code',
  `discount_total` bigint unsigned DEFAULT NULL COMMENT 'Discount (Total)',
  `discount_rate` decimal(2,0) DEFAULT NULL COMMENT 'Discount (Percent)',
  `validity_from` datetime NOT NULL COMMENT 'Validity from',
  `validity_to` datetime NOT NULL COMMENT 'Validity to',
  `meta` json DEFAULT NULL COMMENT 'Meta data',
  `created_at` datetime DEFAULT NULL COMMENT 'Created',
  `updated_at` datetime DEFAULT NULL COMMENT 'Updated',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `UNQ_promotions_label` (`label`) USING BTREE COMMENT 'Label'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of promotions
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for refunds
-- ----------------------------
DROP TABLE IF EXISTS `refunds`;
CREATE TABLE `refunds` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint unsigned NOT NULL COMMENT 'User id',
  `order_id` bigint unsigned NOT NULL COMMENT 'Order id',
  `status` tinyint DEFAULT NULL COMMENT 'Status',
  `date` date DEFAULT NULL COMMENT 'Date',
  `amount` decimal(10,2) NOT NULL COMMENT 'Amount',
  `meta` json DEFAULT NULL COMMENT 'Meta data',
  `created_at` datetime DEFAULT NULL COMMENT 'Created',
  `updated_at` datetime DEFAULT NULL COMMENT 'Updated',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `UNQ_refunds_user_id` (`user_id`) USING BTREE COMMENT 'User',
  KEY `UNQ_refunds_order_id` (`order_id`) USING BTREE COMMENT 'Order',
  CONSTRAINT `fk_refunds_orders_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of refunds
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for schools
-- ----------------------------
DROP TABLE IF EXISTS `schools`;
CREATE TABLE `schools` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `owner_id` bigint unsigned NOT NULL COMMENT 'Owner',
  `name` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Name',
  `is_active` smallint DEFAULT '1' COMMENT 'Active',
  `created_at` datetime DEFAULT NULL COMMENT 'Created at',
  `updated_at` datetime DEFAULT NULL COMMENT 'Updated at',
  `meta` json DEFAULT NULL COMMENT 'Meta data',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `UNQ_schools_name` (`name`) USING BTREE,
  KEY `IDX_schools_owner_id` (`owner_id`) USING BTREE,
  CONSTRAINT `FK_users_id_schools_user_id` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of schools
-- ----------------------------
BEGIN;
INSERT INTO `schools` (`id`, `owner_id`, `name`, `is_active`, `created_at`, `updated_at`, `meta`) VALUES (19, 9, 'Test School', 1, '2022-04-28 17:40:24', '2022-04-28 17:40:24', '{\"city\": \"Chakwal\", \"countryCode\": \"PK\"}');
INSERT INTO `schools` (`id`, `owner_id`, `name`, `is_active`, `created_at`, `updated_at`, `meta`) VALUES (20, 21, 'Howe, Jast and Feil', 1, '2022-04-28 17:53:42', '2022-04-28 17:53:42', '{\"city\": \"Chakwal\", \"countryCode\": \"PK\"}');
INSERT INTO `schools` (`id`, `owner_id`, `name`, `is_active`, `created_at`, `updated_at`, `meta`) VALUES (21, 22, 'Schoen Inc', 1, '2022-04-28 17:55:11', '2022-04-28 17:55:11', '{\"city\": \"Chakwal\", \"countryCode\": \"PK\"}');
INSERT INTO `schools` (`id`, `owner_id`, `name`, `is_active`, `created_at`, `updated_at`, `meta`) VALUES (23, 30, 'Kindergarden Public School', 1, '2022-04-29 07:07:03', '2022-04-29 07:07:03', '{\"city\": \"Karachi\", \"countryCode\": \"PK\"}');
INSERT INTO `schools` (`id`, `owner_id`, `name`, `is_active`, `created_at`, `updated_at`, `meta`) VALUES (25, 45, 'Future Girls School', 1, '2022-05-10 07:31:43', '2022-05-10 07:31:43', '{\"city\": \"Istunbul\", \"countryCode\": \"TR\"}');
INSERT INTO `schools` (`id`, `owner_id`, `name`, `is_active`, `created_at`, `updated_at`, `meta`) VALUES (26, 46, 'Hoeger, Stiedemann and Corkery', 1, '2022-05-16 06:14:08', '2022-05-16 06:14:08', '{\"city\": \"Chakwal\", \"countryCode\": \"PK\"}');
COMMIT;

-- ----------------------------
-- Table structure for shopping_cart
-- ----------------------------
DROP TABLE IF EXISTS `shopping_cart`;
CREATE TABLE `shopping_cart` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint unsigned NOT NULL COMMENT 'User',
  `product_id` bigint unsigned NOT NULL COMMENT 'Product',
  `quantity` int unsigned DEFAULT '1' COMMENT 'Quantity',
  `quantiy` int unsigned DEFAULT '1' COMMENT 'Quantity',
  `created_at` datetime DEFAULT NULL COMMENT 'Created',
  `updated_at` datetime DEFAULT NULL COMMENT 'Updated',
  `meta` json DEFAULT NULL COMMENT 'Meta',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNQ_shopping_cart_product_user` (`user_id`,`product_id`),
  KEY `fk_shopping_cart_products_1` (`product_id`),
  CONSTRAINT `fk_shopping_cart_products_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_shopping_cart_users_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of shopping_cart
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for states
-- ----------------------------
DROP TABLE IF EXISTS `states`;
CREATE TABLE `states` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Name',
  `country_code` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Country Code',
  `meta` json DEFAULT NULL COMMENT 'Meta',
  PRIMARY KEY (`id`),
  KEY `IDX_states_country_code` (`country_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of states
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for student_game
-- ----------------------------
DROP TABLE IF EXISTS `student_game`;
CREATE TABLE `student_game` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint unsigned NOT NULL COMMENT 'Assigner User',
  `student_id` bigint unsigned NOT NULL COMMENT 'Student',
  `game_id` bigint unsigned NOT NULL COMMENT 'Game',
  `session_key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Session Key',
  `instructions` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Instructions',
  `status` tinyint unsigned DEFAULT NULL COMMENT 'Status',
  `meta` json DEFAULT NULL COMMENT 'Meta',
  `created_at` datetime DEFAULT NULL COMMENT 'Created at',
  `updated_at` datetime DEFAULT NULL COMMENT 'Updated at',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNQ_student_games_game_id_student_id_session_key` (`game_id`,`student_id`,`session_key`) USING BTREE,
  UNIQUE KEY `UNQ_student_games_session_key` (`session_key`) USING BTREE,
  KEY `IDX_student_games_student_id` (`student_id`) USING BTREE,
  KEY `IDX_student_games_game_id` (`game_id`) USING BTREE,
  KEY `IDX_student_games_user_id` (`user_id`) USING BTREE,
  CONSTRAINT `FK_student_games_game_id` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_student_games_student_id` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_student_games_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of student_game
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for student_game_goals
-- ----------------------------
DROP TABLE IF EXISTS `student_game_goals`;
CREATE TABLE `student_game_goals` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `student_game_id` bigint unsigned NOT NULL COMMENT 'Student game',
  `assigner_id` bigint unsigned NOT NULL COMMENT 'Assigner',
  `student_id` bigint unsigned NOT NULL COMMENT 'Student',
  `game_id` bigint unsigned NOT NULL COMMENT 'Game',
  `game_level` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'all' COMMENT 'Game level',
  `target_pct` decimal(1,1) unsigned DEFAULT '0.0' COMMENT 'Target percentage',
  `reward` int unsigned NOT NULL COMMENT 'Reward (Coins)',
  `status` tinyint unsigned DEFAULT NULL COMMENT 'Status',
  `meta` json DEFAULT NULL COMMENT 'Meta',
  `deadline_at` datetime DEFAULT NULL COMMENT 'Deadline',
  `deleted_at` datetime DEFAULT NULL COMMENT 'Deleted',
  `created_at` datetime DEFAULT NULL COMMENT 'Created',
  `updated_at` datetime DEFAULT NULL COMMENT 'Updated',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNQ_game_goals_composite_unique` (`assigner_id`,`student_id`,`game_id`,`game_level`) USING BTREE,
  KEY `IDX_game_goals_status` (`status`) USING BTREE,
  KEY `IDX_game_goals_deadline_at` (`deadline_at`) USING BTREE,
  KEY `IDX_game_goals_game_level` (`game_level`) USING BTREE,
  KEY `FK_game_goals_game_id` (`game_id`),
  KEY `FK_game_goals_student_id` (`student_id`),
  KEY `fk_student_game_goals_student_game_1` (`student_game_id`),
  CONSTRAINT `FK_game_goals_assigner_id` FOREIGN KEY (`assigner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_game_goals_game_id` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_game_goals_student_id` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_student_game_goals_student_game_1` FOREIGN KEY (`student_game_id`) REFERENCES `student_game` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of student_game_goals
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for students
-- ----------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `fullname` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Fullname',
  `diagnoses` json NOT NULL COMMENT 'Diagnoses',
  `grade` int NOT NULL COMMENT 'Grade',
  `dob` date NOT NULL COMMENT 'D.O.B',
  `meta` json DEFAULT NULL COMMENT 'Meta',
  `created_at` datetime DEFAULT NULL COMMENT 'Created At',
  `updated_at` datetime DEFAULT NULL COMMENT 'Updated At',
  `deleted_at` datetime DEFAULT NULL COMMENT 'Deleted At',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `IDX_students_fullname` (`fullname`) USING BTREE,
  KEY `IDX_students_grade` (`grade`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of students
-- ----------------------------
BEGIN;
INSERT INTO `students` (`id`, `fullname`, `diagnoses`, `grade`, `dob`, `meta`, `created_at`, `updated_at`, `deleted_at`) VALUES (4, 'Ali Student Abc', '[1, 6]', 4, '2001-05-04', '{\"city\": \"Chakwal\", \"gender\": \"BOY\", \"guardian\": {\"id\": 20}, \"countryCode\": \"PK\"}', '2022-06-01 10:13:54', '2022-06-28 12:22:01', NULL);
INSERT INTO `students` (`id`, `fullname`, `diagnoses`, `grade`, `dob`, `meta`, `created_at`, `updated_at`, `deleted_at`) VALUES (5, 'Faizan Abc', '[1, 3]', 4, '2001-05-04', '{\"city\": \"Chakwal\", \"gender\": \"BOY\", \"countryCode\": \"PK\"}', '2022-06-02 05:53:11', '2022-06-02 05:53:11', NULL);
INSERT INTO `students` (`id`, `fullname`, `diagnoses`, `grade`, `dob`, `meta`, `created_at`, `updated_at`, `deleted_at`) VALUES (7, 'Faizan Abc', '[1, 3]', 4, '2001-05-04', '{\"city\": \"Los\", \"gender\": \"BOY\", \"guardian\": {\"id\": 19}, \"countryCode\": \"PK\"}', '2022-06-06 07:55:52', '2022-06-06 07:55:52', NULL);
INSERT INTO `students` (`id`, `fullname`, `diagnoses`, `grade`, `dob`, `meta`, `created_at`, `updated_at`, `deleted_at`) VALUES (9, 'Full Name', '[]', 0, '2022-06-06', '{\"email\": \"email@gmail.com\", \"password\": \"Password@123\", \"username\": \"Amberwe\"}', '2022-06-06 08:54:44', '2022-06-06 08:54:44', NULL);
INSERT INTO `students` (`id`, `fullname`, `diagnoses`, `grade`, `dob`, `meta`, `created_at`, `updated_at`, `deleted_at`) VALUES (10, 'Full Name', '[]', 0, '2022-06-09', '{\"email\": \"email1@gmail.com\", \"password\": \"Password@123\", \"username\": \"Amberwse\"}', '2022-06-09 12:02:19', '2022-06-09 12:02:19', NULL);
INSERT INTO `students` (`id`, `fullname`, `diagnoses`, `grade`, `dob`, `meta`, `created_at`, `updated_at`, `deleted_at`) VALUES (21, 'Faizan Abc', '[1, 3]', 4, '2001-05-04', '{\"city\": \"Los\", \"gender\": \"BOY\", \"guardian\": {\"id\": 20}, \"countryCode\": \"PK\"}', '2022-06-10 09:51:40', '2022-06-10 09:51:40', NULL);
INSERT INTO `students` (`id`, `fullname`, `diagnoses`, `grade`, `dob`, `meta`, `created_at`, `updated_at`, `deleted_at`) VALUES (23, 'Student Name', '[]', 0, '2022-06-13', '{\"email\": \"student@gmail.com\", \"password\": \"Password@123\", \"username\": \"student\"}', '2022-06-13 08:21:38', '2022-06-13 08:21:38', NULL);
INSERT INTO `students` (`id`, `fullname`, `diagnoses`, `grade`, `dob`, `meta`, `created_at`, `updated_at`, `deleted_at`) VALUES (24, 'Student1 Name', '[]', 0, '2022-06-13', '{\"password\": \"Password@123\", \"username\": \"student1\"}', '2022-06-13 09:22:43', '2022-06-13 09:22:43', NULL);
INSERT INTO `students` (`id`, `fullname`, `diagnoses`, `grade`, `dob`, `meta`, `created_at`, `updated_at`, `deleted_at`) VALUES (25, 'Student1 Name', '[]', 0, '2022-06-28', '{\"password\": \"Password@123\", \"username\": \"student01\"}', '2022-06-28 13:28:53', '2022-06-28 13:28:53', NULL);
INSERT INTO `students` (`id`, `fullname`, `diagnoses`, `grade`, `dob`, `meta`, `created_at`, `updated_at`, `deleted_at`) VALUES (26, 'Student1 Name', '[]', 0, '2022-06-28', '{\"password\": \"Password@123\", \"username\": \"student001\"}', '2022-06-28 13:30:51', '2022-06-28 13:30:51', NULL);
COMMIT;

-- ----------------------------
-- Table structure for subscriptions
-- ----------------------------
DROP TABLE IF EXISTS `subscriptions`;
CREATE TABLE `subscriptions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Name',
  `description` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Description',
  `coins` bigint unsigned NOT NULL COMMENT 'Coins',
  `validity` int NOT NULL COMMENT 'Validity (days)',
  `meta` json DEFAULT NULL COMMENT 'Meta data',
  `created_at` datetime DEFAULT NULL COMMENT 'Created',
  `updated_at` datetime DEFAULT NULL COMMENT 'Updated',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of subscriptions
-- ----------------------------
BEGIN;
INSERT INTO `subscriptions` (`id`, `name`, `description`, `coins`, `validity`, `meta`, `created_at`, `updated_at`) VALUES (1, 'Basic', 'All essential features', 50, 15, '{}', '2022-06-08 10:55:09', '2022-06-08 10:55:12');
INSERT INTO `subscriptions` (`id`, `name`, `description`, `coins`, `validity`, `meta`, `created_at`, `updated_at`) VALUES (2, 'Basic Plus', 'All essential features with additional tools', 100, 30, '{}', '2022-06-08 10:55:09', '2022-06-08 10:55:12');
COMMIT;

-- ----------------------------
-- Table structure for teacher_schools
-- ----------------------------
DROP TABLE IF EXISTS `teacher_schools`;
CREATE TABLE `teacher_schools` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `teacher_id` bigint unsigned NOT NULL COMMENT 'Teacher user',
  `school_id` bigint unsigned NOT NULL COMMENT 'School',
  `meta` json DEFAULT NULL COMMENT 'Meta data',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `UNQ_teacher_schools_school_id_teacher_user_id` (`teacher_id`,`school_id`) USING BTREE,
  KEY `IDX_teacher_schools_teacher_user_id` (`teacher_id`) USING BTREE,
  KEY `IDX_teacher_schools_school_id` (`school_id`) USING BTREE,
  CONSTRAINT `FK_teacher_schools_school_id_schools_id` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_teacher_schools_teacher_id_users_id` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of teacher_schools
-- ----------------------------
BEGIN;
INSERT INTO `teacher_schools` (`id`, `teacher_id`, `school_id`, `meta`) VALUES (34, 19, 19, '{\"request\": {\"id\": \"CWqrCoOIisPyklbP\", \"issuedAt\": \"2022-06-01 10:00:09\", \"expiredAt\": \"2022-06-02 10:00:09\"}, \"permission\": \"GRANTED\"}');
INSERT INTO `teacher_schools` (`id`, `teacher_id`, `school_id`, `meta`) VALUES (62, 58, 19, '{\"request\": {\"id\": \"iFchTweZtKWZ30I0\", \"issuedAt\": \"2022-07-01 11:29:10\", \"expiredAt\": \"2022-07-02 11:29:10\"}, \"permission\": \"PENDING\"}');
COMMIT;

-- ----------------------------
-- Table structure for teacher_students
-- ----------------------------
DROP TABLE IF EXISTS `teacher_students`;
CREATE TABLE `teacher_students` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `teacher_id` bigint unsigned NOT NULL COMMENT 'Teacher',
  `student_id` bigint unsigned NOT NULL COMMENT 'Student',
  `meta` json DEFAULT NULL COMMENT 'Meta',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `fk_teacher_students_students_1` (`student_id`) USING BTREE,
  KEY `fk_teacher_students_users_1` (`teacher_id`) USING BTREE,
  CONSTRAINT `fk_teacher_students_students_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_teacher_students_users_1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of teacher_students
-- ----------------------------
BEGIN;
INSERT INTO `teacher_students` (`id`, `teacher_id`, `student_id`, `meta`) VALUES (3, 19, 4, '{\"meta\": {}}');
INSERT INTO `teacher_students` (`id`, `teacher_id`, `student_id`, `meta`) VALUES (4, 19, 5, '{\"meta\": {}}');
COMMIT;

-- ----------------------------
-- Table structure for user_games
-- ----------------------------
DROP TABLE IF EXISTS `user_games`;
CREATE TABLE `user_games` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint unsigned NOT NULL COMMENT 'Guardian',
  `game_id` bigint unsigned NOT NULL COMMENT 'Game',
  `status` tinyint unsigned DEFAULT NULL COMMENT 'Status',
  `meta` json DEFAULT NULL COMMENT 'Meta data',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNQ_user_games_composite` (`user_id`,`game_id`),
  KEY `IDX_user_games_status` (`status`) USING BTREE,
  KEY `FK_user_games_games_id_game_id` (`game_id`),
  CONSTRAINT `FK_user_games_games_id_game_id` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_user_games_users_id_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of user_games
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for user_subscriptions
-- ----------------------------
DROP TABLE IF EXISTS `user_subscriptions`;
CREATE TABLE `user_subscriptions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `subscription_id` bigint unsigned NOT NULL COMMENT 'Subscription',
  `user_id` bigint unsigned NOT NULL COMMENT 'User',
  `meta` json DEFAULT NULL COMMENT 'Meta data',
  `created_at` datetime DEFAULT NULL COMMENT 'Created',
  `expired_at` datetime DEFAULT NULL COMMENT 'Expired',
  `updated_at` datetime DEFAULT NULL COMMENT 'Updated',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `fk_user_subscriptions_user_id_users_id` (`user_id`) USING BTREE,
  KEY `fk_user_subscriptions_subscriptions_1` (`subscription_id`) USING BTREE,
  CONSTRAINT `fk_user_subscriptions_subscriptions_1` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_subscriptions_user_id_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of user_subscriptions
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `fullname` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Fullname',
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Username',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Email address',
  `auth_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Auth key',
  `password` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Password',
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Password hash',
  `password_reset_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Password reset token',
  `role` int NOT NULL COMMENT 'Role',
  `country_code` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Country Code',
  `language` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Language',
  `timezone` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Timezone',
  `is_active` smallint DEFAULT '0' COMMENT 'Active',
  `is_email_verified` smallint DEFAULT '0' COMMENT 'Email verified',
  `created_at` datetime DEFAULT NULL COMMENT 'Created at',
  `updated_at` datetime DEFAULT NULL COMMENT 'Updated at',
  `last_login_at` datetime DEFAULT NULL COMMENT 'Last login at',
  `deleted_at` datetime DEFAULT NULL COMMENT 'Deleted at',
  `meta` json DEFAULT NULL COMMENT 'Meta Data',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `UNQ_users_email` (`email`) USING BTREE,
  UNIQUE KEY `UNQ_users_username` (`username`) USING BTREE,
  UNIQUE KEY `UNQ_users_auth_key` (`auth_key`) USING BTREE,
  KEY `IDX_users_id` (`id`) USING BTREE,
  KEY `IDX_users_role` (`role`) USING BTREE,
  KEY `IDX_users_country_code` (`country_code`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` (`id`, `fullname`, `username`, `email`, `auth_key`, `password`, `password_hash`, `password_reset_token`, `role`, `country_code`, `language`, `timezone`, `is_active`, `is_email_verified`, `created_at`, `updated_at`, `last_login_at`, `deleted_at`, `meta`) VALUES (9, 'faizan rasool', 'faizanrasool5', 'faizan.rasool@invozone.com', 'pDWLWM8jiCzrXR2ZJZyVtILt3q1SFqK6NZc5pV5-', '25c2c9afdd83b8d34234aa2881cc341c09689aaa', '$2a$11$TkJn.e0eNvxIxqCIfjtQP.ikJ.7ORw.P6wniayBXgUSH/LmZNL33i', NULL, 7, 'PK', 'en-US', 'UTC', 1, 1, '2022-05-13 07:44:59', '2022-06-09 12:08:24', '2022-06-09 12:08:24', NULL, '{\"login\": {\"ip\": \"127.0.0.1\", \"dated\": \"2022-06-09 12:08:24\"}, \"activation\": {\"completedAt\": \"2022-05-13 07:47:38\", \"requestedAt\": \"2022-05-13 07:46:23\"}}');
INSERT INTO `users` (`id`, `fullname`, `username`, `email`, `auth_key`, `password`, `password_hash`, `password_reset_token`, `role`, `country_code`, `language`, `timezone`, `is_active`, `is_email_verified`, `created_at`, `updated_at`, `last_login_at`, `deleted_at`, `meta`) VALUES (19, 'Muhammad Uamr', 'muhammadumar', 'muhammad.umar+2@invozone.com', 'kr3hBneY0zOdlMBHI8do5tSZ1bxpiMyU3rYff0f8', '25c2c9afdd83b8d34234aa2881cc341c09689aaa', '$2a$11$MmfgYNAvWqxwELBVQ89L.uril/XSADr4/LT8GvM8uL8Xo0v6tEx4W', NULL, 9, 'PK', 'en-US', 'UTC', 1, 1, '2022-06-01 10:00:09', '2022-06-10 09:50:20', '2022-06-10 09:50:20', NULL, '{\"login\": {\"ip\": \"127.0.0.1\", \"dated\": \"2022-06-10 09:50:20\"}, \"guardian\": {}, \"activation\": {\"pending\": true, \"expiredAt\": \"2022-06-04 10:00:09\", \"verifyCode\": \"267460\", \"completedAt\": null, \"requestedAt\": \"2022-06-01 15:00:09\"}}');
INSERT INTO `users` (`id`, `fullname`, `username`, `email`, `auth_key`, `password`, `password_hash`, `password_reset_token`, `role`, `country_code`, `language`, `timezone`, `is_active`, `is_email_verified`, `created_at`, `updated_at`, `last_login_at`, `deleted_at`, `meta`) VALUES (20, 'Sheikh Teacher', 'sheikhteacher', 'muhammad.umar+3@invozone.com', '0Gygah1r0KevQ95I-QYPpHCcydZ3GgfOwukUw1Hn', '25c2c9afdd83b8d34234aa2881cc341c09689aaa', '$2a$11$HQf/ZvKccVB7AwCXZrQfRORNr7QueV.LfmonEXYGEraRcflCOUnby', NULL, 3, 'PK', 'en-US', 'UTC', 1, 1, '2022-06-01 10:25:44', '2022-06-28 12:22:01', '2022-06-28 12:22:01', NULL, '{\"login\": {\"ip\": \"127.0.0.1\", \"dated\": \"2022-06-28 12:22:01\"}, \"guardian\": {\"gender\": \"FATHER\"}, \"activation\": {\"expiredAt\": \"2022-06-04 10:25:44\", \"verifyCode\": \"629752\", \"completedAt\": \"2022-06-01 15:25:44\", \"requestedAt\": \"2022-06-01 15:25:44\"}}');
INSERT INTO `users` (`id`, `fullname`, `username`, `email`, `auth_key`, `password`, `password_hash`, `password_reset_token`, `role`, `country_code`, `language`, `timezone`, `is_active`, `is_email_verified`, `created_at`, `updated_at`, `last_login_at`, `deleted_at`, `meta`) VALUES (21, 'Faizan Rasool', 'frasool23', 'faizan.rasool+23@invozone.com', 'XyoFhdqczsoPSaexp6mHavDFo_9yBVMi9vFzb6OX', '25c2c9afdd83b8d34234aa2881cc341c09689aaa', '$2a$11$rjd38a2EfEjuPeHqNMH2K.SrFOeQlVqJ1uD9Xt0jgHKQZJcqfeQD2', NULL, 3, 'PK', 'en-US', 'UTC', 1, 1, '2022-06-02 06:00:37', '2022-06-09 10:11:21', '2022-06-09 10:11:21', NULL, '{\"login\": {\"ip\": \"127.0.0.1\", \"dated\": \"2022-06-09 10:11:21\"}, \"guardian\": {\"gender\": \"FATHER\"}, \"activation\": {\"completedAt\": \"2022-06-02 11:21:04\", \"requestedAt\": \"2022-06-02 11:00:37\"}}');
INSERT INTO `users` (`id`, `fullname`, `username`, `email`, `auth_key`, `password`, `password_hash`, `password_reset_token`, `role`, `country_code`, `language`, `timezone`, `is_active`, `is_email_verified`, `created_at`, `updated_at`, `last_login_at`, `deleted_at`, `meta`) VALUES (58, 'Nedw Studdent', 'ndyadhmd04812s3', 'muhammad.umar@invozone.com', '8-FwuH4k9WhzstlySPI32AGh4XhS-slrbip0d3Uw', '25c2c9afdd83b8d34234aa2881cc341c09689aaa', '$2a$11$7QXTCPfcsuMvTYbO/vU8NenpXhd7mCDTM/KHnUtpdcVzgDH.fzxeC', NULL, 7, 'PK', 'en-US', 'UTC', 0, 0, '2022-07-01 11:29:10', '2022-07-01 11:29:10', NULL, NULL, '{\"guardian\": {\"gender\": \"FATHER\"}, \"activation\": {\"pending\": true, \"expiredAt\": \"2022-07-04 11:29:10\", \"verifyCode\": \"578860\", \"completedAt\": null, \"requestedAt\": \"2022-07-01 16:29:10\"}}');
COMMIT;

-- ----------------------------
-- Table structure for vats
-- ----------------------------
DROP TABLE IF EXISTS `vats`;
CREATE TABLE `vats` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `country_code` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Country',
  `percentage` decimal(2,2) NOT NULL COMMENT 'Percentage',
  `status` tinyint unsigned DEFAULT NULL COMMENT 'Status',
  `meta` json DEFAULT NULL COMMENT 'Meta data',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of vats
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for wallet_history
-- ----------------------------
DROP TABLE IF EXISTS `wallet_history`;
CREATE TABLE `wallet_history` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `wallet_id` bigint DEFAULT NULL COMMENT 'Wallet',
  `category` int NOT NULL COMMENT 'Category',
  `transaction_type` enum('CREDIT','DEBIT') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Transaction Type',
  `coins` bigint DEFAULT NULL COMMENT 'Coins',
  `meta` json DEFAULT NULL COMMENT 'Meta data',
  `created_at` datetime DEFAULT NULL COMMENT 'Created',
  `updated_at` datetime DEFAULT NULL COMMENT 'Updated',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `fk_wallet_history_wallets_1` (`wallet_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of wallet_history
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for wallets
-- ----------------------------
DROP TABLE IF EXISTS `wallets`;
CREATE TABLE `wallets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint NOT NULL COMMENT 'User',
  `coins` bigint unsigned NOT NULL DEFAULT '0' COMMENT 'Coins',
  `meta` json DEFAULT NULL COMMENT 'Meta data',
  `created_at` datetime DEFAULT NULL COMMENT 'Created',
  `updated_at` datetime DEFAULT NULL COMMENT 'Updated',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `fk_wallets_user_id_users_id` (`user_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of wallets
-- ----------------------------
BEGIN;
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
