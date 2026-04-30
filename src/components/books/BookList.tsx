import React from 'react';
import type { BookItem } from '../../types';
import styles from "./BookList.module.css";

interface BookListProps {
  books: BookItem[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  getImageUrl: (name: string | null) => string;
}

const BookList: React.FC<BookListProps> = ({ books, onEdit, onDelete, getImageUrl }) => {
  return (
    <div className={styles.list}>
      {books.map(book => (
        <div key={book.id} className={styles.card}>
          <img src={getImageUrl(book.image)} alt={book.name} className={styles.image} />
          <h3 className={styles.name}>{book.name}</h3>
          <div className={styles.actions}>
            <button onClick={() => onEdit(book.id)} className={styles.editBtn}>Редактировать</button>
            <button onClick={() => onDelete(book.id)} className={styles.deleteBtn}>Удалить</button>
          </div>
        </div>
      ))}
  </div>
  );
};

export default BookList;
