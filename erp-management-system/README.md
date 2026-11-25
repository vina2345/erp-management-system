# ERP Management System (Java + React + SQL)

Full-stack ERP with **Spring Boot** REST backend, **React (Vite)** frontend and a **SQL** database (H2 by default, MySQL via profile).

## Modules
Dashboard (revenue, counts, low-stock alerts, recent orders) | Sales Orders | Customers | Inventory | Employees | Departments

## Tech stack
- Backend: Java 17+, Spring Boot 3, Spring Web, Spring Data JPA, Hibernate, Bean Validation, Maven
- Database: H2 (default, in-memory) or MySQL
- Frontend: React 18, React Router, Vite, Fetch API, CSS
- Tools: Postman, Git

## Run the backend
```bash
cd backend
mvn spring-boot:run
```
Runs on http://localhost:8080 (H2 console: /h2-console, JDBC URL `jdbc:h2:mem:erpdb`, user `sa`).
Demo data is inserted automatically on first start.

### Use MySQL instead
1. Edit `backend/src/main/resources/application-mysql.properties` (password).
2. Start MySQL, then run:
```bash
mvn spring-boot:run "-Dspring-boot.run.profiles=mysql"
```
The `erpdb` database and tables are created automatically.

## Run the frontend (needs Node.js 18+)
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173 (backend must be running).

## REST API
| Resource | Endpoints |
|---|---|
| Customers | GET/POST `/api/customers`, GET/PUT/DELETE `/api/customers/{id}` |
| Products | GET/POST `/api/products`, GET/PUT/DELETE `/api/products/{id}` |
| Departments | GET/POST `/api/departments`, GET/PUT/DELETE `/api/departments/{id}` |
| Employees | GET/POST `/api/employees`, GET/PUT/DELETE `/api/employees/{id}` (body: `"department": {"id": 1}`) |
| Orders | GET/POST `/api/orders`, GET `/api/orders/{id}`, PUT `/api/orders/{id}/status?status=SHIPPED` |
| Dashboard | GET `/api/dashboard` |

Place an order: `POST /api/orders` `{ "customerId": 1, "items": [ { "productId": 1, "quantity": 2 } ] }`
Stock is checked and deducted, the total is calculated automatically, and cancelling an order restores stock.

## Project structure
```
backend/   Spring Boot (model, repository, service, controller, exception, config)
frontend/  React app (pages, reusable CrudPage component, api helper)
```
