-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: db_user_center
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tab_login_log`
--

DROP TABLE IF EXISTS `tab_login_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tab_login_log` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `user_id` bigint unsigned DEFAULT NULL COMMENT '用户ID',
  `account` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '登录账号',
  `login_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登录时间',
  `login_ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '登录IP',
  `user_agent` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户代理',
  `login_result` tinyint NOT NULL COMMENT '登录结果：1成功 0失败',
  `fail_reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '失败原因',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_account` (`account`),
  KEY `idx_login_time` (`login_time`),
  KEY `idx_login_result` (`login_result`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='登录日志表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tab_login_log`
--

LOCK TABLES `tab_login_log` WRITE;
/*!40000 ALTER TABLE `tab_login_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `tab_login_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tab_permission`
--

DROP TABLE IF EXISTS `tab_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tab_permission` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '权限ID',
  `parent_id` bigint unsigned NOT NULL DEFAULT '0' COMMENT '父级权限ID',
  `permission_code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '权限编码，如:user:create',
  `permission_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '权限名称',
  `permission_type` tinyint NOT NULL DEFAULT '1' COMMENT '权限类型：1菜单 2按钮 3接口',
  `path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '前端路由/接口路径',
  `method` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'HTTP方法：GET/POST/PUT/DELETE',
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '菜单图标',
  `sort_no` int NOT NULL DEFAULT '0' COMMENT '排序号',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：1启用 0禁用',
  `is_deleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除：0否 1是',
  `remark` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_permission_code` (`permission_code`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_permission_type` (`permission_type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tab_permission`
--

LOCK TABLES `tab_permission` WRITE;
/*!40000 ALTER TABLE `tab_permission` DISABLE KEYS */;
INSERT INTO `tab_permission` VALUES (1,0,'user:manage','用户管理',1,'/user',NULL,NULL,1,1,0,NULL,'2026-04-17 19:34:15','2026-04-17 19:34:15'),(2,0,'role:manage','角色管理',1,'/role',NULL,NULL,2,1,0,NULL,'2026-04-17 19:34:15','2026-04-17 19:34:15'),(3,0,'permission:manage','权限管理',1,'/permission',NULL,NULL,3,1,0,NULL,'2026-04-17 19:34:15','2026-04-17 19:34:15'),(4,0,'user:list','用户列表',3,'/api/user/list','GET',NULL,11,1,0,NULL,'2026-04-17 19:34:15','2026-04-17 19:34:15'),(5,0,'user:create','创建用户',3,'/api/user/create','POST',NULL,12,1,0,NULL,'2026-04-17 19:34:15','2026-04-17 19:34:15'),(6,0,'user:update','修改用户',3,'/api/user/update','PUT',NULL,13,1,0,NULL,'2026-04-17 19:34:15','2026-04-17 19:34:15'),(7,0,'user:delete','删除用户',3,'/api/user/delete','DELETE',NULL,14,1,0,NULL,'2026-04-17 19:34:15','2026-04-17 19:34:15');
/*!40000 ALTER TABLE `tab_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tab_role`
--

DROP TABLE IF EXISTS `tab_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tab_role` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_code` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '角色编码，如：admin',
  `role_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '角色名称',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：1启用 0禁用',
  `sort_no` int NOT NULL DEFAULT '0' COMMENT '排序号',
  `is_deleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除：0否 1是',
  `remark` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_code` (`role_code`),
  KEY `idx_status` (`status`),
  KEY `idx_is_deleted` (`is_deleted`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tab_role`
--

LOCK TABLES `tab_role` WRITE;
/*!40000 ALTER TABLE `tab_role` DISABLE KEYS */;
INSERT INTO `tab_role` VALUES (1,'admin','超级管理员',1,1,0,'系统默认超级管理员','2026-04-17 19:14:56','2026-04-17 19:14:56'),(2,'user','普通用户',1,2,0,'系统默认普通用户','2026-04-17 19:15:24','2026-04-17 19:15:24');
/*!40000 ALTER TABLE `tab_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tab_role_permission`
--

DROP TABLE IF EXISTS `tab_role_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tab_role_permission` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `role_id` bigint unsigned NOT NULL COMMENT '角色ID',
  `permission_id` bigint unsigned NOT NULL COMMENT '权限ID',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_permission` (`role_id`,`permission_id`),
  KEY `idx_permission_id` (`permission_id`),
  CONSTRAINT `fk_role_permission_permission_id` FOREIGN KEY (`permission_id`) REFERENCES `tab_permission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_role_permission_role_id` FOREIGN KEY (`role_id`) REFERENCES `tab_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色权限关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tab_role_permission`
--

LOCK TABLES `tab_role_permission` WRITE;
/*!40000 ALTER TABLE `tab_role_permission` DISABLE KEYS */;
INSERT INTO `tab_role_permission` VALUES (1,1,1,'2026-04-17 19:34:23'),(2,1,2,'2026-04-17 19:34:23'),(3,1,3,'2026-04-17 19:34:23'),(4,1,4,'2026-04-17 19:34:23'),(5,1,5,'2026-04-17 19:34:23'),(6,1,6,'2026-04-17 19:34:23'),(7,1,7,'2026-04-17 19:34:23');
/*!40000 ALTER TABLE `tab_role_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tab_user_info`
--

DROP TABLE IF EXISTS `tab_user_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tab_user_info` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `account` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '登录账号',
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码哈希值',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：1启用 0禁用 2锁定',
  `login_fail_count` int NOT NULL DEFAULT '0' COMMENT '连续登录失败次数',
  `last_login_at` datetime DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '最后登录IP',
  `password_updated_at` datetime DEFAULT NULL COMMENT '最后修改密码时间',
  `is_deleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除：0否 1是',
  `remark` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `created_by` bigint unsigned DEFAULT NULL COMMENT '创建人ID',
  `updated_by` bigint unsigned DEFAULT NULL COMMENT '更新人ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_account` (`account`),
  KEY `idx_status` (`status`),
  KEY `idx_is_deleted` (`is_deleted`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户账号表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tab_user_info`
--

LOCK TABLES `tab_user_info` WRITE;
/*!40000 ALTER TABLE `tab_user_info` DISABLE KEYS */;
INSERT INTO `tab_user_info` VALUES (1,'admin','$2b$10$abcdefghijklmnopqrstuvABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',1,0,NULL,NULL,'2026-04-17 19:33:25',0,'系统初始化管理员','2026-04-17 19:33:25','2026-04-17 19:33:25',NULL,NULL);
/*!40000 ALTER TABLE `tab_user_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tab_user_profile`
--

DROP TABLE IF EXISTS `tab_user_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tab_user_profile` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint unsigned NOT NULL COMMENT '用户ID',
  `real_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '真实姓名',
  `nick_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '昵称',
  `avatar_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像地址',
  `gender` tinyint NOT NULL DEFAULT '0' COMMENT '性别：0未知 1男 2女',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `mobile` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机号',
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '邮箱',
  `country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '国家',
  `province` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '省份',
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '城市',
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '详细地址',
  `remark` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  UNIQUE KEY `uk_mobile` (`mobile`),
  UNIQUE KEY `uk_email` (`email`),
  CONSTRAINT `fk_user_profile_user_id` FOREIGN KEY (`user_id`) REFERENCES `tab_user_info` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户资料表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tab_user_profile`
--

LOCK TABLES `tab_user_profile` WRITE;
/*!40000 ALTER TABLE `tab_user_profile` DISABLE KEYS */;
INSERT INTO `tab_user_profile` VALUES (1,1,'系统管理员','admin',NULL,0,NULL,'13800000000','admin@example.com',NULL,NULL,NULL,NULL,NULL,'2026-04-17 19:33:32','2026-04-17 19:33:32');
/*!40000 ALTER TABLE `tab_user_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tab_user_role`
--

DROP TABLE IF EXISTS `tab_user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tab_user_role` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint unsigned NOT NULL COMMENT '用户ID',
  `role_id` bigint unsigned NOT NULL COMMENT '角色ID',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_role` (`user_id`,`role_id`),
  KEY `idx_role_id` (`role_id`),
  CONSTRAINT `fk_user_role_role_id` FOREIGN KEY (`role_id`) REFERENCES `tab_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_role_user_id` FOREIGN KEY (`user_id`) REFERENCES `tab_user_info` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tab_user_role`
--

LOCK TABLES `tab_user_role` WRITE;
/*!40000 ALTER TABLE `tab_user_role` DISABLE KEYS */;
INSERT INTO `tab_user_role` VALUES (1,1,1,'2026-04-17 19:33:36');
/*!40000 ALTER TABLE `tab_user_role` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-17 22:01:09
