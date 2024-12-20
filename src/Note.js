import React from "react";

const Note = ({ title, content, color }) => {
  return (
    <div
      className={`p-4 rounded-lg shadow-md`}
      style={{ backgroundColor: color || "#f9f9f9" }}
    >
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-700">{content}</p>
    </div>
  );
};

export default Note;
