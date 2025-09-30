-- LiveSell Pro Database Schema for MySQL
-- Database: livesell_production
-- ========================================

-- Create users table
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `facebook_id` varchar(255) NOT NULL,
  `facebook_name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `profile_picture` text,
  `access_token` text,
  `refresh_token` text,
  `token_expires_at` datetime DEFAULT NULL,
  `subscription_status` enum('free','premium','enterprise') DEFAULT 'free',
  `subscription_expires_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `facebook_id` (`facebook_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create facebook_pages table
CREATE TABLE `facebook_pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `page_id` varchar(255) NOT NULL,
  `page_name` varchar(255) NOT NULL,
  `page_access_token` text,
  `page_picture` text,
  `category` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `webhook_subscribed` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `page_id` (`page_id`),
  KEY `user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create live_videos table
CREATE TABLE `live_videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page_id` varchar(255) NOT NULL,
  `video_id` varchar(255) NOT NULL,
  `title` varchar(500) DEFAULT NULL,
  `description` text,
  `status` enum('LIVE','LIVE_STOPPED','VOD','SCHEDULED_UNPUBLISHED','SCHEDULED_LIVE','SCHEDULED_CANCELED') DEFAULT 'SCHEDULED_UNPUBLISHED',
  `permalink_url` text,
  `embed_html` text,
  `live_views` int(11) DEFAULT '0',
  `total_views` int(11) DEFAULT '0',
  `created_time` datetime DEFAULT NULL,
  `scheduled_publish_time` datetime DEFAULT NULL,
  `broadcast_start_time` datetime DEFAULT NULL,
  `broadcast_end_time` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `video_id` (`video_id`),
  KEY `page_id` (`page_id`),
  FOREIGN KEY (`page_id`) REFERENCES `facebook_pages` (`page_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create comments table
CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comment_id` varchar(255) NOT NULL,
  `video_id` varchar(255) NOT NULL,
  `page_id` varchar(255) NOT NULL,
  `commenter_id` varchar(255) DEFAULT NULL,
  `commenter_name` varchar(255) DEFAULT NULL,
  `message` text,
  `created_time` datetime DEFAULT NULL,
  `parent_id` varchar(255) DEFAULT NULL,
  `like_count` int(11) DEFAULT '0',
  `reply_count` int(11) DEFAULT '0',
  `is_hidden` tinyint(1) DEFAULT '0',
  `is_filtered` tinyint(1) DEFAULT '0',
  `sentiment` enum('positive','negative','neutral') DEFAULT 'neutral',
  `contains_keywords` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `comment_id` (`comment_id`),
  KEY `video_id` (`video_id`),
  KEY `page_id` (`page_id`),
  KEY `created_time` (`created_time`),
  FOREIGN KEY (`video_id`) REFERENCES `live_videos` (`video_id`) ON DELETE CASCADE,
  FOREIGN KEY (`page_id`) REFERENCES `facebook_pages` (`page_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create orders table
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` varchar(255) NOT NULL,
  `comment_id` varchar(255) DEFAULT NULL,
  `video_id` varchar(255) NOT NULL,
  `page_id` varchar(255) NOT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `customer_facebook_id` varchar(255) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT '1',
  `price` decimal(10,2) DEFAULT '0.00',
  `total_amount` decimal(10,2) DEFAULT '0.00',
  `currency` varchar(3) DEFAULT 'USD',
  `status` enum('pending','confirmed','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `customer_phone` varchar(50) DEFAULT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `shipping_address` text,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id` (`order_id`),
  KEY `comment_id` (`comment_id`),
  KEY `video_id` (`video_id`),
  KEY `page_id` (`page_id`),
  KEY `status` (`status`),
  FOREIGN KEY (`video_id`) REFERENCES `live_videos` (`video_id`) ON DELETE CASCADE,
  FOREIGN KEY (`page_id`) REFERENCES `facebook_pages` (`page_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create analytics table
CREATE TABLE `analytics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page_id` varchar(255) NOT NULL,
  `video_id` varchar(255) DEFAULT NULL,
  `metric_name` varchar(100) NOT NULL,
  `metric_value` decimal(15,2) DEFAULT '0.00',
  `date_recorded` date NOT NULL,
  `hour_recorded` int(11) DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `page_id` (`page_id`),
  KEY `video_id` (`video_id`),
  KEY `metric_name` (`metric_name`),
  KEY `date_recorded` (`date_recorded`),
  FOREIGN KEY (`page_id`) REFERENCES `facebook_pages` (`page_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create webhooks_log table
CREATE TABLE `webhooks_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `webhook_id` varchar(255) DEFAULT NULL,
  `object_type` varchar(100) DEFAULT NULL,
  `object_id` varchar(255) DEFAULT NULL,
  `field` varchar(100) DEFAULT NULL,
  `value` json DEFAULT NULL,
  `processed` tinyint(1) DEFAULT '0',
  `error_message` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `object_type` (`object_type`),
  KEY `object_id` (`object_id`),
  KEY `processed` (`processed`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default data
INSERT INTO `users` (`facebook_id`, `facebook_name`, `email`, `subscription_status`) VALUES
('demo_user', 'Demo User', 'demo@adsbox.biz', 'premium');

-- Set AUTO_INCREMENT starting values
ALTER TABLE `users` AUTO_INCREMENT = 1000;
ALTER TABLE `facebook_pages` AUTO_INCREMENT = 1000;
ALTER TABLE `live_videos` AUTO_INCREMENT = 1000;
ALTER TABLE `comments` AUTO_INCREMENT = 1000;
ALTER TABLE `orders` AUTO_INCREMENT = 1000;
ALTER TABLE `analytics` AUTO_INCREMENT = 1000;
ALTER TABLE `webhooks_log` AUTO_INCREMENT = 1000;

-- Success message
SELECT 'LiveSell Pro database schema created successfully! Ready for adsbox.biz deployment.' as message;