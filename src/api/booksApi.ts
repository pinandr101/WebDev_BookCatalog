import api from "./apiConfigs";
import type { Book, BookItem, CreateBookDTO, UpdateBookDTO, PostAnswer } from "../types";

const booksApi = {
    getBooks: () => api.get<BookItem[]>('/book/'),
    getBook: (id: number) => api.get<Book>('/book/', {params: {id}}),
    createBook: (data: CreateBookDTO) => api.post<PostAnswer>('/book/', data),
    updateBook: (id: number, data: UpdateBookDTO) => api.put('/book/', data, {params: {id}}),
    patchBook: (id: number, data: UpdateBookDTO) => api.patch('/book/', data, {params: {id}}),
    deleteBook: (id: number) => api.delete('/book/', {params: {id}})
}

export default booksApi;
