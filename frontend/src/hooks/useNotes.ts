import { useEffect, useState } from "react";
import type { Note } from "../types/Note";

export const useNotes = () => {
  // Load
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  });

  // Save
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = (
    title: string,
    content: string,
    tag: string,
    tps: number,
  ) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title,
      content,
      tag,
      tps,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      pinned: false,
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const updateNote = (updated: Note) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === updated.id ? { ...updated, updatedAt: Date.now() } : n,
      ),
    );
  };

  const togglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, pinned: !note.pinned } : note,
      ),
    );
  };

  return { notes, addNote, deleteNote, updateNote, togglePin };
};
