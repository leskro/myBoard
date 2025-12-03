import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

interface Board {
  id: string;
  name: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [newBoardName, setNewBoardName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await api.get('/boards');
        setBoards(res.data);
      } catch (err) {
        console.error('Failed to fetch boards');
      }
    };
    fetchBoards();
  }, []);

  const createBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/boards', { name: newBoardName });
      setBoards([...boards, res.data]);
      setNewBoardName('');
    } catch (err) {
      console.error('Failed to create board');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">myBoard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="text-red-500 hover:text-red-700">Logout</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto mt-8 px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Your Boards</h2>
          <form onSubmit={createBoard} className="flex gap-2">
            <input
              type="text"
              placeholder="New Board Name"
              className="px-4 py-2 border rounded-md"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              required
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Create</button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {boards.map((board) => (
            <Link
              key={board.id}
              to={`/board/${board.id}`}
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-bold text-gray-800">{board.name}</h3>
              <p className="text-sm text-gray-500 mt-2">Open Board &rarr;</p>
            </Link>
          ))}
        </div>

        {boards.length === 0 && (
            <div className="text-center py-12 text-gray-500">
                You don't have any boards yet. Create one above!
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
