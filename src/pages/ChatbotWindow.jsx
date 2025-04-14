import React, { useState } from 'react';
import '../styles/ChatbotWindow.css';

const ChatbotWindow = ({ isVisible, toggleVisibility }) => {
    return (
        <div className={`chatbot-window ${isVisible ? 'slide-up' : 'slide-down'}`}>
            <div className="chatbot-header">
                <button className="close-btn" onClick={toggleVisibility}>X</button>
            </div>
            <div className="chatbot-body">
                <p>챗봇 대화창이 여기에 표시됩니다.</p>
                {/* 실제 챗봇 대화 내용이 표시될 수 있습니다 */}
            </div>
        </div>
    );
};

export default ChatbotWindow;