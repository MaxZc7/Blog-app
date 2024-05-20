import React, { useEffect, useState } from 'react';
import Popup from './PopUp';
function Posts({ userId }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetch('http://localhost:8000/get-posts');
        const data = await response.json();
        setPosts(data);
        console.log(data);
      } catch (e) {
        console.log(e.message);
      }
    };
    getPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/delete-post/${postId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.ok) {
        window.location.reload();
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div className="posts">
      {posts.map((post) => {
        return (
          <div className="post" key={post.id}>
            <p className="importanText">
              Post of:{' '}
              <span className="usernameText">{post.user.username}</span>
            </p>
            <div className="col p-2">
              <p className="postTitle">{post.title}</p>
              <p>{post.content}</p>
            </div>
            <div className="flex justify-end w-full px-4 items-end h-full ">
              {userId === post.user.id && (
                <div className="flex gap-2">
                  <button
                    className="bg-sky-300/70 px-3  py-1  rounded-xl hover:bg-sky-400/70 "
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Delete
                  </button>

                  <Popup post_id={post.id}></Popup>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Posts;
