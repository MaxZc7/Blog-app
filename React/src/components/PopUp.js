import React, { useState, useRef, useEffect } from 'react';

function Popup({ post_id }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState();
  const [content, setContent] = useState();

  const popupRef = useRef(null);

  const handleClosePopup = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClosePopup);
    return () => {
      document.removeEventListener('mousedown', handleClosePopup);
    };
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/update-post/${post_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title,
            content: content,
          }),
        }
      );
      const data = response.json();
      console.log(data);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1 bg-sky-300/70 hover:bg-sky-400/70  rounded-xl transition-all  "
      >
        Modify
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            ref={popupRef}
            className="bg-white w-[700px] flex justify-center items-center h-[500px] text-black "
          >
            <div class="flex flex-col w-full items-center gap-4">
              <h4 className="text-2xl font-bold">Modify your post</h4>
              <form className="col" onSubmit={() => handleSubmit()}>
                <input
                  type="text"
                  placeholder="New Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="rounded-lg p-1 bg-gray-600 px-3 text-white"
                />
                <input
                  type="text"
                  value={content}
                  placeholder="New Description"
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="rounded-lg p-1 bg-gray-600 px-3 text-white"
                />
                <input
                  type="submit"
                  value="Submit"
                  className="hover:cursor-pointer rounded-xl bg-black text-white px-8 py-1 hover:scale-105 transition-all"
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Popup;
