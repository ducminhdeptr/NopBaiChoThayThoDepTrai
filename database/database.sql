-- =========================================================
-- Coffee Shop Database
-- Database: coffee_shop
-- =========================================================

CREATE DATABASE IF NOT EXISTS coffee_shop
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE coffee_shop;

-- ---------------------------------------------------------
-- Categories
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Products
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  price DECIMAL(12,0) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  category_id INT NOT NULL,
  status ENUM('active','out_of_stock') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Seed categories (per requirement)
-- ---------------------------------------------------------
INSERT INTO categories (name) VALUES
  ('Cà phê pha máy'),
  ('Cà phê truyền thống'),
  ('Trà trái cây'),
  ('Đá xay')
ON DUPLICATE KEY UPDATE name = name;

-- ---------------------------------------------------------
-- Seed products (per requirement)
-- ---------------------------------------------------------
-- Map categories:
-- 1: Cà phê pha máy
-- 2: Cà phê truyền thống
-- 3: Trà trái cây
-- 4: Đá xay

INSERT INTO products (name, price, description, image_url, category_id, status) VALUES
  (
    'Cà phê sữa đá',
    45000,
    'Vị sữa béo nhẹ, cà phê đậm đà, thơm lan tỏa — chuẩn cozy coffee shop.',
    'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80',
    2,
    'active'
  ),
  (
    'Espresso',
    38000,
    'Shot espresso nguyên chất, crema mịn, hậu vị đậm nhưng cân bằng.',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80',
    1,
    'active'
  ),
  (
    'Cold Brew',
    72000,
    'Cold Brew ủ chậm — hương thơm sâu, ít chua, uống mượt và mát lạnh.',
    'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=900&q=80',
    1,
    'active'
  ),
  (
    'Matcha Latte',
    68000,
    'Trà xanh matcha thơm béo, vị ngọt vừa đủ — phong cách Japanese minimalist.',
    'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=900&q=80',
    3,
    'active'
  ),
  (
    'Cappuccino',
    59000,
    'Bọt sữa mịn, vị cân bằng — espresso + milk foam theo tỉ lệ chuẩn.',
    'https://images.unsplash.com/photo-1510464019058-79b3c2c0f2c1?auto=format&fit=crop&w=900&q=80',
    1,
    'active'
  ),
  (
    'Bạc xỉu',
    52000,
    'Sữa và cà phê hòa quyện, nhẹ nhàng, thơm và dễ uống — đúng chất truyền thống.',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd5d58?auto=format&fit=crop&w=900&q=80',
    2,
    'active'
  ),
  (
    'Trà đào cam sả',
    65000,
    'Trà đào thơm thanh, cam tươi và chút sả tạo hương — refreshing cho mọi mùa.',
    'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=80',
    3,
    'active'
  )
ON DUPLICATE KEY UPDATE
  name = VALUES(name);

-- ---------------------------------------------------------
-- Notes
-- ---------------------------------------------------------
-- Nếu bạn muốn ảnh upload qua admin:
-- image_url có thể là /uploads/ten-file.jpg (được tạo bởi multer).
