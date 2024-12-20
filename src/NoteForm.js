// src/NoteForm.js
import React, { useState } from "react";

function NoteForm({ onAddNote }) {
  const [text, setText] = useState("");
  const [color, setColor] = useState("#ffffff");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (text.trim()) {
      onAddNote({ text, color });
      setText("");
      setColor("#ffffff");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your note here"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          rows="3"
        />
      </div>
      <div className="flex items-center justify-between">
        <label className="text-gray-700">
          Choose Color:{" "}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="ml-2"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Add Note
        </button>
      </div>
    </form>
  );
}

export default NoteForm;
