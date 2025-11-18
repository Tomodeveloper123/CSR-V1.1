
import React, { useState } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export type View = 'home' | 'login';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<View>('home');

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header activeView={view} setView={setView} />
      <main className="flex-grow">
        {view === 'home' && <Home />}
        {view === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}
      </main>
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; 2025 PT Tomo Teknologi Sinergi, Hak Cipta Dilindungi Undang-Undang.</p>
      </footer>
    </div>
  );
};

export default App;
