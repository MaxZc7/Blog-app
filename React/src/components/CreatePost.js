import React, { useState } from 'react';

function SideBar({ userId }) {
  const [title, setTitle] = useState();
  const [content, setContent] = useState();

  const handleSubmit = async (e) => {
    try {
      const response = await fetch('http://localhost:8000/create-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          content: content,
          user_id: userId,
        }),
      });
    } catch (e) {
      throw new Error(e.message);
    }

    setContent('');
    setTitle('');
  };

  return (
    <div className="sideBarContainer ">
      <h3 className="text-2xl font-bold">Create a Post</h3>
      <form className="col" onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="rounded-lg p-1"
        />
        <input
          type="text"
          value={content}
          placeholder="Description"
          onChange={(e) => setContent(e.target.value)}
          required
          className="rounded-lg p-1"
        />
        <input
          type="submit"
          value="Submit"
          className="hover:cursor-pointer rounded-xl bg-white px-8 py-1 hover:scale-105 transition-all"
        />
      </form>
    </div>
  );
}

export default SideBar;
