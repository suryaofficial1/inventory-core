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
-- Table structure for table `purchase`
--

DROP TABLE IF EXISTS `purchase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase` (
  `id` int NOT NULL AUTO_INCREMENT,
  `s_id` int DEFAULT NULL,
  `product` varchar(500) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `invoiceNo` varchar(500) DEFAULT NULL,
  `b_num` varchar(450) DEFAULT NULL,
  `p_order` varchar(1000) DEFAULT NULL,
  `price` varchar(500) DEFAULT NULL,
  `qty` varchar(500) DEFAULT NULL,
  `unit` varchar(500) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `p_date` date DEFAULT NULL,
  `e_date` date DEFAULT NULL,
  `created_on` timestamp NOT NULL,
  PRIMARY KEY (`id`,`product`),
  KEY `purchase_ibfk_1` (`s_id`),
  CONSTRAINT `purchase_ibfk_1` FOREIGN KEY (`s_id`) REFERENCES `supplier` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase`
--

LOCK TABLES `purchase` WRITE;
/*!40000 ALTER TABLE `purchase` DISABLE KEYS */;
INSERT INTO `purchase` VALUES (1,21,'Keyword','ok','VEGP','123',NULL,'1200','40','Nos',1,'2025-02-01','2025-05-02','2025-04-06 10:55:33'),(2,20,'CPU','ok','VMP','1234',NULL,'8000','1000','Box',1,'2025-02-10','2025-05-11','2025-04-06 10:56:32'),(3,19,'Mouse','Mouse','INV','1122',NULL,'100','10','Nos',1,'2025-02-27','2025-05-28','2025-04-06 10:57:42'),(4,18,'Monitor ','ok','GMM','B1',NULL,'4000','10','Nos',1,'2025-03-06','2030-01-01','2025-04-06 10:58:26'),(5,16,'Water Tank','ok','BOL','B2',NULL,'200','10','Nos',1,'2025-03-07','2025-06-05','2025-04-06 10:58:55'),(6,14,'Milk','ok','RSJ','C1',NULL,'200','10','Box',1,'2025-03-13','2025-06-11','2025-04-06 10:59:29'),(7,13,'Ginger','ok','HHK','H1',NULL,'50','10','Kg',1,'2025-04-06','2025-07-06','2025-04-06 11:00:01'),(8,12,'Tea','ok','HKK','H2',NULL,'200','10','Bag',1,'2025-04-06','2025-07-06','2025-04-06 11:00:34'),(9,18,'Sugger','OK','ewwR','32',NULL,'330','100','Kg',1,'2025-04-06','2025-07-06','2025-04-06 13:09:35'),(10,18,'New testing','ok','123','qwe',NULL,'100','20','Kg',1,'2025-04-09','2025-07-08','2025-04-07 17:59:41'),(11,19,'Laptop Bag','Laptop bags','123I','123B',NULL,'550','10','Box',1,'2025-04-07','2025-07-07','2025-04-07 18:06:55');
/*!40000 ALTER TABLE `purchase` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-20 22:39:57
