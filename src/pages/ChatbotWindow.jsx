import React, { useState } from 'react';
import '../styles/ChatbotWindow.css';
import ChatBot from '../ChatBot';


const ChatbotWindow = ({ isVisible, toggleVisibility }) => {
    return (
        <div className={`chatbot-window ${isVisible ? 'slide-up' : 'slide-down'}`}>
            <div className="chatbot-header">
                <button className="close-btn" onClick={toggleVisibility}>X</button>
            </div>
            <div className="chatbot-body">
                <ChatBot />
            </div>
        </div>
    );
};

export default ChatbotWindow;