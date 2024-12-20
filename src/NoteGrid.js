import React from "react";
import Note from "./Note";

const NotesGrid = ({ notes }) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {notes.map((note) => (
        <Note
          key={note.id}
          title={note.title}
          content={note.content}
          color={note.color}
        />
      ))}
    </div>
  );
};

export default NotesGrid;
