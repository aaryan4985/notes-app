import React, { useState, useEffect } from "react";
import NoteForm from "./NoteForm";

function App() {
  const [notes, setNotes] = useState([]);

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

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Notes App</h1>
      <NoteForm addNote={addNote} />
      <ul style={styles.noteList}>
        {notes.map((note, index) => (
          <li key={index} style={styles.noteItem}>
            {note}
            <button
              onClick={() => deleteNote(index)}
              style={styles.deleteButton}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Inline CSS styles
const styles = {
  container: {
    textAlign: "center",
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  header: {
    marginBottom: "20px",
    color: "#333",
  },
  noteList: {
    listStyle: "none",
    padding: 0,
  },
  noteItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    margin: "5px 0",
    backgroundColor: "#f4f4f4",
    borderRadius: "5px",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default App;
