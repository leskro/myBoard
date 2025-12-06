# myBoard

A real-time whiteboard collaboration tool (Miro clone) built with the MERN stack (well, PERN stack with Prisma/Postgres/SQLite).

## Features

- **Real-time Collaboration**: See shapes appear instantly on other screens using Socket.io.
- **Board Editor**: Add Rectangles and Circles using Konva.js.
- **Authentication**: Secure JWT-based login and registration.
- **Dashboard**: Manage your boards.
- **Teams**: (Database structure ready for teams).

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, React-Konva
- **Backend**: Node.js, Express, Socket.io
- **Database**: SQLite (Dev) / PostgreSQL (Prod), Prisma ORM
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js (v18+)
- NPM

### Installation

1.  Clone the repository.
2.  Install dependencies for the monorepo:
    ```bash
    npm install
    ```
3.  Install dependencies for workspaces:
    ```bash
    cd client && npm install
    cd ../server && npm install
    ```

### Running the App

From the root directory, run:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3000`
- Frontend client on `http://localhost:5173`

### Database Setup

The project is configured to use SQLite by default for easy local development.

```bash
cd server
npx prisma migrate dev --name init
```

## Future Roadmap

- [ ] Text elements
- [ ] Connectors/Arrows
- [ ] Real-time cursors
- [ ] Image upload
- [ ] Team management UI
