import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable.js";
import { Search, Plus, X, Edit2, Trash2 } from "lucide-react";

function App() {
  const [notes, setNotes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [newNote, setNewNote] = useState({ text: "", color: "#ffffff" });
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        if (Array.isArray(parsedNotes)) {
          setNotes(parsedNotes);
        }
      } catch (error) {
        console.error("Error parsing notes:", error);
      }
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = (e) => {
    e?.preventDefault();
    if (newNote.text.trim()) {
      const noteToAdd = {
        ...newNote,
        id: `note-${Date.now()}`,
        text: newNote.text.trim(),
      };
      setNotes((prevNotes) => [...prevNotes, noteToAdd]);
      setNewNote({ text: "", color: "#ffffff" });
      setIsFormVisible(false);
    }
  };

  const deleteNote = (index) => {
    setNotes((prevNotes) => prevNotes.filter((_, i) => i !== index));
    if (editIndex === index) {
      cancelEditing();
    }
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
    if (!destination || source.index === destination.index) return;

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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center gap-6">
          <h1 className="text-xl font-semibold text-gray-800">Keep Notes</h1>
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Note Creation Form */}
        <div className="max-w-xl mx-auto mb-8">
          {!isFormVisible ? (
            <button
              onClick={() => setIsFormVisible(true)}
              className="w-full bg-white rounded-lg shadow-sm p-4 text-gray-500 text-left hover:shadow-md transition-shadow"
            >
              <Plus className="inline-block mr-2 h-5 w-5" />
              Take a note...
            </button>
          ) : (
            <form
              onSubmit={addNote}
              className="bg-white rounded-lg shadow-sm p-4"
            >
              <textarea
                value={newNote.text}
                onChange={(e) =>
                  setNewNote({ ...newNote, text: e.target.value })
                }
                placeholder="Take a note..."
                className="w-full resize-none border-0 focus:ring-0 p-2 mb-3"
                rows={3}
                autoFocus
              />
              <div className="flex justify-between items-center">
                <input
                  type="color"
                  value={newNote.color}
                  onChange={(e) =>
                    setNewNote({ ...newNote, color: e.target.value })
                  }
                  className="w-8 h-8 rounded-full cursor-pointer"
                />
                <div className="space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsFormVisible(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Notes Grid */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <StrictModeDroppable droppableId="notes">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {filteredNotes.map((note, index) => (
                  <Draggable key={note.id} draggableId={note.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          backgroundColor: note.color,
                        }}
                        className={`rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                          snapshot.isDragging ? "shadow-lg" : ""
                        }`}
                      >
                        {editIndex === index ? (
                          <div className="p-4">
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full resize-none border-0 focus:ring-0 bg-transparent mb-2"
                              rows={4}
                              autoFocus
                            />
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={saveEditedNote}
                                className="p-2 text-sm hover:bg-black/5 rounded"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="p-2 text-sm hover:bg-black/5 rounded"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 group">
                            <p className="whitespace-pre-wrap mb-4">
                              {note.text}
                            </p>
                            <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => startEditing(index)}
                                className="p-2 text-gray-600 hover:bg-black/5 rounded"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteNote(index)}
                                className="p-2 text-gray-600 hover:bg-black/5 rounded"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
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
      </main>
    </div>
  );
}

export default App;
