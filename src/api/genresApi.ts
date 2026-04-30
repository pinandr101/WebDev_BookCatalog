import api from "./apiConfigs";
import type { Genre, GenreItem, CreateGenreDTO, UpdateGenreDTO, PostAnswer } from "../types";

const genresApi = {
    getGenres: () => api.get<GenreItem[]>('/genre/'),
    getGenre: (id: number) => api.get<Genre>('/genre/', {params: {id}}),
    createGenre: (data: CreateGenreDTO) => api.post<PostAnswer>('/genre/', data),
    updateGenre: (id: number, data: UpdateGenreDTO) => api.put('/genre/', data, {params: {id}}),
    patchGenre: (id: number, data: UpdateGenreDTO) => api.patch('/genre/', data, {params: {id}}),
    deleteGenre: (id: number) => api.delete('/genre/', {params: {id}})
}

export default genresApi;
