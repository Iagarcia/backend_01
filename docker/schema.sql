-- schema.sql
-- Since we might run the import many times we'll drop if exists
DROP DATABASE IF EXISTS backend_01_db;
CREATE USER backend_01_user WITH SUPERUSER PASSWORD 'backend_01_password';
CREATE DATABASE backend_01_db OWNER backend_01_user;
