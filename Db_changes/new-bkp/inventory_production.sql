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
-- Table structure for table `production`
--

DROP TABLE IF EXISTS `production`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `production` (
  `id` int NOT NULL AUTO_INCREMENT,
  `c_id` int DEFAULT NULL,
  `p_id` int DEFAULT NULL,
  `p_desc` varchar(1000) DEFAULT NULL,
  `qty` varchar(500) DEFAULT NULL,
  `unit` varchar(500) DEFAULT NULL,
  `operatorName` varchar(500) DEFAULT NULL,
  `materials` varchar(1000) DEFAULT NULL,
  `mqty` varchar(500) DEFAULT NULL,
  `mPrice` varchar(500) DEFAULT NULL,
  `rqty` varchar(500) DEFAULT NULL,
  `rPrice` varchar(500) DEFAULT NULL,
  `lqty` varchar(500) DEFAULT NULL,
  `lPrice` varchar(500) DEFAULT NULL,
  `m_date` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_on` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `c_id` (`c_id`),
  KEY `p_id` (`p_id`),
  CONSTRAINT `production_ibfk_1` FOREIGN KEY (`c_id`) REFERENCES `customer` (`id`) ON DELETE CASCADE,
  CONSTRAINT `production_ibfk_2` FOREIGN KEY (`p_id`) REFERENCES `product` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `production`
--

LOCK TABLES `production` WRITE;
/*!40000 ALTER TABLE `production` DISABLE KEYS */;
INSERT INTO `production` VALUES (1,18,17,'Check update desc','12','Mtr','New OP','[\"q\",\"q\",\"w\",\"w\",\"ee\"]','12','1000','11','122','1000','5000','2025-03-28 18:30:00',1,'2025-03-29 13:24:51'),(2,9,15,'new desc ','1000','Kg','New OP 2','[\"wew ew\",\"ew\",\"ewe\",\"w\",\"e\",\"w\",\"ew\",\"e\"]','33','323`','112','1212','21212','2121','2025-03-28 18:30:00',1,'2025-03-29 13:35:06');
/*!40000 ALTER TABLE `production` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-02 10:05:02
