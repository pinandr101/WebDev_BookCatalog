import { useState, useEffect, useMemo } from 'react';
import authorsApi from '../api/authorsApi';
import type { Author, AuthorItem } from '../types';

export type AuthorSortField = 'full_name' | 'booksCount';
export type SortOrder = 'asc' | 'desc';

export const useAuthors = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFull, setLoadingFull] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<AuthorSortField>('full_name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const fetchAuthors = async () => {
    setLoading(true);
    setError(null);
    try {
      const listRes = await authorsApi.getAuthors();
      const authorItems: AuthorItem[] = listRes.data;

      setLoadingFull(true);
      const fullPromises = authorItems.map(item => authorsApi.getAuthor(item.id));
      const fullResponses = await Promise.all(fullPromises);
      const fullAuthors: Author[] = fullResponses.map(res => res.data);

      setAuthors(fullAuthors);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingFull(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const filteredAndSortedAuthors = useMemo(() => {
    let result = [...authors];

    if (searchQuery) {
      result = result.filter(author =>
        author.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result.sort((a, b) => {
      let valA: any, valB: any;
      switch (sortField) {
        case 'full_name':
          valA = a.full_name;
          valB = b.full_name;
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
  }, [authors, searchQuery, sortField, sortOrder]);

  const createAuthor = async (fullName: string) => {
    const response = await authorsApi.createAuthor({ full_name: fullName });
    await fetchAuthors();
    return response.data;
  };

  const updateAuthor = async (id: number, fullName: string) => {
    await authorsApi.updateAuthor(id, { full_name: fullName });
    await fetchAuthors();
  };

  const patchAuthor = async (id: number, fullName: string) => {
    await authorsApi.patchAuthor(id, { full_name: fullName });
    await fetchAuthors();
  };

  const deleteAuthor = async (id: number) => {
    await authorsApi.deleteAuthor(id);
    await fetchAuthors();
  };

  return {
    authors: filteredAndSortedAuthors,
    loading: loading || loadingFull,
    error,
    fetchAuthors,
    createAuthor,
    updateAuthor,
    patchAuthor,
    deleteAuthor,
    searchQuery,
    setSearchQuery,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
  };
};
