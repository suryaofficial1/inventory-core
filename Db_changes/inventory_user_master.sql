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
-- Table structure for table `user_master`
--

DROP TABLE IF EXISTS `user_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(500) DEFAULT NULL,
  `email` varchar(500) DEFAULT NULL,
  `password` varchar(500) DEFAULT NULL,
  `mobile` varchar(500) DEFAULT NULL,
  `profile` varchar(500) DEFAULT NULL,
  `role_id` int NOT NULL DEFAULT '1',
  `dep_id` int NOT NULL DEFAULT '1',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_on` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_master`
--

LOCK TABLES `user_master` WRITE;
/*!40000 ALTER TABLE `user_master` DISABLE KEYS */;
INSERT INTO `user_master` VALUES (1,'Surya Singh','admin@gmail.com','$2b$10$6uRhKX38uLLnB12O/2l8quhAtCo953JGrx4IfYWiGQvcuMrqIu.He','9876543210','/users_img/user-1737576029.png',2,1,1,'2025-01-24 19:09:36'),(2,'User','user@gmail.com','$2b$10$6uRhKX38uLLnB12O/2l8quhAtCo953JGrx4IfYWiGQvcuMrqIu.He','9876543210','/users_img/user-1737576029.png',3,1,1,'2025-01-24 19:09:36'),(3,'Store manager','store@gmail.com','$2b$10$jrpoVWpNMvAiBzxsMxgEjOpad4lk1eouTZN33fDHH4lAnq2PkQ8zy','9876543211','/users_img/user-1737746306.png',3,2,1,'2025-01-24 19:09:36'),(4,'Alice Johnson','alice.johnson@example.com','$2b$10$jrpoVWpNMvAiBzxsMxgEjOpad4lk1eouTZN33fDHH4lAnq2PkQ8zy','9876543212','/users_img/user-1737746097.png',1,1,1,'2025-01-24 19:09:36'),(5,'Bob Brown','bob.brown@example.com','$2b$10$jrpoVWpNMvAiBzxsMxgEjOpad4lk1eouTZN33fDHH4lAnq2PkQ8zy','9876543213','/users_img/user-1737576029.png',2,2,1,'2025-01-24 19:09:36'),(6,'Charlie Davis','charlie.davis@example.com','$2b$10$jrpoVWpNMvAiBzxsMxgEjOpad4lk1eouTZN33fDHH4lAnq2PkQ8zy','9876543214','/users_img/user-1737746089.png',3,3,1,'2025-01-24 19:09:36'),(7,'Eve White','eve.white@example.com','$2b$10$jrpoVWpNMvAiBzxsMxgEjOpad4lk1eouTZN33fDHH4lAnq2PkQ8zy','9876543215','/users_img/user-1737576029.png',3,4,1,'2025-01-24 19:09:36'),(8,'Frank Harris','frank.harris@example.com','$2b$10$jrpoVWpNMvAiBzxsMxgEjOpad4lk1eouTZN33fDHH4lAnq2PkQ8zy','9876543216','/users_img/user-1737576029.png',1,1,1,'2025-01-24 19:09:36'),(9,'Grace Clark','grace.clark@example.com','$2b$10$jrpoVWpNMvAiBzxsMxgEjOpad4lk1eouTZN33fDHH4lAnq2PkQ8zy','9876543217','/users_img/user-1737746080.png',2,2,1,'2025-01-24 19:09:36'),(10,'Hank Wilson','hank.wilson@example.com','$2b$10$jrpoVWpNMvAiBzxsMxgEjOpad4lk1eouTZN33fDHH4lAnq2PkQ8zy','9876543218','/users_img/user-1737746072.png',3,3,1,'2025-01-24 19:09:36'),(11,'Ivy Lewis','ivy.lewis@example.com','$2b$10$jrpoVWpNMvAiBzxsMxgEjOpad4lk1eouTZN33fDHH4lAnq2PkQ8zy','9876543219','/users_img/user-1737746066.png',3,4,1,'2025-01-24 19:09:36'),(12,'Jack Lee','jack.lee@example.com','$2b$10$jrpoVWpNMvAiBzxsMxgEjOpad4lk1eouTZN33fDHH4lAnq2PkQ8zy','9876543220','/users_img/user-1737746035.png',1,1,1,'2025-01-24 19:09:36'),(13,'Kate Walker','kate.walker@example.com','$2b$10$jrpoVWpNMvAiBzxsMxgEjOpad4lk1eouTZN33fDHH4lAnq2PkQ8zy','9876543221','/users_img/user-1737746027.png',2,2,1,'2025-01-24 19:09:36'),(14,'Liam Hall','liam.hall@example.com','$2b$10$jrpoVWpNMvAiBzxsMxgEjOpad4lk1eouTZN33fDHH4lAnq2PkQ8zy','9876543222','/users_img/user-1737746019.png',3,3,1,'2025-01-24 19:09:36'),(15,'Mia Young','mia.young@example.com','$2b$10$jrpoVWpNMvAiBzxsMxgEjOpad4lk1eouTZN33fDHH4lAnq2PkQ8zy','9876543223','/users_img/user-1737746012.png',3,4,1,'2025-01-24 19:09:36'),(19,'Quinn Baker','quinn.baker@example.com','$2b$10$jrpoVWpNMvAiBzxsMxgEjOpad4lk1eouTZN33fDHH4lAnq2PkQ8zy','9876543227','/users_img/user-1737745837.png',3,4,1,'2025-01-24 19:09:36'),(21,'Paul King','paul.king@example.com','$2b$10$R2CjRC3MqKIf9N8zScxu5Obid6g8qS88XyautrAGQM9UEihAedjoe','9876543226','/users_img/user-1737745877.png',3,3,1,'2025-01-24 19:11:17');
/*!40000 ALTER TABLE `user_master` ENABLE KEYS */;
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
