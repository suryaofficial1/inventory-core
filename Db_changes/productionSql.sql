DROP TABLE `inventory`.`materials`;
DROP TABLE `inventory`.`production`;

CREATE TABLE `production` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `c_id` INT NULL,
  `p_id` INT NULL,
  `p_desc` VARCHAR(1000) NULL,
  `qty` VARCHAR(500) NULL,
  `unit` VARCHAR(500) NULL,
  `operatorName` VARCHAR(500) NULL,
 `materials` VARCHAR(1000) NULL,
  `mqty` VARCHAR(500) NULL,
  `mPrice` VARCHAR(500) NULL,
  `rqty` VARCHAR(500) NULL,
  `rPrice` VARCHAR(500) NULL,
  `lqty` VARCHAR(500) NULL,
  `lPrice` VARCHAR(500) NULL,
  `m_date` TIMESTAMP  NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `created_on` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`c_id`) REFERENCES `customer` (`id`) ON DELETE CASCADE
  FOREIGN KEY (`p_id`) REFERENCES `product` (`id`) ON DELETE CASCADE
);
