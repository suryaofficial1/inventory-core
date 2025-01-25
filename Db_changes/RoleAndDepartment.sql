CREATE TABLE `role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `role_name` VARCHAR(500)  NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `created_on` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`));

  CREATE TABLE `department` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `d_name` VARCHAR(500)  NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `created_on` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`));