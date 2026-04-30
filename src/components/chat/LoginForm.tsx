import React from 'react';
import { useForm } from 'react-hook-form';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onLogin: (username: string) => void;
  isConnecting?: boolean;
}

interface FormData {
  username: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isConnecting }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: { username: '' }
  });

  const onSubmit = (data: FormData) => {
    onLogin(data.username);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <input
        {...register('username', {
          required: 'Введите никнейм',
          pattern: {
            value: /^[a-zA-Z0-9_]+$/,
            message: 'Только латинские буквы, цифры и подчёркивание'
          },
          maxLength: { value: 30, message: 'Не более 30 символов' }
        })}
        placeholder="Ваш никнейм"
        disabled={isConnecting}
        className={styles.input}
      />
      {errors.username && <span className={styles.error}>{errors.username.message}</span>}
      <button type="submit" disabled={isConnecting} className={styles.button}>Войти в чат</button>
    </form>
  );
};

export default LoginForm;