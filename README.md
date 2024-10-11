# Technical Assessment

## Setup

1. Install NodeJS from https://nodejs.org/en/download/package-manager

2. Install MongoDB Community Server from https://www.mongodb.com/try/download/community and set up a connection

3. Clone repository

    ```
    git clone https://github.com/Dysss/Aviation.git
    ```
3. Install required dependencies

   a. Install backend dependencies
      - Navigate to project root directory in cmd or powershell

   ```
   cd backend
   npm install
   ```


    b. Install frontend dependencies
      - Navigate to project root directory in cmd or powershell

    ```
    cd frontend
    npm install
    ```

4. Setup required backend environment variables

    a. Create a .env file in the backend directory with the following values

    ```
    MONGO_URL=<mongodb_connection_url>
    MONGO_TEST_URL=<mongodb_test_connection_url>
    PORT=<port>
    ```


    b. Create a .env file in the frontend directory with the following values

    ```
    VITE_API_BASE_URL=<backend_api_url>
    VITE_PREVIEW_PORT=<port>
    ```

5. (OPTIONAL) Run tests
    ```
    npm run test
    ```
6. Build Svelte app
    Using the cmd/powershell window in 3b, build the Svelte app using\
    ```
    npm run build
    ```

7. Start applications

    a. Using cmd/powershell window in 3a, run

    ```
    node app.js
    ```
    b. Using cmd/powershell window in 3b, run

    ```
    npm run preview
    ```
Your application should now be running at http://localhost:<frontend_port>
