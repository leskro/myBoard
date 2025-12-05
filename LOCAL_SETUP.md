# Local Setup Guide for myBoard

This guide will help you set up the development environment on your local machine.

## Prerequisites

### 1. Git
You need Git to clone the repository.
- **Verify installation**: Open your terminal (Command Prompt, PowerShell, or Terminal on Mac) and run:
  ```bash
  git --version
  ```
- **Install**: If not installed, download from [git-scm.com](https://git-scm.com/downloads).

### 2. Node.js (Runtime Environment)
The project is built with Node.js.
- **Verify installation**:
  ```bash
  node --version
  ```
  (Should be v18 or higher)
- **Install**: Download the LTS version from [nodejs.org](https://nodejs.org/).

## Setup Instructions

### Step 1: Get the Code

Open your terminal and navigate to the folder where you want to store the project. Then run:

```bash
# Clone the repository (replace <YOUR_REPO_URL> with the actual URL)
git clone <YOUR_REPO_URL>

# Enter the project directory
cd myBoard
```

### Step 2: Install Dependencies

This project is a "monorepo" containing both the client (frontend) and server (backend). You need to install dependencies for both.

**Root dependencies:**
```bash
npm install
```

**Server dependencies:**
```bash
cd server
npm install
# Setup database (SQLite for local dev)
npx prisma migrate dev --name init
cd ..
```

**Client dependencies:**
```bash
cd client
npm install
cd ..
```

### Step 3: Run the Application

You can run both the frontend and backend simultaneously from the root directory:

```bash
npm run dev
```

### Step 4: Access the App

- **Frontend**: Open your browser and go to `http://localhost:5173`
- **Backend**: Running on `http://localhost:3000`

## Troubleshooting

- **"Command not found: npm"**: Ensure Node.js is installed and added to your system PATH.
- **"EADDRINUSE"**: This means port 3000 or 5173 is already taken. Close other Node processes or just wait, Vite usually picks the next available port automatically.
- **No Styles?**: Ensure you ran `npm install` inside the `client` folder so Tailwind CSS is installed.

## Git Workflow Basics

To save your work:

```bash
# 1. Check which files changed
git status

# 2. Stage all changes
git add .

# 3. Commit with a message
git commit -m "Description of changes"

# 4. Push to GitHub
git push origin main
```
