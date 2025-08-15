import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteList.module.css";
import { deleteNote } from "../../services/noteService";
import type { Note } from "../../types/note";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setDeletingNoteId(null);
    },
    onError: () => {
      console.log("Error deleting note");
      setDeletingNoteId(null);
    },
  });

  if (!notes?.length) {
    return <p>No notes found</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => {
        const isDeleting = deletingNoteId === note.id;

        return (
          <li key={note.id} className={css.listItem}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>
              <button
                className={css.button}
                disabled={isDeleting}
                onClick={() => {
                  setDeletingNoteId(note.id);
                  deleteNoteMutation.mutate(note.id);
                }}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
