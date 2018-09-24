CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	product_name VARCHAR(50),
	department_name VARCHAR(50),
	price INTEGER,
	stock_quantity INTEGER

);

DESCRIBE products

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("antique chair", "home", "50", "10");

SELECT * FROM products;

