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
      setNotes(JSON.parse(savedNotes)); // Load saved notes
    }
  }, []);

  // Update local storage whenever notes change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
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
    updatedNotes[editIndex] = editText; // Update the note
    setNotes(updatedNotes);
    setEditIndex(null);
    setEditText("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Responsive Notes App
      </h1>
      <NoteForm addNote={addNote} />

      <ul className="space-y-4 mt-8">
        {notes.map((note, index) => (
          <li
            key={index}
            className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center bg-gray-100 p-4 rounded-lg shadow-md"
          >
            {editIndex === index ? (
              <div className="flex flex-col sm:flex-row sm:items-center w-full">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full sm:w-3/4 px-3 py-2 border border-gray-300 rounded-lg mb-2 sm:mb-0 sm:mr-2"
                />
                <button
                  onClick={saveEditedNote}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex justify-between w-full">
                <span className="text-gray-800 break-words">{note}</span>
                <div className="flex mt-2 sm:mt-0">
                  <button
                    onClick={() => startEditing(index)}
                    className="bg-blue-500 text-white px-3 py-2 rounded-lg mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteNote(index)}
                    className="bg-red-500 text-white px-3 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
