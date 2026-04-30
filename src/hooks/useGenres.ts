import { useState, useEffect, useMemo } from 'react';
import genresApi from '../api/genresApi';
import type { Genre, GenreItem } from '../types';

export type GenreSortField = 'name' | 'booksCount';
export type SortOrder = 'asc' | 'desc';

export const useGenres = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFull, setLoadingFull] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<GenreSortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const fetchGenres = async () => {
    setLoading(true);
    setError(null);
    try {
      const listRes = await genresApi.getGenres();
      const genreItems: GenreItem[] = listRes.data;

      setLoadingFull(true);
      const fullPromises = genreItems.map(item => genresApi.getGenre(item.id));
      const fullResponses = await Promise.all(fullPromises);
      const fullGenres: Genre[] = fullResponses.map(res => res.data);

      setGenres(fullGenres);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingFull(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const filteredAndSortedGenres = useMemo(() => {
    let result = [...genres];

    if (searchQuery) {
      result = result.filter(genre =>
        genre.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result.sort((a, b) => {
      let valA: any, valB: any;
      switch (sortField) {
        case 'name':
          valA = a.name;
          valB = b.name;
          break;
        case 'booksCount':
          valA = a.books?.length ?? 0;
          valB = b.books?.length ?? 0;
          break;
        default:
          return 0;
      }

      if (typeof valA === 'string' && typeof valB === 'string') {
        const compare = valA.localeCompare(valB);
        return sortOrder === 'asc' ? compare : -compare;
      } else if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });

    return result;
  }, [genres, searchQuery, sortField, sortOrder]);

  const createGenre = async (name: string) => {
    const response = await genresApi.createGenre({ name });
    await fetchGenres();
    return response.data;
  };

  const updateGenre = async (id: number, name: string) => {
    await genresApi.updateGenre(id, { name });
    await fetchGenres();
  };

  const patchGenre = async (id: number, name: string) => {
    await genresApi.patchGenre(id, { name });
    await fetchGenres();
  };

  const deleteGenre = async (id: number) => {
    await genresApi.deleteGenre(id);
    await fetchGenres();
  };

  return {
    genres: filteredAndSortedGenres,
    loading: loading || loadingFull,
    error,
    fetchGenres,
    createGenre,
    updateGenre,
    patchGenre,
    deleteGenre,
    searchQuery,
    setSearchQuery,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
  };
};
