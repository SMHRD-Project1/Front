import React from 'react';
import axios from 'axios';
import KakaoLogin from 'react-kakao-login';

function App() {
  // 로그인 성공 시 호출되는 콜백 함수
  const responseKakao = (response) => {
    console.log('카카오 로그인 성공:', response);
    
    // 응답 객체 유효성 체크
    if (!response || !response.profile) {
      console.error("유효하지 않은 응답입니다:", response);
      return;
    }
    
    // Kakao 로그인 응답에서 id와 nickname 추출 (응답 객체 구조에 맞게 수정)
    const kakaoId = response.profile.id;
    const nickname = response.profile.properties.nickname;
    
    console.log('ID:', kakaoId, ', Nickname:', nickname);

    // axios를 통해 Spring 서버로 POST 요청
    // 만약 Spring 서버가 localhost:에서 실행된다면 전체 URL을 명시합니다.
    axios.post('http://localhost:8088/controller/login',
        { id: kakaoId, nickname: nickname })
      .then((res) => {
        console.log('Spring 응답:', res.data);
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
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <KakaoLogin
        token={process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY}  // .env 파일에 저장한 카카오 JavaScript 키
        onSuccess={responseKakao} // 로그인 성공 콜백
        onFailure={errorKakao}    // 로그인 실패 콜백
        useLoginForm={true}       // 기본 로그인 폼 사용
      >
        카카오톡 로그인
      </KakaoLogin>
    </div>
  );
}

export default App;
