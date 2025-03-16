CREATE TABLE `sales` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `c_id` INT NULL,
  `p_id` INT NULL,
  `p_desc` VARCHAR(1000)  NULL,
  `qty` VARCHAR(500)  NULL,
  `s_price` VARCHAR(500)  NULL,
  `unit` VARCHAR(500)  NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `s_date` DATE  NULL,
  `created_on` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`c_id`) REFERENCES `customer` (`id`)
  );

ALTER TABLE sales 
ADD CONSTRAINT sales_ibfk_1 
FOREIGN KEY (p_id) REFERENCES product(id) ON DELETE CASCADE;


CREATE TABLE `sales_return` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sel_id` INT NULL,
   `c_id` INT NULL,
  `p_id` INT NULL,
  `invoiceNo` VARCHAR(1000) NULL,
  `r_qty` VARCHAR(500) NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
    `unit` VARCHAR(500)  NULL,
  `s_price` VARCHAR(500)  NULL,
  `created_on` TIMESTAMP NOT NULL,
  `updated_on` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`sel_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE
);