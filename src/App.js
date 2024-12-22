import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable.js";
import {
  Search,
  Plus,
  Moon,
  Sun,
  Edit2,
  Trash2,
  Pin,
  Sparkles,
  Archive,
} from "lucide-react";

// Constants
const LOCAL_STORAGE_KEY = "prisma-notes-data";
const GRADIENTS = [
  "from-blue-500 to-indigo-500",
  "from-red-500 to-pink-500",
  "from-green-500 to-emerald-500",
  "from-yellow-500 to-orange-500",
  "from-purple-500 to-pink-500",
  "from-indigo-500 to-purple-500",
  "from-pink-500 to-rose-500",
  "from-orange-500 to-red-500",
];

function App() {
  // Initialize states with localStorage data
  const [notes, setNotes] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const savedNotes = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedNotes ? JSON.parse(savedNotes) : [];
    } catch (error) {
      console.error("Error loading notes:", error);
      return [];
    }
  });

  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [newNote, setNewNote] = useState({ text: "", color: "#3b82f6" });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0]);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const saved = localStorage.getItem("darkMode");
      return saved
        ? JSON.parse(saved)
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  // Save notes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
      } catch (error) {
        console.error("Error saving notes:", error);
      }
    }
  }, [notes]);

  // Save dark mode preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("darkMode", JSON.stringify(darkMode));
      } catch (error) {
        console.error("Error saving dark mode preference:", error);
      }
    }
  }, [darkMode]);

  // Note management functions
  const addNote = (e) => {
    e?.preventDefault();
    if (newNote.text.trim()) {
      const noteToAdd = {
        ...newNote,
        id: `note-${Date.now()}`,
        text: newNote.text.trim(),
        pinned: false,
        gradient: selectedGradient,
        createdAt: new Date().toISOString(),
      };
      setNotes((prevNotes) => [noteToAdd, ...prevNotes]);
      setNewNote({ text: "", color: "#3b82f6" });
      setIsFormVisible(false);
    }
  };

  const deleteNote = (index) => {
    setNotes((prevNotes) => {
      const newNotes = prevNotes.filter((_, i) => i !== index);
      return newNotes;
    });
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
          updatedAt: new Date().toISOString(),
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
      const newNotes = Array.from(prevNotes);
      const [movedNote] = newNotes.splice(source.index, 1);
      newNotes.splice(destination.index, 0, movedNote);
      return newNotes;
    });
  };

  const togglePin = (index) => {
    setNotes((prevNotes) => {
      const updatedNotes = [...prevNotes];
      updatedNotes[index] = {
        ...updatedNotes[index],
        pinned: !updatedNotes[index].pinned,
      };
      return updatedNotes;
    });
  };

  // Filter and sort notes
  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchText.toLowerCase())
  );

  const sortedNotes = [
    ...filteredNotes.filter((note) => note.pinned),
    ...filteredNotes.filter((note) => !note.pinned),
  ];

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <header
        className={`py-6 px-6 sticky top-0 z-10 transition-all duration-300 ${
          darkMode ? "bg-gray-900/90" : "bg-white/90"
        } backdrop-blur-lg border-b ${
          darkMode ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center gap-6">
          <div className="flex items-center gap-3 animate-fade-in">
            <Sparkles className="h-6 w-6 text-blue-500 animate-pulse" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Prisma Notes
            </h1>
          </div>

          <div className="flex-1 max-w-xl relative group">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-full transition-all duration-200 ${
                darkMode
                  ? "bg-gray-800 text-gray-100 placeholder-gray-400 focus:bg-gray-700"
                  : "bg-gray-100 text-gray-900 placeholder-gray-500 focus:bg-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full transition-all duration-200 ${
              darkMode
                ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {darkMode ? (
              <Sun className="h-5 w-5 animate-spin-slow" />
            ) : (
              <Moon className="h-5 w-5 animate-pulse" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Note Creation Form */}
        <div className="max-w-xl mx-auto mb-8">
          {!isFormVisible ? (
            <button
              onClick={() => setIsFormVisible(true)}
              className={`w-full rounded-2xl p-4 text-left transition-all duration-200 group hover:scale-102 ${
                darkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-750"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              } shadow-lg hover:shadow-xl`}
            >
              <Plus className="inline-block mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
              Create a new note...
            </button>
          ) : (
            <form
              onSubmit={addNote}
              className={`rounded-2xl shadow-2xl transition-all duration-200 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <textarea
                value={newNote.text}
                onChange={(e) =>
                  setNewNote({ ...newNote, text: e.target.value })
                }
                placeholder="What's on your mind?"
                className={`w-full resize-none border-0 focus:ring-0 p-6 rounded-t-2xl transition-colors duration-200 ${
                  darkMode
                    ? "bg-gray-800 text-gray-100 placeholder-gray-400"
                    : "bg-white text-gray-900 placeholder-gray-500"
                }`}
                rows={3}
                autoFocus
              />
              <div
                className={`flex justify-between items-center p-4 border-t ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {GRADIENTS.map((gradient) => (
                    <button
                      key={gradient}
                      type="button"
                      onClick={() => setSelectedGradient(gradient)}
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} transition-transform duration-200 ${
                        selectedGradient === gradient
                          ? "scale-110 ring-2 ring-blue-500 ring-offset-2"
                          : ""
                      } hover:scale-105`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFormVisible(false)}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                      darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity duration-200"
                  >
                    Create Note
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {sortedNotes.map((note, index) => (
                  <Draggable key={note.id} draggableId={note.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`transition-all duration-300 ${
                          snapshot.isDragging ? "rotate-3 scale-105" : ""
                        }`}
                      >
                        <div
                          className={`h-full rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-br ${note.gradient} relative group transform hover:-translate-y-1`}
                        >
                          {editIndex === index ? (
                            <div className="space-y-4">
                              <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="w-full resize-none border-0 focus:ring-0 bg-white/10 rounded-lg p-3 text-white placeholder-white/70"
                                rows={4}
                                autoFocus
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={saveEditedNote}
                                  className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 text-white transition-colors duration-200"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 text-white transition-colors duration-200"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex justify-between items-start mb-4">
                                <p className="text-white text-lg whitespace-pre-wrap">
                                  {note.text}
                                </p>
                                <button
                                  onClick={() => togglePin(index)}
                                  className="text-white/90 hover:text-white transition-colors duration-200 p-1 hover:bg-white/10 rounded-lg"
                                >
                                  <Pin
                                    className={`h-5 w-5 ${
                                      note.pinned ? "fill-white" : "fill-none"
                                    }`}
                                  />
                                </button>
                              </div>
                              <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                <button
                                  onClick={() => startEditing(index)}
                                  className="p-2 text-white/90 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => deleteNote(index)}
                                  className="p-2 text-white/90 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="absolute bottom-4 left-4 text-sm text-white/70">
                                {note.updatedAt
                                  ? `Updated ${new Date(
                                      note.updatedAt
                                    ).toLocaleDateString()}`
                                  : `Created ${new Date(
                                      note.createdAt
                                    ).toLocaleDateString()}`}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </DragDropContext>

        {/* Empty State */}
        {notes.length === 0 && !isFormVisible && (
          <div className="text-center py-12">
            <Archive
              className={`mx-auto h-12 w-12 ${
                darkMode ? "text-gray-700" : "text-gray-300"
              }`}
            />
            <h3
              className={`mt-4 text-xl font-medium ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No notes yet
            </h3>
            <p
              className={`mt-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
            >
              Create your first note to get started
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
