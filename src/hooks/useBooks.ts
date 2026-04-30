import { useState, useEffect, useMemo } from 'react';
import booksApi from '../api/booksApi';
import type { Book, BookItem } from '../types';

export type SortField = 'name' | 'year' | 'author';
export type SortOrder = 'asc' | 'desc';

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFull, setLoadingFull] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const listRes = await booksApi.getBooks();
      const bookItems: BookItem[] = listRes.data;

      setLoadingFull(true);
      const fullBooksPromises = bookItems.map(item => booksApi.getBook(item.id));
      const fullBooksResponses = await Promise.all(fullBooksPromises);
      const fullBooks: Book[] = fullBooksResponses.map(res => res.data);
      
      setBooks(fullBooks);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingFull(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    if (searchQuery) {
      result = result.filter(book =>
        book.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result.sort((a, b) => {
      let valA: any, valB: any;
      switch (sortField) {
        case 'name':
          valA = a.name;
          valB = b.name;
          break;
        case 'year':
          valA = a.year_of_release;
          valB = b.year_of_release;
          break;
        case 'author': {
          const authorA = a.author?.[0]?.full_name ?? '';
          const authorB = b.author?.[0]?.full_name ?? '';
          valA = authorA;
          valB = authorB;
          break;
        }
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
  }, [books, searchQuery, sortField, sortOrder]);

  const createBook = async (data: any) => {
    await booksApi.createBook(data);
    await fetchBooks();
  };

  const updateBook = async (id: number, data: any) => {
    await booksApi.updateBook(id, data);
    await fetchBooks();
  };

  const deleteBook = async (id: number) => {
    await booksApi.deleteBook(id);
    await fetchBooks();
  };

  return {
    books: filteredAndSortedBooks,
    loading: loading || loadingFull,
    error,
    fetchBooks,
    createBook,
    updateBook,
    deleteBook,
    searchQuery,
    setSearchQuery,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
  };
};
