import React, { useEffect, useRef, useState } from 'react';
import './styles/changchang.css'
import axios from 'axios';
import estateData from './config/부동산.json';

function App({ selectedDong, onDongUpdate, onPayUpdate, onIndustryUpdate }) {
  const [estate, setEstate] = useState({});
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState('');
  const [messages, setMessages] = useState([]);
  
  const [DF, setDF] = useState('');
  const [flag, setFlag] = useState(false);
  const [payRef, setpayRef] = useState('');
  const [dongRef, setdongRef] = useState('');
  // 실험 
  const [dong, setDongState] = useState('');
  const [industry, setIndustry] = useState('');
  const [pay, setPay] = useState('');
  
  const [sessionId] = useState(() => {
    const saved = localStorage.getItem('sessionId');
    if (saved) return saved;
    const randomId = Math.random().toString(36).substring(7);
    localStorage.setItem('sessionId', randomId)
    return randomId;
  })
  // 엔터 , 클릭으로 전송송
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && question.trim() !== '') {
      SendQuestion();
    }
  };

  // 질문 보내는 함수
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
        
        // parameters가 존재하는지 확인
        if (data.parameters && data.parameters.fields) {
          const dongValue = data.parameters?.fields?.dong?.listValue?.values[0]?.stringValue;
          const industryValue = data.parameters.fields.industry?.stringValue;
          const payValue = data.parameters.fields.pay?.stringValue;

          console.log("dong 값 확인:", dongValue);  // 디버깅용 로그
          console.log("industry 값 확인:", industryValue);  // 디버깅용 로그
          console.log("pay 값 확인:", payValue);  // 디버깅용 로그

          // industry 값이 있으면 먼저 처리
          if (industryValue) {
            console.log("industry 저장:", industryValue);
            setIndustry(industryValue);
            onIndustryUpdate && onIndustryUpdate(industryValue);
          }

          // 그 다음 dong 값 처리
          if (dongValue) {
            console.log("dong 저장 시도:", dongValue);  // 디버깅용 로그
            setDongState(dongValue);
            // 동 값이 있고 onDongUpdate가 함수인 경우에만 호출
            if (onDongUpdate && typeof onDongUpdate === 'function') {
              console.log("onDongUpdate 호출:", dongValue);  // 디버깅용 로그
              onDongUpdate(dongValue + "동");  // '동'을 붙여서 전달
            }
          }

          // 마지막으로 pay 값 처리
          if (payValue) {
            console.log("pay 저장:", payValue);
            setPay(payValue);
            onPayUpdate && onPayUpdate(payValue);
          }
        }

        // Dialogflow의 응답을 먼저 표시
        const botMessage = { sender: "chang", text: data.answer };
        setMessages(prev => [...prev, botMessage]);
      })
      .catch((err) => console.log("에러발생", err));

    setFlag("true");
    setQuestion("");  // 입력창 비우기
  }

  useEffect(() => {
    console.log("현재 값:", { dong, industry, pay });

    if (dong && industry && pay) {
      // 월세에서 '만원'을 제거하고 숫자만 추출
      const payNumber = parseInt(pay.replace('만원', '')); // 만원 단위로 변환
      
      // 1. 먼저 동으로 필터링
      const matchingEstates = estateData.filter(estate => {
        // 소재지에서 '동'을 제거하고 비교
        const estateDong = estate.소재지.replace('동', '').trim();
        const inputDong = dong.replace('동', '').trim();
        
        // 추천업종에 입력한 업종이 포함되어 있는지 확인 (대소문자 구분 없이)
        const hasIndustry = estate.추천업종.toLowerCase().includes(industry.toLowerCase());
        
        // 월세를 숫자로 변환 (예: "5,000/500" -> 500)
        const estatePay = parseInt(estate.월세.split('/')[1].replace(/,/g, ''));
        
        return estateDong === inputDong && hasIndustry;
      });

      if (matchingEstates.length === 0) {
        const noResultMessage = {
          sender: 'chang',
          text: '죄송합니다. 해당 동에 조건에 맞는 부동산이 없습니다.'
        };
        setMessages(prev => [...prev, noResultMessage]);
        return;
      }

      // 2. 입력받은 월세 미만의 매물만 필터링
      const affordableEstates = matchingEstates.filter(estate => {
        const estatePay = parseInt(estate.월세.split('/')[1].replace(/,/g, ''));
        return estatePay <= payNumber;
      });

      if (affordableEstates.length === 0) {
        const noResultMessage = {
          sender: 'chang',
          text: `죄송합니다. 해당 동에 월세 ${payNumber}만원 미만의 매물이 없습니다.`
        };
        setMessages(prev => [...prev, noResultMessage]);
        return;
      }

      // 3. 월세 기준 내림차순 정렬
      affordableEstates.sort((a, b) => {
        const payA = parseInt(a.월세.split('/')[1].replace(/,/g, ''));
        const payB = parseInt(b.월세.split('/')[1].replace(/,/g, ''));
        return payB - payA; // 내림차순 정렬
      });

      // 결과를 메시지로 표시 (중복 방지를 위해 이전 메시지와 비교)
      const newMessage = {
        sender: 'chang',
        text: `부동산 정보를 확인해주세요!\n선택된 동: ${dong}\n월세: ${pay} 미만\n업종: ${industry}`
      };

      // 이전 메시지와 비교하여 중복되지 않은 경우에만 추가
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (!lastMessage || lastMessage.text !== newMessage.text) {
          return [...prev, newMessage];
        }
        return prev;
      });

      // dong 값이 변경되었을 때 onDongUpdate 호출
      if (dong && dong !== selectedDong) {
        onDongUpdate(dong);
      }

      // pay 값이 있을 때 onPayUpdate 호출
      if (pay) {
        onPayUpdate(pay);
      }
    }
  }, [dong, industry, pay, selectedDong, onDongUpdate, onPayUpdate]);

  // 실험전
  // useEffect(() => {
  //   console.log(flag)
  //   console.log(payRef)
  //   console.log(dongRef)

  //   if (flag && payRef && dongRef){
  //     console.log("in", question)
  //     axios.get(
  //       'http://localhost:8088/controller/test',
  //       {
  //         params: {
  //           question: question,
  //           dong: dongRef,
  //           pay: payRef
  //         }
  //       }
  //     )
  //     .then((res) => {
  //       console.log("스프링응답", res.data)
  //     })
  //   }
  // }, [DF])

  useEffect(() => {
    // 초기 메시지 설정
    const initialMessage = {
      sender: 'chang',
      text: '안녕하세요!\n행정동과 업종을 알려주세요!'
    };
    setMessages([initialMessage]);
  }, []);

  // 채팅 영역에 대한 ref 추가
  const chatAreaRef = useRef(null);

  // 메시지 목록이 업데이트될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]); // messages 배열이 변경될 때마다 실행

  // selectedDong이 변경될 때 dong 상태 업데이트
  useEffect(() => {
    if (selectedDong) {
      console.log("selectedDong 변경됨:", selectedDong);
      setDongState(selectedDong);
    }
  }, [selectedDong]);

  return (
    <div className='chat'>
      <div className="chatArea" ref={chatAreaRef}>
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === 'user' ? 'userMessage' : 'botMessage'}>
            {msg.sender === 'user' ? '나: ' : '창창이: '}
            {msg.text ? msg.text.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            )) : ''}
          </div>
        ))}
      </div>

      <div className='inputChat'>
        <input type='text'
          placeholder='  텍스트를 입력해주세요'
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={SendQuestion}>입력</button>
      </div>
    </div>
  );
}

export default App;
