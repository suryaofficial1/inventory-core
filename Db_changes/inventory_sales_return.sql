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
-- Table structure for table `sales_return`
--

DROP TABLE IF EXISTS `sales_return`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_return` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sel_id` int DEFAULT NULL,
  `c_id` int DEFAULT NULL,
  `p_id` int DEFAULT NULL,
  `invoiceNo` varchar(1000) DEFAULT NULL,
  `r_qty` varchar(500) DEFAULT NULL,
  `unit` varchar(500) DEFAULT NULL,
  `s_price` varchar(500) DEFAULT NULL,
  `r_desc` varchar(500) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_on` timestamp NULL DEFAULT NULL,
  `updated_on` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sales_return_ibfk_2` (`c_id`),
  KEY `sales_return_ibfk_3` (`p_id`),
  KEY `sales_return_ibfk_1` (`sel_id`),
  CONSTRAINT `sales_return_ibfk_1` FOREIGN KEY (`sel_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sales_return_ibfk_2` FOREIGN KEY (`c_id`) REFERENCES `customer` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `sales_return_ibfk_3` FOREIGN KEY (`p_id`) REFERENCES `production` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_return`
--

LOCK TABLES `sales_return` WRITE;
/*!40000 ALTER TABLE `sales_return` DISABLE KEYS */;
INSERT INTO `sales_return` VALUES (2,4,20,3,'1GM','1','Mtr','100','ok',1,'2025-04-12 20:06:16','2025-04-16 13:47:29');
/*!40000 ALTER TABLE `sales_return` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-20 22:39:59
