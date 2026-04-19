import { useState } from 'react';

export default function AddLNote({ onAdd }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the page from refreshing (PHP style)
    
    if (!title || !content) return; // Basic validation

    // Send the data up to the parent (App.jsx)
    onAdd({ title, content });

    // Clear the form
    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-xl shadow">
      <input 
        type="text"
        placeholder="Note Title"
        className="w-full p-2 mb-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)} // The "Magic" line
      />
      <textarea 
        placeholder="Note Content"
        className="w-full p-2 mb-2 border rounded"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition">
        Add Note
      </button>
    </form>
  );
}