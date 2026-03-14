# survivor-experience-backend
REST API for the Survivor Experience gym class reservation system, built with Node.js, Express, Sequelize ORM and MySQL.

## Stack
- Node.js
- Express
- Sequelize ORM
- MySQL
- dotenv
- CORS
- Nodemon (dev)

## Prerequisites
- Node.js v18+
- MySQL + MySQL Workbench

## Installation
1. Clone the repository
git clone https://github.com/TiffanniTobon/survivor-experience-backend.git

2. Install dependencies
npm install

3. Create your .env file based on .env.example
cp .env.example .env

4. Fill in your credentials in .env
PORT=3000
DB_HOST=localhost
DB_NAME=survivor_experience
DB_USER=root
DB_PASSWORD=****

5. Create the database in MySQL Workbench
CREATE DATABASE survivor_experience;

## Running the server
npm run dev