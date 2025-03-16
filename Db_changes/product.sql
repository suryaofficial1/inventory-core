CREATE TABLE `product` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(500)  NULL,
  `description` VARCHAR(500)  NULL,
  `qty` VARCHAR(500)  NULL,
  `price` VARCHAR(500)  NULL,
  `unit` VARCHAR(500)  NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `created_on` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`));

  -- delete all FOREIGN product_id in all table  

  ALTER TABLE purchase DROP FOREIGN KEY purchase_ibfk_2;
ALTER TABLE purchase ADD CONSTRAINT purchase_ibfk_2 FOREIGN KEY (p_id) REFERENCES product(id) ON DELETE CASCADE;