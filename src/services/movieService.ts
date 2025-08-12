import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { Movie } from "../types/movie";

interface MovieSearchResponse {
  results: Movie[];
  total_pages: number;
}

export async function fetchMovies(
  query: string,
  page: number
): Promise<MovieSearchResponse> {
  const token = import.meta.env.VITE_TMDB_TOKEN;

  const response = await axios.get<MovieSearchResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: { query, page },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}
export function useMovies(query: string, page: number) {
  return useQuery<MovieSearchResponse, Error>({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.trim() !== "",
    placeholderData: {
      results: [],
      total_pages: 0,
    },
  });
}
