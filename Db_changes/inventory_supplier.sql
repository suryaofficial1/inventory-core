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
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(500) DEFAULT NULL,
  `vendor_code` varchar(500) DEFAULT NULL,
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
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
INSERT INTO `supplier` VALUES (1,'ABC Traders','VEND001','123 Market Street','New York','9876543210','22AAAAA0000A1Z5',1,'2025-01-24 19:30:59'),(2,'XYZ Enterprises','VEND002','45 Industrial Road','Chicago','9876543211','33BBBBB1111B2Z6',1,'2025-01-24 19:30:59'),(3,'PQR Supplies','VEND003','78 Commercial Avenue','Los Angeles','9876543212','44CCCCC2222C3Z7',1,'2025-01-24 19:30:59'),(4,'Global Exports','VEND004','12 Export Lane','Houston','9876543213','55DDDDD3333D4Z8',1,'2025-01-24 19:30:59'),(5,'Local Distributors','VEND005','34 Distributor Street','Miami','9876543214','66EEEEE4444E5Z9',1,'2025-01-24 19:30:59'),(6,'Fresh Mart','VEND006','56 Fresh Plaza','Boston','9876543215','77FFFFF5555F6Z0',1,'2025-01-24 19:30:59'),(7,'Oceanic Foods','VEND007','67 Seafood Lane','San Diego','9876543216','88GGGGG6666G7Z1',1,'2025-01-24 19:30:59'),(8,'Metro Supplies','VEND008','89 Metro Boulevard','Seattle','9876543217','99HHHHH7777H8Z2',1,'2025-01-24 19:30:59'),(9,'Urban Essentials','VEND009','21 Urban Street','Denver','9876543218','11IIIIII8888I9Z3',1,'2025-01-24 19:30:59'),(10,'Eco Goods','VEND010','32 Eco Park','Portland','9876543219','22JJJJJ9999J0Z4',1,'2025-01-24 19:30:59'),(11,'Prime Wholesalers','VEND011','43 Prime Avenue','San Francisco','9876543220','33KKKKK0000K1Z5',1,'2025-01-24 19:30:59'),(12,'Quality Traders','VEND012','54 Quality Road','Dallas','9876543221','44LLLLL1111L2Z6',1,'2025-01-24 19:30:59'),(13,'Healthy Harvest','VEND013','65 Harvest Street','Austin','9876543222','55MMMMM2222M3Z7',1,'2025-01-24 19:30:59'),(14,'Reliable Supplies','VEND014','76 Reliable Lane','Phoenix','9876543223','66NNNNN3333N4Z8',1,'2025-01-24 19:30:59'),(16,'Blue Ocean','VEND016','98 Blue Street','Orlando','9876543225','88PPPPP5555P6Z0',1,'2025-01-24 19:30:59'),(17,'Tech Supplies','VEND017','23 Tech Park','San Jose','9876543226','99QQQQQ6666Q7Z1',1,'2025-01-24 19:30:59'),(18,'Global Mart','VEND018','34 Global Plaza','Sacramento','9876543227','11RRRRR7777R8Z2',1,'2025-01-24 19:30:59'),(19,'NextGen Supplies','VEND019','45 NextGen Boulevard','Las Vegas','9876543228','22SSSSS8888S9Z3',1,'2025-01-24 19:30:59'),(20,'Value Mart','VEND020','56 Value Street','Charlotte','9876543229','33TTTTT9999T0Z4',1,'2025-01-24 19:30:59'),(21,'Elite Goods','VEND021','67 Elite Road','Tampa','9876543230','44UUUUU0000U1Z5',1,'2025-01-24 19:30:59');
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-20 22:39:58
