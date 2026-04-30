export interface Genre{
    id: number;
    name: string;
    books?: Book[];
}

export interface Author{
    id: number;
    full_name: string;
    books?: Book[];
}

export interface Book{
    id: number;
    name: string;
    year_of_release: number;
    description: string;
    image: string | null;
    genre: Genre[];
    author: Author[];
}

export interface BookItem{
    id: number;
    name: string;
    image: string | null;
}

export interface AuthorItem{
    id: number;
    full_name: string;
}

export interface GenreItem{
    id: number;
    name: string;
}

export interface CreateBookDTO{
    name: string;
    year_of_release?: number;
    description?: string;
    image?: string | null;
    genre?: number[];
    author?: number[];
}

export interface UpdateBookDTO{
    name?: string;
    year_of_release?: number;
    description?: string;
    image?: string | null;
    genre?: number[];
    author?: number[];
}

export interface CreateAuthorDTO{
    full_name: string;
    books?: number[];
}

export interface UpdateAuthorDTO{
    full_name?: string;
    books?: number[];
}

export interface CreateGenreDTO{
    name: string;
    books?: number[];
}

export interface UpdateGenreDTO{
    name?: string;
    books?: number[];
}

export interface PostAnswer{
    id: number;
}

export interface ImageUploadAnswer{
    name: string;
}
