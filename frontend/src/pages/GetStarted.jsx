import { useState } from 'react';
import '../styles/GetStarted.css';
import Login from '../components/Login';
import Register from '../components/Register';

export default function GetStarted() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="get-started">
      <div className="login-register fade-up" key={isLogin ? 'login' : 'register'}>
        <h1>dailySips</h1>
        {isLogin ? (
          <Login switchToRegister={() => setIsLogin(false)} />
        ) : (
          <Register switchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}