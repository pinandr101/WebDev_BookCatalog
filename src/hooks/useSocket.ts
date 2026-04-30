import { useEffect, useState, useRef } from 'react';
import { Socket } from 'socket.io-client';
import createSocket from '../api/socketIOConfigs';

interface Message {
  id: string;
  text: string;
  type: 'user' | 'system';
  username?: string;
  timestamp: Date;
}

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const connect = () => {
    const newSocket = createSocket();
    socketRef.current = newSocket;
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });
    
    newSocket.on('disconnect', () => {
      setIsConnected(false);
      setIsLoggedIn(false);
    });
    
    newSocket.on('status', (data: { message: string }) => {
      setIsLoggedIn(true);
      addSystemMessage(data.message);
    });
    
    newSocket.on('incomingMessage', (data: any) => {
        const sender = data.name || 'Неизвестный пользователь';
        addUserMessage(data.message, sender);
    });
    
    newSocket.on('systemMessage', (data: { message: string }) => {
      addSystemMessage(data.message);
    });
    
    newSocket.on('error', (data: { message: string }) => {
      setError(data.message);
    });
    
    newSocket.connect();
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
      setIsLoggedIn(false);
    }
  };

  const login = (username: string) => {
    if (socketRef.current) {
      socketRef.current.emit('login', { name: username });
    }
  };

  const sendMessage = (text: string) => {
    if (!isLoggedIn || !socketRef.current) {
      setError('Нельзя отправить сообщение — вы не вошли в чат');
      return;
    }
    socketRef.current.emit('outgoingMessage', { message: text });
  };

  const addUserMessage = (text: string, username: string) => {
    setMessages(prev => [...prev, {
      id: Date.now() + Math.random().toString(),
      text,
      type: 'user',
      username,
      timestamp: new Date()
    }]);
  };

  const addSystemMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now() + Math.random().toString(),
      text,
      type: 'system',
      timestamp: new Date()
    }]);
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    socket,
    isConnected,
    isLoggedIn,
    messages,
    error,
    connect,
    disconnect,
    login,
    sendMessage,
  };
};
