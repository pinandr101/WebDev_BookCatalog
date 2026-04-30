import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import imagesApi from '../../api/imagesApi';
import type { CreateBookDTO, Book } from '../../types';
import styles from './BookForm.module.css';

interface BookFormProps {
  initialData?: Book;
  authors: { id: number; full_name: string }[];
  genres: { id: number; name: string }[];
  onSubmit: (data: CreateBookDTO) => Promise<void>;
  onCancel: () => void;
}

interface FormValues {
  name: string;
  year_of_release: number;
  description: string;
  authorIds: number[];
  genreIds: number[];
  imageFile?: FileList;
}

const BookForm: React.FC<BookFormProps> = ({ initialData, authors, genres, onSubmit, onCancel }) => {
  const [uploading, setUploading] = useState(false);
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: initialData?.name || '',
      year_of_release: initialData?.year_of_release || new Date().getFullYear(),
      description: initialData?.description || '',
      authorIds: initialData?.author?.map(a => a.id) || [],
      genreIds: initialData?.genre?.map(g => g.id) || [],
    }
  });

  const processSubmit = async (values: FormValues) => {
    try {
      let imageName: string | null = initialData?.image || null;

      if (values.imageFile && values.imageFile.length > 0) {
        setUploading(true);
        const file = values.imageFile[0];
        const uploadRes = await imagesApi.uploadImage(file);
        imageName = uploadRes.name;
        setUploading(false);
      }

      const bookData: CreateBookDTO = {
        name: values.name,
        year_of_release: values.year_of_release,
        description: values.description,
        image: imageName,
        author: values.authorIds,
        genre: values.genreIds,
      };

      await onSubmit(bookData);
    } catch (error) {
      console.error('Ошибка сохранения книги', error);
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Название</label>
        <input {...register('name', { required: 'Название обязательно' })} className={styles.input} />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Год выпуска</label>
        <input type="number" {...register('year_of_release', { required: true, valueAsNumber: true })} className={styles.input} />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Описание</label>
        <textarea {...register('description')} className={styles.textarea} />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Авторы</label>
        <Controller name="authorIds" control={control} render={({ field }) => (
          <select multiple value={field.value.map(String)} onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, option => Number(option.value));
            field.onChange(selected);
          }} className={styles.select}>
            {authors.map(author => (
              <option key={author.id} value={author.id}>{author.full_name}</option>
            ))}
          </select>
        )} />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Жанры</label>
        <Controller name="genreIds" control={control} render={({ field }) => (
          <select multiple value={field.value.map(String)} onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, option => Number(option.value));
            field.onChange(selected);
          }} className={styles.select}>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
        )} />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Обложка</label>
        <input type="file" accept="image/*" {...register('imageFile')} className={styles.fileInput} />
        {initialData?.image && <p className={styles.currentImage}>Текущее изображение: {initialData.image}</p>}
      </div>
      <div className={styles.buttons}>
        <button type="submit" disabled={uploading} className={styles.submitBtn}>Сохранить</button>
        <button type="button" onClick={onCancel} className={styles.cancelBtn}>Отмена</button>
      </div>
  </form>
  );
};

export default BookForm;