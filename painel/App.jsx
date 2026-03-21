import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './components/Login/Login';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import Dashboard from './pages/Dashboard';
import Placeholder from './pages/Placeholder';
import styles from './pages/Layout.module.css';

export default function App() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <Login />;

  const renderPage = () => {
    if (activePage === 'dashboard') return <Dashboard />;
    return <Placeholder page={activePage} />;
  };

  return (
    <div className={styles.layout}>
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className={styles.main}>
        <Header
          activePage={activePage}
          onMenuToggle={() => setSidebarOpen(o => !o)}
        />
        <div className={styles.content}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
