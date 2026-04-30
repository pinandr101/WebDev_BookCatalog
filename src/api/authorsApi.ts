import api from "./apiConfigs";
import type { Author, AuthorItem, CreateAuthorDTO, UpdateAuthorDTO, PostAnswer } from "../types";

const authorsApi = {
    getAuthors: () => api.get<AuthorItem[]>('/author/'),
    getAuthor: (id: number) => api.get<Author>('/author/', {params: {id}}),
    createAuthor: (data: CreateAuthorDTO) => api.post<PostAnswer>('/author/', data),
    updateAuthor: (id: number, data: UpdateAuthorDTO) => api.put('/author/', data, {params: {id}}),
    patchAuthor: (id: number, data: UpdateAuthorDTO) => api.patch('/author/', data, {params: {id}}),
    deleteAuthor: (id: number) => api.delete('/author/', {params: {id}})
}

export default authorsApi;
