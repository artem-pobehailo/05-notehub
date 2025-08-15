import axios from "axios";
import type { FetchNotesResponse, NewNoteData, Note } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

if (!token) {
  throw new Error(
    "API token is missing. Please set VITE_NOTEHUB_TOKEN in your .env file"
  );
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

export const fetchNotes = async (
  search?: string,
  page = 1,
  perPage = 12
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };
  if (search && search.trim() !== "") {
    params.search = search;
  }

  const response = await api.get<FetchNotesResponse>("/notes", { params });
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<{ note: Note }>(`/notes/${id}`);
  return response.data.note;
};

export const addNote = async (noteData: NewNoteData): Promise<Note> => {
  const response = await api.post<{ note: Note }>("/notes", noteData);
  return response.data.note;
};
