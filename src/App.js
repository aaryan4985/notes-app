import React, { useState, useEffect } from "react";
import NoteForm from "./NoteForm";

function App() {
  const [notes, setNotes] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // Index of the note being edited
  const [editText, setEditText] = useState(""); // Text of the note being edited

  // Load notes from local storage when the app starts
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes)); // If notes exist in localStorage, load them
    }
  }, []);

  // Update local storage whenever notes change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("notes", JSON.stringify(notes));
    }
  }, [notes]);

  // Add a new note
  const addNote = (note) => {
    setNotes([...notes, note]);
  };

  // Delete a note by index
  const deleteNote = (index) => {
    const newNotes = notes.filter((_, i) => i !== index);
    setNotes(newNotes);
  };

  // Start editing a note
  const startEditing = (index) => {
    setEditIndex(index);
    setEditText(notes[index]);
  };

  // Save the edited note
  const saveEditedNote = () => {
    const updatedNotes = [...notes];
    updatedNotes[editIndex] = editText; // Update the note at the specified index
    setNotes(updatedNotes);
    setEditIndex(null); // Stop editing
    setEditText(""); // Clear the edit text
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Notes App
      </h1>
      <NoteForm addNote={addNote} />

      <ul className="space-y-4">
        {notes.map((note, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md"
          >
            {editIndex === index ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg w-3/4"
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
                <span className="text-gray-800">{note}</span>
                <div className="flex space-x-2">
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
