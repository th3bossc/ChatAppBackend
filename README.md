# Chat Application Backend

This is a backend implementation for a real-time chat application using Node.js, Express, Socket.io, MongoDB, and Prisma. It allows users to register, login, create rooms, join existing rooms, and chat in real-time with other users in the same room.

## Table of contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Usage](#usage)
   - [API Endpoints](#api-endpoints)
- [Structure](#structure)
- [Dependencies](#dependencies)
- [Contribution](#contribution)
- [License](#author)



## Prerequisites

- Node.js installed (v14.0.0 or higher)
- MongoDB installed and running
- Prisma CLI installed globally (`npm install -g prisma`)

## Installation

1. Clone this repository.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.

## Configuration

1. Create a `.env` file based on `.env.example`.
2. Set up your MongoDB connection URI in the `.env` file.
3. Configure other environment variables as needed.

## Database Setup

1. Run `prisma migrate dev` to apply migrations and create the database schema.
2. Seed the database with initial data (optional).

## Usage

1. Start the server using `npm start`.
2. Access the API endpoints using your preferred API client (e.g., Postman).

### API Endpoints

- `POST /user/register`: Register a new user.
- `POST /user/login`: Log in with registered credentials.
- `POST /room/new`: Create a new chat room.
- `GET /room/:roomid`: Join an existing chat room.
- `DELETE /room/:roomId`: Delete an existin room
- `GET /room/users/:roomId`: Get online members in a room.
- `GET /room/messages/:roomId`: Get message history of a room.
- `Get /room/:username`: Get list of all rooms the user has joined
- Socket.io events for real-time communication (see code for implementation details).

## Structure

- `/` contains the application source code.
- `/controllers/` holds route controllers.
- `prisma/` contains Prisma schema and models.
- `routes/` contains all routing logic.
- `nuddleware/` contains jwt authentication logic as well as logging functionality.

## Dependencies

- Express.js - Web framework for Node.js.
- Socket.io - Real-time bidirectional event-based communication.
- MongoDB - Database for storing chat data.
- Prisma - ORM for database interactions.
- Other necessary dependencies (listed in `package.json`).

## Contribution

Feel free to contribute by forking the repository, making changes, and creating a pull request. Bug fixes, improvements, and new features are welcomed.

## Author

[Diljith P D](https://th3bossc.github.io/Portfolio)
