-- 创建 questions 表
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(36) PRIMARY KEY,
    category_id VARCHAR(36) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_frequent BOOLEAN NOT NULL DEFAULT FALSE,
    `order` VARCHAR(10) NOT NULL DEFAULT '0',
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX idx_questions_category_id ON questions(category_id);
CREATE INDEX idx_questions_order ON questions(`order`);
