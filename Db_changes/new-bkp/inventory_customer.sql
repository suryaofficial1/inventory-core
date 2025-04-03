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
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(500) DEFAULT NULL,
  `v_code` varchar(500) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `location` varchar(500) DEFAULT NULL,
  `contact` varchar(500) DEFAULT NULL,
  `gstin` varchar(500) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_on` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1,'John Doe','1-John','123 Main Street','New York','9876543210','22AAAAA0000A1Z5',1,'2025-01-24 19:33:03'),(2,'Jane Smith','2-Jane','456 Market Road','Los Angeles','9876543211','33BBBBB1111B2Z6',0,'2025-01-24 19:33:03'),(3,'Alice Johnson','3-Alic','789 Broadway','Chicago','9876543212','44CCCCC2222C3Z7',1,'2025-01-24 19:33:03'),(4,'Bob Brown','4-Bob ','101 First Avenue','Houston','9876543213','55DDDDD3333D4Z8',1,'2025-01-24 19:33:03'),(5,'Charlie Davis','5-Char','202 Oak Street','Miami','9876543214','66EEEEE4444E5Z9',1,'2025-01-24 19:33:03'),(6,'Eve White','6-Eve ','303 Maple Drive','Seattle','9876543215','77FFFFF5555F6Z0',1,'2025-01-24 19:33:03'),(7,'Frank Harris','7-Fran','404 Pine Lane','San Francisco','9876543216','88GGGGG6666G7Z1',1,'2025-01-24 19:33:03'),(8,'Grace Clark','8-Grac','505 Birch Boulevard','Boston','9876543217','99HHHHH7777H8Z2',1,'2025-01-24 19:33:03'),(9,'Hank Wilson','9-Hank','606 Cedar Street','Dallas','9876543218','11IIIIII8888I9Z3',1,'2025-01-24 19:33:03'),(10,'Ivy Lewis','10-Ivy ','707 Spruce Avenue','Phoenix','9876543219','22JJJJJ9999J0Z4',1,'2025-01-24 19:33:03'),(11,'Jack Lee','11-Jack','808 Redwood Drive','Portland','9876543220','33KKKKK0000K1Z5',1,'2025-01-24 19:33:03'),(12,'Kate Walker','12-Kate','909 Willow Road','Denver','9876543221','44LLLLL1111L2Z6',1,'2025-01-24 19:33:03'),(15,'Noah Scott','15-Noah','1212 Maple Grove','Las Vegas','9876543224','77OOOOO4444O5Z9',1,'2025-01-24 19:33:03'),(16,'Olivia Adams','16-Oliv','1313 Birch Court','Sacramento','9876543225','88PPPPP5555P6Z0',1,'2025-01-24 19:33:03'),(17,'Paul King','17-Paul','1414 Cedar Street','Tampa','9876543226','99QQQQQ6666Q7Z1',1,'2025-01-24 19:33:03'),(18,'Quinn Baker','18-Quin','1515 Oak Ridge','Miami','9876543227','11RRRRR7777R8Z2',1,'2025-01-24 19:33:03'),(20,'Sophia Adams','New vender','1717 Redwood Trail','Charlotte','987654322aaaa','33TTTTT9999T0Z4',1,'2025-01-24 19:33:03');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
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
