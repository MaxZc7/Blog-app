import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const formValidate = () => {
    if (!username || !password) {
      setError('Please fill all the fields');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValidate()) return;
    setLoading(true);

    const formDetails = new URLSearchParams();
    formDetails.append('username', username);
    formDetails.append('password', password);

    try {
      const response = await fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDetails,
      });
      setLoading(false);

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        navigate('/');
      } else {
        const data = await response.json();
        setError(data.detail || 'Bad auth');
      }
    } catch (error) {
      setLoading(false);
      setError(error.message || 'Sorry an error ocurred, try again later');
    }
  };

  return (
    <>
      <div className=" mt-4 flex justify-center gap-8 flex-col items-center text-white   ">
        <h1 className="text-xl">Login</h1>
        <form className="formSign" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-1 px-3  rounded-xl"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-1 px-3  rounded-xl"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-1 rounded-xl bg-sky-900"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <span>
          <a
            style={{ color: 'White', textDecoration: 'none' }}
            href="/register"
          >
            Not have an account yet?
          </a>
        </span>
      </div>
    </>
  );
}

export default Login;
