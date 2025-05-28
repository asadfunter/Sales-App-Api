# Node.js + MongoDB API Project

This project is a backend API built with **Node.js** using the **Express.js** framework and **MongoDB** as the database. It follows the **RESTful API** architectural style and is designed for efficient and scalable backend operations.

---

## 🚀 Tech Stack

- **Programming Language:** JavaScript (Node.js)
- **Framework:** Express.js
- **Database:** MongoDB
- **API Type:** RESTful API

---

## 📁 Project Setup

### 🔧 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)

### 📥 Clone the Repository

```bash
git clone https://github.com/asadfunter/Sales-App-Api.git
cd Sales-App-Api
```

### 📦 Install Dependencies

```bash
npm install
```

### ⚙️ Environment Configuration

Create a `.env` file in the root directory and add the following:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017
DB_NAME=db_name

```

### ▶️ Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`.

---


### Data Seeding

The data will automatically will be seeded once the project is started.

## 📌 API Endpoints

Here’s a brief explanation of the available RESTful endpoints:

### 📦 Product Routes

- `GET /api/product` – Get a list of products.
- `POST /api/product` – Create a new product.
- `GET /api/product/:id` – Get product details by ID.
- `PUT /api/product/:id` – Update product by ID.
- `DELETE /api/product/:id` – Delete product by ID.


### 📦 Sales Routes

- `GET /api/sales` – Get a list of sales.
- `GET /api/sales-revenue` – Get Sales Revenue By Period example : daily, monthly, weekly, yearly.
- `GET /api/sales-revenue-by-period` – Compare Sales Revenue between given periods.
- `GET /api/sales-revenue-by-category` – Compare Sales Revenue between given categories.


### 📦 Inventory Routes

- `GET /api/inventory` – Get a list of inventory with lowStock flag to get inventory with lower stocks.
- `PUT /inventory/add-stock/:id` – Add quantity to inventory of specific product.

---

## 🛠️ Development Scripts

- `npm start` – Start server in development mode.

---

## 📂 Folder Structure

```bash
.
├── src/controllers/
├── src/models/
├── configs/
├── utils/
├── src/routes/
├── src/validators/
├── index.js
├── .env
└── package.json
```

---

## 📃 License

This project is open source and available under the [MIT License](LICENSE).

---

## ✉️ Contact

For questions or feedback, feel free to contact [asadahmed9619@gmail.com](mailto:asadahmed9619@gmail.com).
