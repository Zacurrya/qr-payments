# QPay

**QPay** is a modern, instant multi-currency mobile payment application that allows users to send and receive payments seamlessly using QR codes.

## Tech Stack

*   **Frontend:** React Native with Expo (Expo Router), styled beautifully using NativeWind v4 and TailwindCSS.
*   **Backend:** Java Spring Boot providing a robust API layer for ledger and account management.
*   **Database & Auth:** Supabase (PostgreSQL) for relational data storage and secure user authentication.
*   **Caching:** Redis for handling high-volume, potentially duplicate requests efficiently and maintaining data integrity.

## Prerequisites

*   [Docker & Docker Compose](https://www.docker.com/)
*   [Node.js](https://nodejs.org/) (if running the frontend locally without Docker)
*   [Java 21+](https://adoptium.net/) (if running the backend locally without Docker)

## Getting Started (Dockerized)

The easiest way to get the entire stack up and running is to use Docker Compose. This will spin up the Frontend, Backend, and a local Redis cache.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Zacurrya/qr-payments.git
    cd qr-payments
    ```

2.  **Set up your environment variables:**
    Ensure you have a `.env` file at the root of the project with your Supabase credentials:
    ```env
    # Backend
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    SPRING_DATASOURCE_PASSWORD=your_db_password
    
    # Frontend
    EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
    EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    EXPO_PUBLIC_API_BASE_URL=http://localhost:8088
    ```

3.  **Build and start the containers:**
    ```bash
    docker compose up --build -d
    ```

4.  **Access the application:**
    *   The **Spring Boot API** will be available at `http://localhost:8088`.
    *   The **Expo Development Server** will run on port `8081`. You can access it by viewing the logs of the frontend container or running `npm run start` locally in the `/frontend` directory.

## Features

*   **Customizable QR Codes:** Generate, colorize, and print high-contrast merchant QR payment stands directly from the app.
*   **Secure Authentication:** Powered by Supabase, handling secure registration and credential verification.
*   **Resilient Ledger:** Backed by Spring Boot and Redis, ensuring payments are processed exactly once even on unstable mobile networks.
