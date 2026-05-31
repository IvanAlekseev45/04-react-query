import axios from "axios";
import type { Movie } from "../types/movie";

interface FetchMoviesResponse {
  results: Movie[];
}

axios.defaults.baseURL = "https://api.themoviedb.org/3";
const fetchMovies = async (query: string): Promise<Movie[]> => {
  const result = await axios.get<FetchMoviesResponse>("/search/movie", {
    params: {
      query,
    },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  });

  return result.data.results;
};
export default fetchMovies;
