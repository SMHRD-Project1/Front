import axios from 'axios';
import KakaoLogin from 'react-kakao-login';
import React from "react";
import { useAuth } from '../contexts/AuthContext'

function Login() {
  const { login } = useAuth();

  const errorKakao = (error) => {
    console.error('카카오 로그인 실패:', error);
  };

  const responseKakao = async (response) => {
    try {
      if (!response || !response.profile) {
        console.error("로그인 응답이 유효하지 않습니다");
        return;
      }

      const kakaoId = response.profile.id;
      const nickname = response.profile.properties.nickname;

      console.log("로그인 성공 - 카카오 ID:", kakaoId);

      const serverResponse = await axios.post('http://localhost:8088/controller/login', {
        id: kakaoId,
        nickname: nickname
      });

      if (serverResponse.data) {
        login({ id: kakaoId, nickname });  // context의 login 사용
      }
    } catch (error) {
      console.error('로그인 처리 중 오류가 발생했습니다:', error);
    }
  };

  return (
    <div>
      <KakaoLogin
        token={process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY}
        onSuccess={responseKakao}
        onFailure={errorKakao}
        useLoginForm={true}
        render={({ onClick }) => (
          <button className="Button2" onClick={onClick}>
            로그인
          </button>
        )}
      />
    </div>
  );
}

export default Login;
