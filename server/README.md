
# User Management Server

This is a GraphQL server for the User Management application, built with Express, Apollo Server, and MySQL.

## Setup

1. Install MySQL and create a database named `user_management`
2. Update the database configuration in `db.js` if needed
3. Install dependencies:
   ```
   npm install
   ```
4. Start the server:
   ```
   npm start
   ```

The GraphQL playground will be available at http://localhost:4000/graphql

## Database Configuration

Update the connection details in `db.js`:

```javascript
const dbConfig = {
  host: 'localhost',
  user: 'root',  // Change to your MySQL username
  password: '',  // Change to your MySQL password
  database: 'user_management'
};
```

## API

### Queries

- `users`: Get all users
- `user(id: ID!)`: Get a specific user by ID

### Mutations

- `createUser(name: String!, birthday: String!, quantity: Int!)`: Create a new user
- `updateUser(id: ID!, name: String, birthday: String, quantity: Int)`: Update a user
- `deleteUser(id: ID!)`: Delete a user
