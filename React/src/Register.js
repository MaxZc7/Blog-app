import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      setLoading(false);

      if (response.ok) {
        navigate('/login');
      } else {
        const errorDetails = await response.json();
        throw new Error(errorDetails.detail);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <div className=" mt-4 flex justify-center gap-8 flex-col items-center text-white   ">
        <h1 className="text-xl">Register</h1>
        <form className="formSign" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            className="p-1 px-3  rounded-xl"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            className="p-1  px-3 rounded-xl"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-1 rounded-xl bg-sky-900"
          >
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <span>
          <a style={{ color: 'White', textDecoration: 'none' }} href="/login">
            Already Have an account?
          </a>
        </span>
      </div>
    </>
  );
}

export default Register;
