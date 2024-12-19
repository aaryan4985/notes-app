// src/NoteForm.js
import React, { useState } from "react";

function NoteForm({ addNote, darkMode }) {
  const [noteText, setNoteText] = useState("");
  const [noteColor, setNoteColor] = useState("#ffffff"); // Default color is white

  const handleSubmit = (e) => {
    e.preventDefault();
    if (noteText.trim() === "") return;
    addNote({ text: noteText, color: noteColor }); // Pass note text and color
    setNoteText("");
    setNoteColor("#ffffff"); // Reset to default
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <textarea
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="Write your note here..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="3"
      ></textarea>

      <div className="flex items-center space-x-4">
        <label
          htmlFor="colorPicker"
          className="text-gray-600 dark:text-gray-300"
        >
          Pick a color:
        </label>
        <input
          type="color"
          id="colorPicker"
          value={noteColor}
          onChange={(e) => setNoteColor(e.target.value)}
          className="w-10 h-10 border rounded-full"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
      >
        Add Note
      </button>
    </form>
  );
}

export default NoteForm;
