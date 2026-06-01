import SearchBar from "../SearchBar/SearchBar";
import { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import fetchMovies from "../../services/movieService";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import css from "./App.module.css";

// це мені запропонував чат GTP, при нормальному імпорті бібліотеки пагінації код падає при запиті, тому тут ці
//костилі з імпортом ⬇️

import ReactPaginateModule from "react-paginate";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactPaginate = (ReactPaginateModule as any).default ?? ReactPaginateModule;

const App = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const onSubmit = (query: string) => {
    setQuery(query);
    setPage(1);
  };

  return (
    <>
      <SearchBar onSubmit={onSubmit} />
      <Toaster />
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }: { selected: number }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {moviesQuery.isLoading && <Loader />}
      {moviesQuery.isError && <ErrorMessage />}
      {movies.length > 0 && <MovieGrid movies={movies} onSelect={handleSelectMovie} />}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
    </>
  );
};

export default App;
