import React, { useState, useEffect } from "react";
import NoteForm from "./NoteForm";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable.js";

function App() {
  const [notes, setNotes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [searchText, setSearchText] = useState("");

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

  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("notes", JSON.stringify(notes));
    }
  }, [notes]);

  const addNote = (note) => {
    if (note && note.text.trim() && note.color) {
      const newNote = {
        ...note,
        id: `note-${Date.now()}`,
      };
      setNotes((prevNotes) => [...prevNotes, newNote]);
    }
  };

  const deleteNote = (index) => {
    setNotes((prevNotes) => prevNotes.filter((_, i) => i !== index));
  };

  const startEditing = (index) => {
    setEditIndex(index);
    setEditText(notes[index]?.text || "");
  };

  const saveEditedNote = () => {
    if (editText.trim() && editIndex !== null) {
      setNotes((prevNotes) => {
        const updatedNotes = [...prevNotes];
        updatedNotes[editIndex] = {
          ...updatedNotes[editIndex],
          text: editText.trim(),
        };
        return updatedNotes;
      });
      cancelEditing();
    }
  };

  const cancelEditing = () => {
    setEditIndex(null);
    setEditText("");
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    setNotes((prevNotes) => {
      const reorderedNotes = Array.from(prevNotes);
      const [movedNote] = reorderedNotes.splice(source.index, 1);
      reorderedNotes.splice(destination.index, 0, movedNote);
      return reorderedNotes;
    });
  };

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-lg bg-white">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">
            Google Keep Notes
          </h1>
        </header>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <NoteForm onAddNote={addNote} />

        <DragDropContext onDragEnd={handleDragEnd}>
          <StrictModeDroppable droppableId="notes">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6"
              >
                {filteredNotes.map((note, index) => (
                  <Draggable key={note.id} draggableId={note.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          backgroundColor: note.color,
                        }}
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
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
