import '../styles/GetStarted.css';
import Login from '../components/Login';
import Register from '../components/Register';

export default function GetStarted() {
  return (
    <div className="get-started">
      <div className="login-register">
        <h1>dailySips</h1>
        <Login />
        <Register />
      </div>
    </div>
  );
}