import axios from "axios";
import type { Movie } from "../types/movie";

interface FetchMoviesResponse {
  results: Movie[];
  total_pages: number;
}

axios.defaults.baseURL = "https://api.themoviedb.org/3";
const fetchMovies = async (query: string, page: number): Promise<FetchMoviesResponse> => {
  const { data } = await axios.get<FetchMoviesResponse>("/search/movie", {
    params: {
      query,
      page,
    },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  });

  return data;
};
export default fetchMovies;
