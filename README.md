# Posts App — REST API & GraphQL Server

Backend for a posts application. This repository contains two versions:

- **`release/RESTful-APIs` branch** — REST API version
<<<<<<< HEAD
- **`main` branch ** — GraphQL version
=======
- **`main branch or release/GraphQl` branch ** — GraphQL version
>>>>>>> 4433875ed3da0b1adc54bf441f61c1421893d0d6

Both versions handle authentication, post CRUD, image uploads, and user status.

---

## Tech Stack

- Node.js with ES modules (`import/export`)
- Express.js v5
- MongoDB via Mongoose
- JWT for authentication
- Multer for image uploads
- bcryptjs for password hashing
- express-validator for input validation
- cors for cross-origin requests
- **GraphQL (main branch or release/GraphQl):** `graphql`, `graphql-http`, `ruru`

---

## Project Structure

### REST API version (`release` branch)

```
server/
├── app.js                  # Entry point, middleware setup
├── controllers/
│   ├── auth.js             # Signup, login
│   ├── feed.js             # Post CRUD
│   └── status.js           # User status get/update
├── middleware/
│   └── isAuth.js           # JWT verification middleware
├── models/
│   ├── post.js             # Post schema
│   └── user.js             # User schema
├── routes/
│   ├── auth.js             # /auth routes
│   ├── feed.js             # /feed routes
│   └── status.js           # /status routes
├── config/
│   ├── allowedOrigins.js   # CORS whitelist
│   └── corsOptions.js      # CORS config
└── images/                 # Uploaded images (static)
```

### GraphQL version (`main` branch)

```
server/
├── app.js                  # Entry point, middleware setup
├── graphql/
│   ├── schema.js           # GraphQL type definitions
│   └── resolvers.js        # Query & mutation resolvers
├── middleware/
│   └── auth.js             # JWT verification middleware
├── models/
│   ├── post.js             # Post schema
│   └── user.js             # User schema
├── config/
│   ├── allowedOrigins.js   # CORS whitelist
│   ├── corsOptions.js      # CORS config
│   └── socket.js           # Socket.io setup
├── util/
│   └── file.js             # clearImage helper
└── images/                 # Uploaded images (static)
```

---

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the server:

```bash
npm start
```

Server runs on `http://localhost:5000`.

---

## REST API Endpoints (`release` branch)

### Auth — `/auth`

| Method | Path    | Auth | Description              |
| ------ | ------- | ---- | ------------------------ |
| POST   | /signup | No   | Register new user        |
| POST   | /login  | No   | Login, returns JWT token |

Signup body:

```json
{ "email": "user@example.com", "password": "12345", "name": "John" }
```

Login response:

```json
{ "token": "<jwt>", "userId": "<id>" }
```

### Posts — `/feed`

All routes require `Authorization: Bearer <token>` header.

| Method | Path          | Description                         |
| ------ | ------------- | ----------------------------------- |
| GET    | /posts        | Get paginated posts (`?page=1`)     |
| POST   | /post         | Create a post (multipart/form-data) |
| GET    | /post/:postId | Get a single post                   |
| PUT    | /post/:postId | Update a post (multipart/form-data) |
| DELETE | /post/:postId | Delete a post                       |

Create/Update post fields (form-data):

- `title` — min 5 characters
- `content` — min 5 characters
- `image` — image file (png, jpg, jpeg)

Only the post creator can update or delete their own posts.

### Status — `/status`

Requires `Authorization: Bearer <token>` header.

| Method | Path | Description             |
| ------ | ---- | ----------------------- |
| GET    | /    | Get current user status |
| PUT    | /    | Update user status      |

Update status body:

```json
{ "status": "Feeling great!" }
```

---

## GraphQL API (`main` branch)

GraphQL endpoint: `POST http://localhost:5000/graphql`

GraphiQL UI (browser): `GET http://localhost:5000/graphql`

### Queries

```graphql
# Get paginated posts
posts(page: Int!): PostsData!

# Get a single post
post(id: ID!): Post!

# Login
login(email: String!, password: String!): AuthData!

# Get current user status
status: String!
```

### Mutations

```graphql
# Register
createUser(userInput: UserData!): User!

# Create a post
createPost(postInput: PostData!): Post!

# Update a post
updatePost(id: ID!, postInput: PostData!): Post!

# Delete a post
deletePost(id: ID!): Boolean!

# Update user status
updateStatus(status: String!): String!
```

### Image Upload

Images are uploaded via a separate REST endpoint before creating/updating a post:

```
POST /post-image
Content-Type: multipart/form-data
Authorization: Bearer <token>

Fields:
  image    — image file (png, jpg, jpeg)
  oldPath  — (optional) path of old image to delete
```

Response:

```json
{ "message": "File stored", "imageUrl": "images/123456-photo.jpg" }
```

Pass the returned `imageUrl` to `createPost` or `updatePost`.

---

## Images

Uploaded images are saved to `server/images/` and served statically at:

```
http://localhost:5000/images/<filename>
```

---

## Authentication

JWT tokens expire after 1 hour. Include the token in every protected request:

```
Authorization: Bearer <token>
```

The auth middleware verifies the token and attaches `req.userId` and `req.isAuth` for use in controllers/resolvers.
