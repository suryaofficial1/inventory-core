ALTER TABLE `inventory`.`materials` 
ADD COLUMN `purchaseId` INT NULL AFTER `id`,
CHANGE COLUMN `product` `product` INT NOT NULL AFTER `purchaseId`,
ADD INDEX `purchId_fk_idx` (`purchaseId` ASC) VISIBLE;
;
ALTER TABLE `inventory`.`materials` 
ADD CONSTRAINT `purchId_fk`
  FOREIGN KEY (`purchaseId`)
  REFERENCES `inventory`.`purchase` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE `inventory`.`materials`;
TRUNCATE `inventory`.`sales_return`;
TRUNCATE `inventory`.`sales`;
TRUNCATE `inventory`.`production`;
TRUNCATE `inventory`.`purchase`;
TRUNCATE `inventory`.`purchase_return`;


ALTER TABLE `inventory`.`sales` 
ADD COLUMN `salesName` VARCHAR(500) NULL AFTER `p_id`;

ALTER TABLE `inventory`.`sales_return` 
ADD COLUMN `salesName` VARCHAR(500) NULL AFTER `p_id`;

ALTER TABLE `inventory`.`production` 
ADD COLUMN `batchNo` VARCHAR(500) NULL AFTER `c_id`,
CHANGE COLUMN `m_date` `m_date` TIMESTAMP NULL DEFAULT NULL AFTER `operatorName`;




