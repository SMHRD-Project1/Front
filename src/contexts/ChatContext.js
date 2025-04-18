import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [dong, setDong] = useState('');
  const [pay, setPay] = useState('');
  const [industry, setIndustry] = useState('');

  return (
    <ChatContext.Provider value={{ dong, setDong, pay, setPay, industry, setIndustry }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
