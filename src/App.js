// src/App.js
import React, { useState, useEffect } from "react";
import NoteForm from "./NoteForm";

function App() {
  const [notes, setNotes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [searchText, setSearchText] = useState("");

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        if (Array.isArray(parsedNotes)) {
          setNotes(parsedNotes);
        }
      } catch (error) {
        console.error("Error parsing notes from localStorage:", error);
      }
    }
  }, []);

  // Save notes to localStorage when notes change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = (note) => {
    if (note && note.text.trim() && note.color) {
      setNotes([...notes, note]);
    }
  };

  const deleteNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const startEditing = (index) => {
    setEditIndex(index);
    setEditText(notes[index]?.text || "");
  };

  const saveEditedNote = () => {
    if (editText.trim() && editIndex !== null) {
      const updatedNotes = [...notes];
      updatedNotes[editIndex].text = editText.trim();
      setNotes(updatedNotes);
      cancelEditing();
    }
  };

  const cancelEditing = () => {
    setEditIndex(null);
    setEditText("");
  };

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-lg bg-white">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">
            Google Keep Notes
          </h1>
        </header>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Note Form */}
        <NoteForm onAddNote={addNote} />

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredNotes.map((note, index) => (
            <div
              key={index}
              style={{ backgroundColor: note.color }}
              className="p-4 rounded-lg shadow-md"
            >
              {editIndex === index ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={saveEditedNote}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mb-4">{note.text}</p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => startEditing(index)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteNote(index)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
