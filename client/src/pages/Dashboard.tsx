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
  const [isCreating, setIsCreating] = useState(false);
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
    if (!newBoardName.trim()) return;
    setIsCreating(true);
    try {
      const res = await api.post('/boards', { name: newBoardName });
      setBoards([...boards, res.data]);
      setNewBoardName('');
    } catch (err) {
      console.error('Failed to create board');
    } finally {
        setIsCreating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
                <div className="flex items-center">
                    <div className="flex-shrink-0 flex items-center gap-2">
                         <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                             m
                         </div>
                         <h1 className="text-xl font-bold text-gray-900 tracking-tight">myBoard</h1>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                        Welcome, {user?.name}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                        Log out
                    </button>
                </div>
            </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Your Boards</h2>
            <p className="mt-1 text-sm text-gray-500">Manage your projects and collaborate.</p>
          </div>

          <form onSubmit={createBoard} className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Enter board name..."
              className="flex-1 md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              required
            />
            <button
                type="submit"
                disabled={isCreating}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-colors whitespace-nowrap"
            >
              {isCreating ? 'Creating...' : 'Create Board'}
            </button>
          </form>
        </div>

        {boards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {boards.map((board) => (
                <Link
                key={board.id}
                to={`/board/${board.id}`}
                className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-200"
                >
                <div className="h-40 bg-gray-100 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                    <svg className="w-12 h-12 text-gray-300 group-hover:text-indigo-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                        {board.name}
                    </h3>
                    <div className="mt-4 flex items-center text-sm text-gray-500 font-medium group-hover:translate-x-1 transition-transform">
                        Open Board
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </div>
                </Link>
            ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No boards yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new board above.</p>
            </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
