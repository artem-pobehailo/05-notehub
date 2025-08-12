import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
// import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
// import { useQuery } from "@tanstack/react-query";
import css from "./App.module.css";
import ReactPaginate from "react-paginate";
import { useMovies } from "../../services/movieService";
// import { fetchMovies, useMovies } from "../../services/movieService";

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useMovies(query, page);

  function handleSearch(newQuery: string) {
    setQuery(newQuery);
    setPage(1);
  }
  // function handlePageChange(selectedItem: { selected: number }) {
  //   setPage(selectedItem.selected + 1);
  // }

  function handleSelectMovie(movie: Movie) {
    setSelectedMovie(movie);
  }

  function handleCloseModal() {
    setSelectedMovie(null);
  }

  const toastShownRef = useRef(false);

  useEffect(() => {
    if (
      query.trim() !== "" &&
      data?.results?.length === 0 &&
      !isLoading &&
      !isError &&
      !toastShownRef.current
    ) {
      toast.error("No movies found for your request.");
      toastShownRef.current = true;
    }

    if (isLoading || isError || (data?.results?.length ?? 0) > 0) {
      toastShownRef.current = false;
    }
  }, [data, isLoading, isError, query]);

  return (
    <div>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-center" />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {data?.results && data.results.length > 0 && (
        <>
          {data?.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
          <MovieGrid movies={data.results} onSelect={handleSelectMovie} />
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
