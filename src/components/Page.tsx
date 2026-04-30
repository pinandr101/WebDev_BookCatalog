import React, { useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import { useAuthors } from '../hooks/useAuthors';
import { useGenres } from '../hooks/useGenres';
import BookList from '../components/books/BookList';
import BookFilters from '../components/books/BookFilters';
import BookForm from '../components/books/BookForm';
import imagesApi from '../api/imagesApi';
import styles from './Page.module.css';

const getImageUrl = (name: string | null) => {
  return name ? imagesApi.getImageUrl(name) : '/template.png';
};

const Page: React.FC = () => {
  const {
    books, loading, error,
    searchQuery, setSearchQuery,
    sortField, setSortField,
    sortOrder, setSortOrder,
    createBook, updateBook, deleteBook
  } = useBooks();

  const { authors } = useAuthors();
  const { genres } = useGenres();

  const [editingBook, setEditingBook] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreate = () => {
    setEditingBook(null);
    setShowForm(true);
  };

  const handleEdit = (id: number) => {
    setEditingBook(id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Удалить книгу?')) {
      await deleteBook(id);
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (editingBook === null) {
      await createBook(data);
    } else {
      await updateBook(editingBook, data);
    }
    setShowForm(false);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Каталог книг</h1>
      <button onClick={handleCreate} className={styles.addBtn}>Добавить книгу</button>

      {showForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <BookForm
              initialData={editingBook ? books.find(b => b.id === editingBook) as any : undefined}
              authors={authors}
              genres={genres}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
      
      <BookFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortField={sortField}
        onSortFieldChange={setSortField}
        sortOrder={sortOrder}
        onSortOrderToggle={toggleSortOrder}
      />

      <BookList
        books={books}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getImageUrl={getImageUrl}
      />
    </div>
  );
};

export default Page;
