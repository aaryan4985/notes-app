import React, { useState, useEffect } from "react";
import NoteForm from "./NoteForm";

function App() {
  const [notes, setNotes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Load notes and dark mode preference from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("notes", JSON.stringify(notes));
    }
  }, [notes]);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add("dark"); // Add 'dark' class to body
    } else {
      document.body.classList.remove("dark"); // Remove 'dark' class from body
    }
  }, [darkMode]);

  const addNote = (note) => {
    setNotes([...notes, note]);
  };

  const deleteNote = (index) => {
    const newNotes = notes.filter((_, i) => i !== index);
    setNotes(newNotes);
  };

  const startEditing = (index) => {
    setEditIndex(index);
    setEditText(notes[index].text);
  };

  const saveEditedNote = () => {
    const updatedNotes = [...notes];
    updatedNotes[editIndex].text = editText;
    setNotes(updatedNotes);
    setEditIndex(null);
    setEditText("");
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.text && note.text.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Google Keep-Like Notes App</h1>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-lg bg-blue-500 dark:bg-gray-700 text-white dark:text-gray-300"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>

        {/* Note Form */}
        <NoteForm addNote={addNote} darkMode={darkMode} />

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredNotes.map((note, index) => (
            <div
              key={index}
              style={{ backgroundColor: note.color }}
              className="p-4 rounded-lg shadow-md bg-gray-100 dark:bg-gray-800"
            >
              {editIndex === index ? (
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  />
                  <button
                    onClick={saveEditedNote}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <p className="mb-4">{note.text}</p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => startEditing(index)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteNote(index)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
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
