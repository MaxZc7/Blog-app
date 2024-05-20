import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePost from './components/CreatePost';
import Posts from './components/Posts';
import './App.css';
function Home() {
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [click, setClick] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(
          `http://localhost:8000/verify_token/${token}`
        );
        const data = await response.json();
        setUsername(data.payload.sub);
        if (!response.ok) {
          throw new Error('Token verification failed');
        }
        setIsVerified(true);
      } catch (e) {
        localStorage.removeItem('token');
        navigate('/Login');
      }
    };

    const getGetUserId = async () => {
      try {
        const response = await fetch(`http://localhost:8000/users/${username}`);
        const data = await response.json();
        setUserId(data.id);
        if (!response.ok) {
          throw new Error('User not found');
        }
      } catch (e) {
        throw new Error('User not found');
      }
    };

    verifyToken();
    if (isVerified) {
      getGetUserId();
    }
  }, [navigate, username, isVerified, click]);

  const Logout = () => {
    setClick(!click);
    localStorage.removeItem('token');
  };

  return (
    <>
      <div className="homeContainer mt-12">
        <section></section>
        <section className="mainStartContainer bg-sky-950 p-4 rounded-xl">
          <CreatePost userId={userId} />
          <div className="separator"></div>
          <Posts userId={userId} />
        </section>
        <section className="mainStartContainer">
          <div className="flex justify-center items-center flex-col bg-sky-950 p-4 rounded-xl">
            <h4>
              Logged as:{' '}
              <span className="usernameText">{username ? username : ''}</span>
            </h4>
            <button
              onClick={Logout}
              className="bg-sky-900 mt-2 px-3 py-1 rounded-full hover:opacity-85 transition-all"
            >
              Logout
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
