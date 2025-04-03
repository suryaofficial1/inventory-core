CREATE DATABASE  IF NOT EXISTS `inventory` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `inventory`;
-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: inventory
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `purchase_return`
--

DROP TABLE IF EXISTS `purchase_return`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_return` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pr_id` int DEFAULT NULL,
  `p_id` int NOT NULL,
  `s_id` int NOT NULL,
  `invoiceNo` varchar(1000) DEFAULT NULL,
  `b_num` varchar(500) DEFAULT NULL,
  `r_qty` varchar(500) DEFAULT NULL,
  `price` varchar(500) DEFAULT NULL,
  `unit` varchar(500) DEFAULT NULL,
  `r_desc` varchar(500) DEFAULT NULL,
  `created_on` timestamp NOT NULL,
  `updated_on` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `suplier_fk_idx` (`s_id`),
  KEY `product_fk_idx` (`p_id`),
  KEY `purchase_return_ibfk_1` (`pr_id`),
  CONSTRAINT `product_fk` FOREIGN KEY (`p_id`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `purchase_return_ibfk_1` FOREIGN KEY (`pr_id`) REFERENCES `purchase` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `suplier_fk` FOREIGN KEY (`s_id`) REFERENCES `supplier` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_return`
--

LOCK TABLES `purchase_return` WRITE;
/*!40000 ALTER TABLE `purchase_return` DISABLE KEYS */;
INSERT INTO `purchase_return` VALUES (4,1,17,21,'ERT01','ABC','1','122','Nos','s','2025-03-16 10:46:25','2025-03-16 10:46:25');
/*!40000 ALTER TABLE `purchase_return` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-02 10:05:03
