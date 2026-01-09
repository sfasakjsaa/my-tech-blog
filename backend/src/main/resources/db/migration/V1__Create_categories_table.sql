-- 创建 categories 表
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    `order` VARCHAR(10) NOT NULL DEFAULT '0',
    created_at DATETIME NOT NULL
);
