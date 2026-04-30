import React, { useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';
import LoginForm from './LoginForm';
import ChatRoom from './ChatRoom';
import styles from './Chat.module.css';

const Chat: React.FC = () => {
  const { isConnected, isLoggedIn, messages, error, connect, login, sendMessage } = useSocket();

  useEffect(() => {
    connect();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Чат любителей книг</h2>
      {error && <div className={styles.error}>{error}</div>}
      {!isConnected && <div className={styles.status}>Подключение к серверу...</div>}
      {isConnected && !isLoggedIn && (
        <LoginForm onLogin={login} isConnecting={!isConnected} />
      )}
      {isConnected && isLoggedIn && (
        <ChatRoom messages={messages} onSendMessage={sendMessage} isLoggedIn={isLoggedIn} />
      )}
  </div>
  );
};

export default Chat;
