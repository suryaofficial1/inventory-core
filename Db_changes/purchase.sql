CREATE TABLE `purchase` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `s_id` INT NULL,
  `p_id` INT NULL,
  `invoiceNo` VARCHAR(1000) NULL,
  `b_num` VARCHAR(1000) NULL,
  `description` VARCHAR(1000)  NULL,
  `p_order` VARCHAR(1000)  NULL,
  `price` VARCHAR(500)  NULL,
  `qty` VARCHAR(500)  NULL,
  `unit` VARCHAR(500)  NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `p_date` DATE NULL,
  `e_date` DATE NULL,
  `created_on` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`s_id`) REFERENCES `supplier` (`id`),
  FOREIGN KEY (`p_id`) REFERENCES `product` (`id`)
);


CREATE TABLE `purchase_return` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `pr_id` INT NULL,
  `invoiceNo` VARCHAR(1000) NULL,
  `b_num` VARCHAR(450) NULL,
  `r_qty` VARCHAR(500) NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `created_on` TIMESTAMP NOT NULL,
  `updated_on` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`pr_id`) REFERENCES `purchase` (`id`) ON DELETE CASCADE
);