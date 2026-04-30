import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatRoom.module.css';

interface Message {
  id: string;
  text: string;
  type: 'user' | 'system';
  username?: string;
  timestamp: Date;
}

interface ChatRoomProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoggedIn: boolean;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ messages, onSendMessage, isLoggedIn }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && isLoggedIn) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={styles.room}>
      <div className={styles.messages}>
        {messages.map(msg => (
          <div key={msg.id} className={`${styles.message} ${msg.type === 'system' ? styles.system : styles.user}`}>
            <span className={styles.time}>{msg.timestamp.toLocaleTimeString()}</span>
            {msg.type === 'user' && <strong className={styles.username}>{msg.username}: </strong>}
            <span className={styles.text}>{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLoggedIn ? "Введите сообщение..." : "Необходимо войти"}
          disabled={!isLoggedIn}
          maxLength={256}
          className={styles.messageInput}
        />
        <button type="submit" disabled={!isLoggedIn} className={styles.sendBtn}>Отправить</button>
      </form>
  </div>
  );
};

export default ChatRoom;
