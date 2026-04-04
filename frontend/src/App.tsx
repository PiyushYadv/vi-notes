import React, { useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import NoteForm from "./components/NoteForm";
import NotesList from "./components/NotesList";

import { useNotes } from "./hooks/useNotes";
import { filterAndSortNotes } from "./utils/noteHelpers";
import type { Note } from "./types/Note";

import DeleteModal from "./components/DeleteModal";
import Sidebar from "./components/Sidebar";
import NotesStats from "./components/NotesStats";

const user = {
  name: "Rishabh Jha",
  email: "rishabh@gmail.com",
};

const App: React.FC = () => {
  const { notes, addNote, deleteNote, updateNote, togglePin } = useNotes();

  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState("Notes");

  const filteredNotes = filterAndSortNotes(notes, search);


  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);


  const handleDeleteClick = (id: string) => {
    setNoteToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      deleteNote(noteToDelete);
    }
    setShowDeleteModal(false);
    setNoteToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setNoteToDelete(null);
  };

  return (
    <div className="app-layout">
      {/*  Sidebar */}
      <Sidebar active={activeView} setActive={setActiveView} />

      {/*  Main Content */}
      <div className="main-content">
        <Navbar user={user} />

        {/*  Search */}
        <input
          className="search-bar"
          placeholder="🔍 Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/*  Views */}
        {activeView === "Notes" && (
          <>
            <NoteForm
              onAdd={(title, content, tag,tps) =>
                addNote(title, content, tag,tps)
              }
            />

            <NotesList
              notes={filteredNotes}
              onDelete={handleDeleteClick}
              onEdit={(note) => {
                setEditingNote(note);
                setShowEditModal(true);
              }}
              onPin={togglePin}
            />
          </>
        )}

        {activeView === "Stats" && (
          <NotesStats notes={notes} />
        )}

        {activeView === "Pinned" && (
          <NotesList
            notes={filteredNotes.filter((n) => n.pinned)}
            onDelete={handleDeleteClick}
            onEdit={(note) => {
              setEditingNote(note);
              setShowEditModal(true);
            }}
            onPin={togglePin}
          />
        )}
      </div>

      {/*  Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Note</h2>

            <NoteForm
              editingNote={editingNote}
              onAdd={(title, content, tag) => {
                if (editingNote) {
                  updateNote({ ...editingNote, title, content, tag });
                  setEditingNote(null);
                  setShowEditModal(false);
                }
              }}
            />

            <button
              className="btn"
              onClick={() => {
                setShowEditModal(false);
                setEditingNote(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/*  Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default App;























