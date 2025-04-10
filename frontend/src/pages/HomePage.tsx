import React from 'react';
// import { useNavigate } from 'react-router';
// import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const HomePage: React.FC = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <div className="home-container">
      <header>
        <h1>Welcome to the Application</h1>
        {authUser && (
          <div className="user-info">
            <p>Hello, {authUser.fullName}</p>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </header>
      <main>
        <section className="content">
          <h2>Dashboard</h2>
          <p>This is your personal dashboard. More features coming soon!</p>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
