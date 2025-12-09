DROP TABLE `vehicle`;
CREATE TABLE `vehicle` (
  `vehicle_id` int NOT NULL AUTO_INCREMENT,
  `number_plate` varchar(20) NOT NULL,
  `type` varchar(45) NOT NULL,
  `description` varchar(250) NOT NULL,
  `passenger_count` int NOT NULL,
  `cost_per_km` decimal(10,2) NOT NULL,
  `booking_price` decimal(10,2) NOT NULL,
  `status` varchar(45) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_delete` tinyint NOT NULL DEFAULT '0',
  `vehicle_name` varchar(250) NOT NULL,
  `owner_id` int NOT NULL,
  `document_url` varchar(250) NOT NULL,
  PRIMARY KEY (`vehicle_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE `vehicle_owners`;
CREATE TABLE `vehicle_owners` (
  `owner_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `nic` varchar(20) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `addressLine1` varchar(50) NOT NULL,
  `addressLine2` varchar(50) NOT NULL,
  `state_province` varchar(45) NOT NULL,
  `postalCode` varchar(45) NOT NULL,
  `date_of_birth` date NOT NULL,
  `owner_image` varchar(250) NOT NULL,
  `is_delete` tinyint NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`owner_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;