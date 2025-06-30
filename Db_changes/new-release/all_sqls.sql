TRUNCATE `inventory`.`product`;

TRUNCATE `inventory`.`purchase_return`;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `purchase`;

TRUNCATE `inventory`.`production`;

TRUNCATE `inventory`.`materials`;

TRUNCATE `inventory`.`sales`;

TRUNCATE `inventory`.`sales`;

TRUNCATE `inventory`.`sales_return`;

ALTER TABLE `purchase_return` 
CHANGE COLUMN `product` `p_id` INT NOT NULL ,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`id`),
ADD INDEX `product_ibfk_2_idx` (`p_id` ASC) VISIBLE;
;
ALTER TABLE `inventory`.`purchase_return` 
ADD CONSTRAINT `product_ibfk_2`
  FOREIGN KEY (`p_id`)
  REFERENCES `inventory`.`product` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `production`;
SET FOREIGN_KEY_CHECKS = 1;

ALTER TABLE `inventory`.`materials` 
DROP FOREIGN KEY `purchase_ibfk_2`;
ALTER TABLE `inventory`.`materials` 
ADD INDEX `purchase_ibfk_2_idx` (`product` ASC) VISIBLE,
DROP INDEX `purchase_ibfk_2_idx` ;
;
ALTER TABLE `inventory`.`materials` 
ADD CONSTRAINT `purchase_ibfk_2`
  FOREIGN KEY (`product`)
  REFERENCES `inventory`.`product` (`id`)
  ON DELETE CASCADE;


  ALTER TABLE `inventory`.`purchase_return` 
ADD CONSTRAINT `product_fk`
  FOREIGN KEY (`p_id`)
  REFERENCES `inventory`.`product` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


ALTER TABLE `inventory`.`materials` 
ADD COLUMN `s_id` INT NOT NULL AFTER `product`,
ADD INDEX `suplier_ibfk_3_idx` (`s_id` ASC) VISIBLE;
;
ALTER TABLE `inventory`.`materials` 
ADD CONSTRAINT `suplier_ibfk_3`
  FOREIGN KEY (`s_id`)
  REFERENCES `inventory`.`supplier` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

