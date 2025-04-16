import React from 'react';
import axios from 'axios';
import KakaoLogin from 'react-kakao-login';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();  // 네비게이션 훅 추가

  // 로그인 성공 시 호출되는 콜백 함수
  const responseKakao = (response) => {
    console.log('카카오 로그인 성공:', response);
    
    // 응답 객체 유효성 체크
    if (!response || !response.profile) {
      console.error("유효하지 않은 응답입니다:", response);
      return;
    }
    
    // Kakao 로그인 응답에서 id와 nickname 추출
    const kakaoId = response.profile.id;
    const nickname = response.profile.properties.nickname;
    
    console.log('ID:', kakaoId, ', Nickname:', nickname);

    // axios를 통해 Spring 서버로 POST 요청
    axios.post('http://localhost:8088/controller/login',
        { id: kakaoId, nickname: nickname })
      .then((res) => {
        console.log('Spring 응답:', res.data);
        // 로그인 성공 시 홈으로 이동
        navigate('/');
      })
      .catch((err) => {
        console.error('Spring 통신 실패:', err);
      });
  };

  // 로그인 실패 시 호출되는 콜백 함수
  const errorKakao = (error) => {
    console.error('카카오 로그인 실패:', error);
  };

  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '20px' }}>로그인</h2>
        <KakaoLogin
          token={process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY}
          onSuccess={responseKakao}
          onFailure={errorKakao}
          useLoginForm={true}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#FEE500',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          카카오톡 로그인
        </KakaoLogin>
      </div>
    </div>
  );
}
export default Login;
