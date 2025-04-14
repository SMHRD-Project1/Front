import React, { useEffect, useRef, useState } from 'react';
import './styles/changchang.css'
import axios from 'axios';

function App() {
  const [estate, setEstate] = useState({});
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState('');
  const [messages, setMessages] = useState([]);
  
  const [DF, setDF] = useState('');
  const [flag, setFlag] = useState(false);
  const [payRef, setpayRef] = useState('');
  const [dongRef, setdongRef] = useState('');

  const [sessionId] = useState(() => {
    const saved = localStorage.getItem('sessionId');
    if (saved) return saved;
    const randomId = Math.random().toString(36).substring(7);
    localStorage.setItem('sessionId', randomId)
    return randomId;
  })

  function SendQuestion() {
    console.log("보낼 질문:", question);

    const userMessage = { sender: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);

    fetch("http://localhost:3002/api/chat", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: question, sessionId: sessionId })
    }).then((res) => res.json())
      .then((data) => {
        console.log("Dialogflow 응답 :", data);
        
        setDF(data);
        if (data.parameters?.fields?.dong?.stringValue){
          console.log("dongin")
          setdongRef(data.parameters?.fields?.dong?.stringValue);
        }
        
        if (data.parameters?.fields?.pay?.stringValue){
          console.log("payin")
          setpayRef(data.parameters?.fields?.pay?.stringValue);
        }

        setAnswer(data.answer)
        
        const botMessage = { sender: "chang", text: data.answer };
        setMessages((prev) => [...prev, botMessage])
      }).catch((err) => console.log("에러발생", err))

    setFlag("true");
  }

  useEffect(() => {
    console.log(flag)
    console.log(payRef)
    console.log(dongRef)

    if (flag && payRef && dongRef){
      console.log("in", question)
      axios.get(
        'http://localhost:8085/controller/test',
        {
          params: {
            question: question,
            dong: dongRef,
            pay: payRef
          }
        }
      )
      .then((res) => {
        console.log("스프링응답", res.data)
      })
    }
  }, [DF])

  useEffect(() => {
    fetch("http://localhost:3002/api/estate-info")
      .then((res) => res.json())
      .then((data) => {
        console.log("추천 부동산:", data);
        setEstate(data);
      }).catch((err) => console.error("에러발생", err))
  }, []);

  return (
    <div className='chat'>
      <div className="chatArea">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === 'user' ? 'userMessage' : 'botMessage'}>
            {msg.sender === 'user' ? '나: ' : '창창이: '}
            {msg.text}
          </div>
        ))}
      </div>

      <div className='inputChat'>
        <input type='text'
          placeholder='할 말 입력'
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button onClick={SendQuestion}>입력</button>
      </div>
    </div>
  );
}

export default App;
