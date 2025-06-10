# Installation
## UI Setup

```bash
cd web
npm install
ng serve
```

## API Setup

1. Add `PORT` variable in your `.env` file.
2. Install dependencies and start the server:

    ```bash
    cd api
    npm install
    nodemon server.js
    ```

## Database Setup

1. Update your `.env` file with the correct database credentials.
2. Run the `.ddls` file in your MySQL database to set up the schema.