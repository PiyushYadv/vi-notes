import React from "react";
import type { Note } from "../types/Note";

interface Props {
  note: Note;
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
  onPin: (id: string) => void;
}

const NoteItem: React.FC<Props> = ({
  note,
  onDelete,
  onEdit,
  onPin,
}) => {
  return (
    <div className={`note-card ${note.pinned ? "pinned" : ""}`}>
      
      <h3>{note.title}</h3>
      <p>{note.content}</p>

      <small>
        Updated: {new Date(note.updatedAt).toLocaleString()}
      </small>

      <div className="note-actions">
        
        <button className="btn btn-pin" onClick={() => onPin(note.id)}>
          {note.pinned ? "📌 Unpin" : "📍 Pin"}
        </button>

        
        <button
          className="btn btn-delete"
          onClick={() => onDelete(note.id)}
        >
          Delete
        </button>

        
        <button
          className="btn btn-edit"
          onClick={() => onEdit(note)}
        >
          Edit
        </button>

          <span className="btn  tps-btn">
     {note.tps.toFixed(2)} wpm
  </span>
      </div>
    </div>
  );
};

export default NoteItem;