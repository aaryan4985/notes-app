// src/App.js
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
    console.log("Loaded notes:", savedNotes);
    console.log("Loaded dark mode:", savedDarkMode);
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        // Ensure that each note has 'text' and 'color'
        const validNotes = Array.isArray(parsedNotes)
          ? parsedNotes.filter((note) => note.text && note.color)
          : [];
        setNotes(validNotes);
        console.log("Parsed notes:", validNotes);
      } catch (error) {
        console.error("Error parsing notes from localStorage:", error);
        setNotes([]);
      }
    }
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
      console.log("Set dark mode to:", JSON.parse(savedDarkMode));
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
    console.log("Saved notes to localStorage:", notes);
  }, [notes]);

  // Save dark mode preference to localStorage and apply 'dark' class to body
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    console.log("Set dark mode to:", darkMode);
    if (darkMode) {
      document.body.classList.add("dark");
      console.log("Added 'dark' class to body");
    } else {
      document.body.classList.remove("dark");
      console.log("Removed 'dark' class from body");
    }
  }, [darkMode]);

  const addNote = (note) => {
    if (note && note.text && note.color) {
      setNotes([...notes, note]);
      console.log("Added note:", note);
    }
  };

  const deleteNote = (index) => {
    const newNotes = notes.filter((_, i) => i !== index);
    setNotes(newNotes);
    console.log("Deleted note at index:", index);
  };

  const startEditing = (index) => {
    if (notes[index] && notes[index].text) {
      setEditIndex(index);
      setEditText(notes[index].text);
      console.log("Started editing note at index:", index);
    }
  };

  const saveEditedNote = () => {
    if (editIndex === null || editIndex >= notes.length) return;
    const updatedNotes = [...notes];
    if (updatedNotes[editIndex]) {
      updatedNotes[editIndex].text = editText;
      setNotes(updatedNotes);
      console.log("Saved edited note at index:", editIndex);
    }
    setEditIndex(null);
    setEditText("");
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.text &&
      typeof note.text === "string" &&
      note.text.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    console.log("Toggled dark mode to:", !darkMode);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Google Keep-Like Notes App</h1>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-lg bg-blue-500 dark:bg-gray-700 text-white dark:text-gray-300 hover:bg-blue-600 dark:hover:bg-gray-600 transition duration-200"
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
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Note Form */}
        <NoteForm addNote={addNote} darkMode={darkMode} />

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredNotes.map((note, index) => (
            <div
              key={index}
              style={{ backgroundColor: note.color || "#ffffff" }} // Fallback color
              className="p-4 rounded-lg shadow-md bg-gray-100 dark:bg-gray-800"
            >
              {editIndex === index ? (
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={saveEditedNote}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
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
