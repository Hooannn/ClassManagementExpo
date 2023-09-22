import { useQuery } from "@tanstack/react-query";
import { useAxiosIns } from "../hooks";
import { useState } from "react";
import { useToast } from "../hooks";
import axios from "axios";
type MovieType = "now_playing" | "popular" | "top_rated" | "upcoming";
interface UseMoviesOptions {
  defaultMovieType: MovieType;
}
const useMovies = ({ defaultMovieType }: UseMoviesOptions) => {
  const [type, setType] = useState<MovieType>(defaultMovieType);
  const [page, setPage] = useState(1);
  // const axios = useAxiosIns();
  const toast = useToast();

  const goNextPage = () => setPage((prev) => prev + 1);
  const goPrevPage = () => setPage((prev) => (prev <= 1 ? 1 : prev - 1));

  const changeMovieType = (type: MovieType) => setType(type);

  const fetchMoviesQuery = useQuery({
    queryKey: ["fetch/movies", type, page],
    queryFn: () =>
      axios.get(
        `https://api.themoviedb.org/3/movie/${type}?api_key=8f6404b00f28edf5b407334b8c89500c&language=en-US&page=${page}`
      ),
    select: (res) => res.data,
    onError: (err: any) => {
      toast.show({
        type: "error",
        text1: err.status || "Error when fetching movies",
        text2: err.response?.data?.message || err.message,
      });
    },
  });

  const movies = fetchMoviesQuery.data?.results || [];

  return { goNextPage, goPrevPage, page, changeMovieType, movies };
};

export default useMovies;
