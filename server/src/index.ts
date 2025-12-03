import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import prisma from './prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Allow all origins for simplicity in MVP
  },
});

app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

// Middleware to authenticate
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    res.json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ error: 'User already exists or invalid data' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: 'User not found' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

  const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

// --- BOARD ROUTES ---

app.get('/api/boards', authenticateToken, async (req: any, res) => {
  // Return boards owned by user or where they are a team member
  // For MVP, just return all boards owned by user
  const boards = await prisma.board.findMany({
    where: { ownerId: req.user.userId },
  });
  res.json(boards);
});

app.post('/api/boards', authenticateToken, async (req: any, res) => {
  const { name } = req.body;
  const board = await prisma.board.create({
    data: {
      name,
      ownerId: req.user.userId,
    },
  });
  res.json(board);
});

app.get('/api/boards/:id', authenticateToken, async (req: any, res) => {
  const board = await prisma.board.findUnique({
    where: { id: req.params.id },
    include: { elements: true },
  });
  if (!board) return res.status(404).json({ error: 'Board not found' });
  res.json(board);
});

// --- SOCKET.IO ---

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join-board', (boardId) => {
    socket.join(boardId);
    console.log(`User joined board ${boardId}`);
  });

  socket.on('add-element', async (data) => {
    // data should contain { boardId, element }
    const { boardId, element } = data;

    // Save to DB
    try {
      const savedElement = await prisma.boardElement.create({
        data: {
          boardId: boardId,
          type: element.type,
          x: element.x,
          y: element.y,
          width: element.width,
          height: element.height,
          fill: element.fill,
          content: element.content
        }
      });

      // Broadcast to others in the room
      socket.to(boardId).emit('element-added', savedElement);
    } catch (e) {
      console.error("Error saving element", e);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
