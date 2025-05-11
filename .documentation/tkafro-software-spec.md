## System Design 2
- Modular design with clear separation of concerns (frontend, backend, database).
- Backend built with Node.js and Express.
- Frontend built with React.
- Scalable architecture suitable for cloud deployment.

## Architecture Pattern
- Traditional client-server architecture with a RESTful API.

## State Management
- Frontend: React Context API with `useReducer` or a state management library like Zustand or Redux Toolkit for managing global UI state.

## Data Flow
- User interacts with the React frontend.
- Frontend sends HTTP requests to the Node.js/Express backend API.
- Backend processes requests, interacts with the database, and returns JSON responses.
- Frontend updates the UI based on the backend response.
- Tailwind CSS provides styling for the frontend.

## Technical Stack
- Frontend: React, Tailwind CSS, JavaScript.
- Backend: Node.js, Express.
- Database: PostgreSQL, MySQL, or MongoDB (choice depends on specific data requirements).
- Payment Gateway Integration: Stripe, PayPal, or similar.
- Cloud Platform (optional): AWS, Google Cloud, Azure.

## Authentication Process
- Optional user accounts:
    - Registration and login functionality implemented in the backend (Node.js/Express).
    - Secure password hashing (e.g., bcrypt).
    - Session management using cookies or JWT (JSON Web Tokens).
- Guest checkout for users who don't want to create an account.

## Route Design
- Frontend (React Router):
    - `/` (Homepage/Menu)
    - `/menu` (Full Menu)
    - `/search?q=:keyword` (Search Results)
    - `/product/:id` (Product Details)
    - `/cart` (Shopping Cart)
    - `/checkout` (Checkout)
    - `/order-tracking/:id` (Order Tracking - if user accounts are implemented)
    - `/pickup` (Local Pickup Information)
- Backend API (Express Routes):
    - `/api/menu` (GET - Retrieve all menu items)
    - `/api/menu/:id` (GET - Retrieve a specific menu item)
    - `/api/menu/search` (GET - Search menu items using query parameter `q`)
    - `/api/cart` (POST - Add to cart, GET - View cart, PUT - Update cart, DELETE - Remove from cart)
    - `/api/orders` (POST - Create new order, GET /:id - Get order details - if user accounts are implemented)
    - `/api/payment/create-session` (POST - Initiate payment session)
    - `/api/payment/webhook` (POST - Payment status updates)
    - `/api/delivery-options` (GET - Get available delivery options)
    - `/api/pickup-locations` (GET - Get available pickup locations)

## API Design
- RESTful API principles.
- JSON for request and response bodies.
- Standard HTTP methods (GET, POST, PUT, DELETE).
- Clear and consistent endpoint naming.
- Implement proper error handling and status codes.

## Database Design ERD
```mermaid
erDiagram
    MENU_ITEM ||--o{ ORDER_ITEM : contains
    ORDER ||--o{ ORDER_ITEM : has
    USER ||--o{ ORDER : places
    DELIVERY_INFO ||--o{ ORDER : uses
    PICKUP_LOCATION ||--o{ ORDER : selected

    MENU_ITEM {
        INT id
        VARCHAR name
        TEXT description
        DECIMAL price
        VARCHAR category
        VARCHAR image_url
        BOOLEAN is_available
    }

    ORDER {
        INT id
        INT user_id
        DATETIME order_date
        VARCHAR order_status
        DECIMAL total_amount
        VARCHAR delivery_address
        VARCHAR contact_number
        INT pickup_location_id
        DATETIME pickup_time
        VARCHAR payment_status
        VARCHAR transaction_id
    }

    ORDER_ITEM {
        INT id
        INT order_id
        INT menu_item_id
        INT quantity
        DECIMAL item_price
    }

    USER {
        INT id
        VARCHAR username
        VARCHAR password_hash
        VARCHAR email
        VARCHAR delivery_address
        VARCHAR contact_number
        DATETIME registration_date
    }

    DELIVERY_INFO {
        INT id
        VARCHAR delivery_address
        VARCHAR contact_number
    }

    PICKUP_LOCATION {
        INT id
        VARCHAR name
        VARCHAR address
        VARCHAR opening_hours
    }