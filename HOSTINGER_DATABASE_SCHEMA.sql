-- LiveSell Pro - Simple Database Schema for Production
-- =====================================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    facebook_user_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create facebook_integrations table
CREATE TABLE IF NOT EXISTS facebook_integrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    page_id VARCHAR(255) NOT NULL,
    page_name VARCHAR(255) NOT NULL,
    access_token TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create live_streams table
CREATE TABLE IF NOT EXISTS live_streams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    facebook_integration_id INT NOT NULL,
    video_id VARCHAR(255) NOT NULL,
    title VARCHAR(500),
    status ENUM('LIVE', 'ENDED') DEFAULT 'LIVE',
    viewer_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (facebook_integration_id) REFERENCES facebook_integrations(id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    live_stream_id INT NOT NULL,
    comment_id VARCHAR(255) UNIQUE NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_order BOOLEAN DEFAULT FALSE,
    order_value DECIMAL(10,2) DEFAULT NULL,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (live_stream_id) REFERENCES live_streams(id)
);

-- Insert demo admin user (password is 'admin123')
INSERT INTO users (username, email, password_hash) VALUES 
('admin', 'admin@adsbox.biz', '$2b$10$N9qo8uLOickgx2ZMRZoMye/DdaBELJDKBd4IEfSLxgqzHqj3jfRHO');

-- Insert demo Facebook integration
INSERT INTO facebook_integrations (user_id, page_id, page_name, access_token) VALUES 
(1, 'demo_page_123', 'LiveSell Pro Demo Page', 'demo_access_token_replace_with_real');

-- Insert demo live stream
INSERT INTO live_streams (facebook_integration_id, video_id, title, status, viewer_count) VALUES 
(1, 'demo_video_456', 'Welcome to LiveSell Pro!', 'LIVE', 247);

-- Insert demo comments
INSERT INTO comments (live_stream_id, comment_id, user_name, message, is_order, order_value) VALUES 
(1, 'comment_1', 'Sarah Johnson', 'I want to order this product!', TRUE, 29.99),
(1, 'comment_2', 'Mike Chen', 'How much for 2 pieces?', FALSE, NULL),
(1, 'comment_3', 'Emma Davis', 'Add me for 3 units please!', TRUE, 89.97),
(1, 'comment_4', 'David Wilson', 'This looks amazing!', FALSE, NULL),
(1, 'comment_5', 'Lisa Brown', 'I need 5 of these!', TRUE, 149.95);