-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema gameit-pf
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `gameit-pf` ;

-- -----------------------------------------------------
-- Schema gameit-pf
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `gameit-pf` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `gameit-pf` ;


-- -----------------------------------------------------
-- Table `gameit-pf`.`class`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gameit-pf`.`class` ;

CREATE TABLE IF NOT EXISTS `gameit-pf`.`class` (
  `ClassID` INT NOT NULL,
  `userid` INT NULL DEFAULT NULL,
  `NumberOfStudents` INT NULL DEFAULT NULL,
  `SchoolName` VARCHAR(45) NULL DEFAULT NULL,
  `ClassName` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`ClassID`),
  UNIQUE INDEX `ClassID_UNIQUE` (`ClassID` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gameit-pf`.`cointransaction`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gameit-pf`.`cointransaction` ;

CREATE TABLE IF NOT EXISTS `gameit-pf`.`cointransaction` (
  `CoinTransactionID` INT NOT NULL AUTO_INCREMENT,
  `FromUserID` INT NULL DEFAULT NULL,
  `ToUserID` INT NULL DEFAULT NULL,
  `AmountOfCoins` INT NULL DEFAULT NULL,
  `Status` VARCHAR(45) NULL DEFAULT NULL,
  `TransactionDate` TIMESTAMP NULL DEFAULT NULL,
  `Reason` VARCHAR(45) NULL DEFAULT NULL,
  `Deleted` TINYINT(1) NULL DEFAULT NULL,
  PRIMARY KEY (`CoinTransactionID`),
  UNIQUE INDEX `TransactionID_UNIQUE` (`CoinTransactionID` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gameit-pf`.`confirmation_token`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gameit-pf`.`confirmation_token` ;

CREATE TABLE IF NOT EXISTS `gameit-pf`.`confirmation_token` (
  `token_id` BIGINT NOT NULL AUTO_INCREMENT,
  `confirmation_token` VARCHAR(255) NULL DEFAULT NULL,
  `created_date` DATETIME NULL DEFAULT NULL,
  `user_id` BIGINT NOT NULL,
  PRIMARY KEY (`token_id`),
  INDEX `FKhjrtky9wbd6lbk7mu9tuddqgn` (`user_id` ASC) VISIBLE)
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gameit-pf`.`game`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gameit-pf`.`game` ;

CREATE TABLE IF NOT EXISTS `gameit-pf`.`game` (
  `GameID` INT NOT NULL AUTO_INCREMENT,
  `DiffLanguages` JSON NULL DEFAULT NULL,
  `Version` DOUBLE NULL DEFAULT NULL,
  `Image` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`GameID`),
  UNIQUE INDEX `GameID_UNIQUE` (`GameID` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gameit-pf`.`gamesession`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gameit-pf`.`gamesession` ;

CREATE TABLE IF NOT EXISTS `gameit-pf`.`gamesession` (
  `GameSessionID` INT NOT NULL AUTO_INCREMENT,
  `StudentID` INT NULL DEFAULT NULL,
  `GameID` INT NULL DEFAULT NULL,
  `SkillID` INT NULL DEFAULT NULL,
  `LevelID` INT NULL DEFAULT NULL,
  `SessionType` VARCHAR(45) NULL DEFAULT NULL,
  `SessionData` VARCHAR(255) NULL DEFAULT NULL,
  `ScoreEarned` INT NULL DEFAULT NULL,
  `MinutesInGame` INT NULL DEFAULT NULL,
  `Date` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`GameSessionID`),
  UNIQUE INDEX `GameSessionID_UNIQUE` (`GameSessionID` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gameit-pf`.`gametoskill`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gameit-pf`.`gametoskill` ;

CREATE TABLE IF NOT EXISTS `gameit-pf`.`gametoskill` (
  `GameID` INT NOT NULL,
  `SkillID` INT NOT NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gameit-pf`.`goalbyguardian`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gameit-pf`.`goalbyguardian` ;

CREATE TABLE IF NOT EXISTS `gameit-pf`.`goalbyguardian` (
  `GoalByGuardianID` INT NOT NULL AUTO_INCREMENT,
  `AssignerID` INT NULL DEFAULT NULL,
  `AssigneeID` INT NULL DEFAULT NULL,
  `GameID` INT NULL DEFAULT NULL,
  `SkillID` INT NULL DEFAULT NULL,
  `LevelID` INT NULL DEFAULT NULL,
  `TargetGoal` INT NULL DEFAULT NULL,
  `DateCreated` TIMESTAMP NULL DEFAULT NULL,
  `TimeFrame` TIMESTAMP NULL DEFAULT NULL,
  `Status` VARCHAR(45) NULL DEFAULT NULL,
  `Deleted` TINYINT(1) NULL DEFAULT NULL,
  `CoinTransactionID` INT NULL DEFAULT NULL,
  PRIMARY KEY (`GoalByGuardianID`),
  UNIQUE INDEX `GoalByGuardianID_UNIQUE` (`GoalByGuardianID` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gameit-pf`.`guardian`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gameit-pf`.`guardian` ;

CREATE TABLE IF NOT EXISTS `gameit-pf`.`guardian` (
  `GuardianID` INT NOT NULL,
  `PhoneNumber` INT NOT NULL DEFAULT '0',
  `Payment` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`GuardianID`),
  UNIQUE INDEX `GuardianID_UNIQUE` (`GuardianID` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gameit-pf`.`guardiantostudent`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gameit-pf`.`guardiantostudent` ;

CREATE TABLE IF NOT EXISTS `gameit-pf`.`guardiantostudent` (
  `GuardianID` INT NOT NULL,
  `StudentID` VARCHAR(45) NOT NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

/*
-- -----------------------------------------------------
-- Table `gameit-pf`.`hibernate_sequence`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gameit-pf`.`hibernate_sequence` ;

