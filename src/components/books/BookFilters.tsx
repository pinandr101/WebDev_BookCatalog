import React from 'react';
import type { SortField, SortOrder } from '../../hooks/useBooks';
import styles from "./BookFilters.module.css";

interface BookFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortField: SortField;
  onSortFieldChange: (field: SortField) => void;
  sortOrder: SortOrder;
  onSortOrderToggle: () => void;
}

const BookFilters: React.FC<BookFiltersProps> = ({
  searchQuery,
  onSearchChange,
  sortField,
  onSortFieldChange,
  sortOrder,
  onSortOrderToggle
}) => {
  return (
    <div className={styles.filters}>
      <input
        type="text"
        placeholder="Поиск по названию..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select value={sortField} onChange={(e) => onSortFieldChange(e.target.value as SortField)}>
        <option value="name">Название</option>
        <option value="year">Год выпуска</option>
        <option value="author">Автор</option>
      </select>
      <button onClick={onSortOrderToggle}>
        {sortOrder === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  );
};

export default BookFilters;