import React, { useState } from "react";

const NoteForm = ({ onAddNote }) => {
  const [noteText, setNoteText] = useState("");
  const [selectedColor, setSelectedColor] = useState("#ffffff");

  const colors = [
    "#ffffff", // White
    "#f8d7da", // Light Red
    "#d4edda", // Light Green
    "#cce5ff", // Light Blue
    "#fff3cd", // Light Yellow
    "#e2e3e5", // Light Gray
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (noteText.trim()) {
      onAddNote({
        text: noteText.trim(),
        color: selectedColor,
      });
      setNoteText("");
      setSelectedColor("#ffffff");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-4">
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Take a note..."
          className="w-full px-4 py-2 border rounded-lg bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={`w-6 h-6 rounded-full border ${
                selectedColor === color
                  ? "border-blue-500 border-2"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Add Note
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