CREATE TABLE IF NOT EXISTS `gameit-pf`.`hibernate_sequence` (
  `next_val` BIGINT NULL DEFAULT NULL)
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

*/

-- -----------------------------------------------------
-- Table `gameit-pf`.`level`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gameit-pf`.`level` ;

CREATE TABLE IF NOT EXISTS `gameit-pf`.`level` (
  `LevelID` INT NOT NULL AUTO_INCREMENT,
  `LevelName` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`LevelID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gameit-pf`.`persistent_logins`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gameit-pf`.`persistent_logins` ;

CREATE TABLE IF NOT EXISTS `gameit-pf`.`persistent_logins` (
  `username` VARCHAR(64) NOT NULL,
  `series` VARCHAR(64) NOT NULL,
  `token` VARCHAR(64) NOT NULL,
  `last_used` TIMESTAMP NOT NULL,
  PRIMARY KEY (`series`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gameit-pf`.`skill`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gameit-pf`.`skill` ;

CREATE TABLE IF NOT EXISTS `gameit-pf`.`skill` (
  `SkillID` INT NOT NULL AUTO_INCREMENT,
  `SkillName` VARCHAR(45) NULL DEFAULT NULL,
  `SkillDescription` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`SkillID`),
  UNIQUE INDEX `SkillID_UNIQUE` (`SkillID` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gameit-pf`.`skilltolevel`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gameit-pf`.`skilltolevel` ;

CREATE TABLE IF NOT EXISTS `gameit-pf`.`skilltolevel` (
  `SkillID` INT NOT NULL,
  `LevelID` INT NULL DEFAULT NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gameit-pf`.`student`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gameit-pf`.`student` ;

CREATE TABLE IF NOT EXISTS `gameit-pf`.`student` (
  `StudentID` INT NOT NULL,
  `DOB` DATE NULL DEFAULT NULL,
  `NameOfSchool` VARCHAR(45) NULL DEFAULT NULL,
  `Diagnoses` VARCHAR(45) NULL DEFAULT NULL,
  `CountryLiving` VARCHAR(45) NULL DEFAULT NULL,
  `CityName` VARCHAR(45) NULL DEFAULT NULL,
  `ProfilePicture` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`StudentID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gameit-pf`.`studentgame`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gameit-pf`.`studentgame` ;

CREATE TABLE IF NOT EXISTS `gameit-pf`.`studentgame` (
  `StudentGameID` INT NOT NULL AUTO_INCREMENT,
  `StudentID` INT NULL DEFAULT NULL,
  `GameID` INT NULL DEFAULT NULL,
  `GameSessionKey` VARCHAR(255) NULL DEFAULT NULL,
  `InstallationToken` VARCHAR(255) NULL DEFAULT NULL,
  `CreatedDate` TIMESTAMP NULL DEFAULT NULL,
  `Instructions` VARCHAR(255) NULL DEFAULT NULL,
  `InstructionsLanguages` JSON NULL DEFAULT NULL,
  PRIMARY KEY (`StudentGameID`),
  UNIQUE INDEX `StudentGameID_UNIQUE` (`StudentGameID` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gameit-pf`.`studentmilestone`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gameit-pf`.`studentmilestone` ;

CREATE TABLE IF NOT EXISTS `gameit-pf`.`studentmilestone` (
  `StudentMilestoneID` INT NOT NULL,
  `StudentID` INT NULL DEFAULT NULL,
  `GameID` INT NULL DEFAULT NULL,
  `MilestoneID` INT NULL DEFAULT NULL,
  PRIMARY KEY (`StudentMilestoneID`),
  UNIQUE INDEX `StudentMilestoneID_UNIQUE` (`StudentMilestoneID` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gameit-pf`.`teacher`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gameit-pf`.`teacher` ;

CREATE TABLE IF NOT EXISTS `gameit-pf`.`teacher` (
  `TeacherID` INT NOT NULL,
  `ClassID` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`TeacherID`),
  UNIQUE INDEX `TeacherID_UNIQUE` (`TeacherID` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gameit-pf`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gameit-pf`.`user` ;

SET GLOBAL auto_increment_increment=1;

CREATE TABLE IF NOT EXISTS `gameit-pf`.`user` (
  `userid` BIGINT NOT NULL AUTO_INCREMENT,
  `active` INT NULL DEFAULT NULL,
  `coin` INT NULL DEFAULT NULL,
  `creation_time` DATETIME NULL DEFAULT NULL,
  `email_flag` BIT(1) NULL DEFAULT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `expiry_date` DATETIME NULL DEFAULT NULL,
  `first_name` VARCHAR(255) NOT NULL,
  `is_enabled` BIT(1) NULL DEFAULT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `last_seen` DATETIME NULL DEFAULT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `updated_time` DATETIME NULL DEFAULT NULL,
  `user_type` VARCHAR(255) NULL DEFAULT NULL,
  `username` VARCHAR(255) NOT NULL,
  `reset_password_token` VARCHAR(30) NULL DEFAULT NULL,
  `Deleted` TINYINT(1) NULL DEFAULT NULL,
  PRIMARY KEY (`userid`))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `gameit-pf`.`usertoclass`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gameit-pf`.`usertoclass` ;

CREATE TABLE IF NOT EXISTS `gameit-pf`.`usertoclass` (
  `userid` INT NOT NULL,
  `ClassID` VARCHAR(45) NOT NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gameit-pf`.`usertogame`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gameit-pf`.`usertogame` ;

CREATE TABLE IF NOT EXISTS `gameit-pf`.`usertogame` (
  `GuardianID` INT NOT NULL,
  `StudentID` INT NOT NULL,
  UNIQUE INDEX `GuardianID_UNIQUE` (`GuardianID` ASC) VISIBLE,
  UNIQUE INDEX `StudentID_UNIQUE` (`StudentID` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gameit-pf`.`game` fix
-- -----------------------------------------------------

ALTER TABLE `gameit-pf`.`game` 
ADD COLUMN `Ability` VARCHAR(45) NULL AFTER `Image`,
ADD COLUMN `Description` VARCHAR(45) NULL AFTER `Ability`;

INSERT INTO `gameit-pf`.`game` (`GameID`, `Version`, `Image`) VALUES ('1', '1', 'gameit-mvp-installer-v1.0.exe');
INSERT INTO `gameit-pf`.`game` (`GameID`, `Version`, `Image`) VALUES ('2', '1', 'gameit-mvp-installer-v1.0.exe');
INSERT INTO `gameit-pf`.`game` (`GameID`, `Version`, `Image`) VALUES ('3', '1', 'gameit-mvp-installer-v1.0.exe');

ALTER TABLE `gameit-pf`.student
  MODIFY Diagnoses varchar(250) NULL;
  
ALTER TABLE `gameit-pf`.user
add column last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
                     ON UPDATE CURRENT_TIMESTAMP;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
