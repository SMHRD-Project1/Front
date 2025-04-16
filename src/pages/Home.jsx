import axios from 'axios';
import KakaoLogin from 'react-kakao-login';
import { useNavigate } from 'react-router-dom';  // 라우터 네비게이션을 위해 추가
import React, { useState, useRef, useEffect } from "react";
import { LocationProvider } from '../contexts/LocationContext';

import 업종분류 from '../config/업종분류.json'
import 업종코드목록 from '../config/업종코드목록.json';

import DetailPage from "./DetailPage";
import MapPage from './MapPage';
import RealEstate from './RealEstate';
import ChatBot from "../ChatBot";

import '../styles/Style.css';

const Home = () => {
    const mainPageRef = useRef();
    const navigate = useNavigate();  // 네비게이션 훅 추가

    const [text1, setText1] = useState("");  // 업종
    const [text2, setText2] = useState("");  // 지역(동)
    const [isClosing, setIsClosing] = useState(false); // 챗봇 닫기 애니메이션 상태
    const [hoveredSub, setHoveredSub] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hoveredMain, setHoveredMain] = useState(null);
    const [selectedDong, setSelectedDong] = useState(''); // 부동산 정보 넘기기 - 0416남규
    const [isChatVisible, setIsChatVisible] = useState(false); // 챗봇 대화창 표시 상태
    const [showRegionMenu, setShowRegionMenu] = useState(false);
    const [showRealEstate, setShowRealEstate] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState("지역");
    const [selectedCategory, setSelectedCategory] = useState("업종");
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [polygonCoordinates, setPolygonCoordinates] = useState(null); // 다각형 좌표 저장

    const dongList = [
        "광천동", "금호동", "농성동", "동천동", "상무1동", "상무2동",
        "서창동", "양동", "유덕동", "치평동", "풍암동", "화정동"
    ];

    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.category-button-wrapper')) {
                setShowCategoryMenu(false);
                setShowRegionMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const [업종코드, set업종코드] = useState("");
    const get업종코드 = (이름) => {
        let match = 업종코드목록.find(item => item.업종이름 === 이름);

        if (!match) {
            match = 업종코드목록.find(item => 이름.includes(item.업종이름) || item.업종이름.includes(이름));
        }

        return match ? match.업종코드 : "";
    };

    useEffect(() => {
        if (text1) {
            const code = get업종코드(text1);
            set업종코드(code);
        }
    }, [text1]);

    useEffect(() => {
        if (업종코드 && text2 && mainPageRef.current?.btn2Event) {
            mainPageRef.current.btn2Event(text1, text2);
        }
    }, [업종코드, text2]);

    const handleButtonClick = () => {
        if (isChatVisible) {
            setIsClosing(true);
            // 애니메이션 완료 후 컴포넌트 제거
            setTimeout(() => {
                setIsClosing(false);
                setIsChatVisible(false);
            }, 300); // 애니메이션 지속 시간과 동일하게 설정
        } else {
            setIsChatVisible(true);
        }
    };

    // 카카오 로그인 성공 시 호출되는 함수
    const responseKakao = async (response) => {
        try {
            if (!response || !response.profile) {
                console.error("로그인 응답이 유효하지 않습니다");
                return;
            }

            const kakaoId = response.profile.id;
            const nickname = response.profile.properties.nickname;

            // 서버에 로그인 요청
            const serverResponse = await axios.post('http://localhost:8088/controller/login', {
                id: kakaoId,
                nickname: nickname
            });

            if (serverResponse.data) {
                setIsLoggedIn(true);
                // 로컬 스토리지에 로그인 정보 저장
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userInfo', JSON.stringify({ id: kakaoId, nickname: nickname }));
            }
        } catch (error) {
            console.error('로그인 처리 중 오류가 발생했습니다:', error);
        }
    };

    // 로그아웃 처리
    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userInfo');
    };

    // 컴포넌트 마운트 시 로그인 상태 확인
    useEffect(() => {
        const savedLoginState = localStorage.getItem('isLoggedIn');
        const savedUserInfo = localStorage.getItem('userInfo');

        if (savedLoginState === 'true' && savedUserInfo) {
            setIsLoggedIn(true);
        }
    }, []);

    const errorKakao = (error) => {
        console.error('카카오 로그인 실패:', error);
    };

    // 다각형 좌표를 저장하는 함수
    const handlePolygonSet = (coordinates) => {
        console.log('다각형 좌표 저장:', coordinates);
        setPolygonCoordinates(coordinates);
    };

    // 업종 선택 시 다각형이 설정되어 있다면 해당 구역 내의 새로운 업종 핀을 표시
    const handleCategorySelect = async (detail) => {
        setSelectedCategory(detail);
        const code = get업종코드(detail);
        setText1(detail);
        set업종코드(code);
        setShowCategoryMenu(false);
        setHoveredMain(null);
        setHoveredSub(null);

        setTimeout(() => {
            if (mainPageRef.current?.btn1Event) {
                mainPageRef.current.btn1Event(detail); // 업종 이벤트만 전달
            }

            if (mainPageRef.current?.btn2Event) {
                if (polygonCoordinates && Object.keys(polygonCoordinates).length > 0) {
                    mainPageRef.current.btn2Event("다각형 설정", polygonCoordinates);
                } else if (selectedDong) {
                    mainPageRef.current.btn2Event(selectedDong);
                } else if (text2) {
                    mainPageRef.current.btn2Event(text2);
                }
            }
        }, 100);
    };

    const handleRegionSelect = (option) => {
        setSelectedRegion(option);
        setText2(option);
        setShowRegionMenu(false);
        setHoveredMain(null);

        if (option !== '동 설정' && option !== '다각형 설정') {
            setSelectedDong(option);
            setPolygonCoordinates(null);
        }

        setTimeout(() => {
            if (mainPageRef.current?.btn2Event) {
                if (option === '다각형 설정' && polygonCoordinates) {
                    mainPageRef.current.btn2Event("다각형 설정", polygonCoordinates);
                } else {
                    mainPageRef.current.btn2Event(option);
                }
            }
        }, 100);
    };

    // 마이페이지로 이동하는 함수
    const handleMyPageClick = () => {
        navigate('/mypage');
    };

    return (
        <div className="home-container">

            <DetailPage
                selectedRegion={selectedRegion}
                selectedDong={selectedDong}
                selectedCategory={selectedCategory}
            />
            <LocationProvider>
                {/* 부동산 정보 토글 버튼 */}
                <button
                    className={`real-estate-toggle ${showRealEstate ? 'active' : ''}`}
                    onClick={() => setShowRealEstate(!showRealEstate)}
                >
                    부동산정보
                </button>

                <RealEstate
                    isOpen={showRealEstate}
                    onClose={() => setShowRealEstate(!showRealEstate)} // 닫기 버튼 클릭 시 상태 false로 설정
                />

                <MapPage
                    ref={mainPageRef}
                    selectedCategory={selectedCategory}
                    selectedRegion={selectedRegion}
                    selectedDong={selectedDong}
                    업종코드={업종코드}
                    onPolygonSet={handlePolygonSet}
                />
            </LocationProvider>

            {/* 지도 위에 떠있는 버튼들 */}
            <div className="ui-overlay">
                <div className="top-row">
                    <div className="left-buttons">
                        <div className="category-button-wrapper">
                            <button className="Button1" onClick={() => setShowCategoryMenu(!showCategoryMenu)}>{selectedCategory}</button>

                            {showCategoryMenu && (
                                <div className="category-menu-container">
                                    <div className="category-menu">
                                        {Object.entries(업종분류).map(([main, subs]) => (
                                            <div
                                                key={main}
                                                className="category-item"
                                                onMouseEnter={() => setHoveredMain(main)}
                                            >
                                                {main}

                                                {hoveredMain === main && (
                                                    <div className="subcategory-menu">
                                                        {Object.entries(subs).map(([sub, details]) => (
                                                            <div
                                                                key={sub}
                                                                className="subcategory-item"
                                                                onMouseEnter={() => setHoveredSub(sub)}
                                                            >
                                                                {sub}

                                                                {hoveredSub === sub && (
                                                                    <div className="subsubcategory-menu">
                                                                        {details.map((detail) => (
                                                                            <div
                                                                                key={detail}
                                                                                className="subsubcategory-item"
                                                                                onClick={() => handleCategorySelect(detail)}
                                                                            >
                                                                                {detail}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="category-button-wrapper">
                            <button
                                className="Button1"
                                onClick={() => {
                                    setShowRegionMenu(!showRegionMenu);
                                    setShowCategoryMenu(false);
                                }}
                            >
                                {selectedRegion}
                            </button>

                            {showRegionMenu && (
                                <div className="category-menu-container region-menu">
                                    <div className="category-menu">
                                        {["동 설정", "범위 설정", "다각형 설정"].map((option) => (
                                            <div
                                                key={option}
                                                className="category-item"
                                                onMouseEnter={() => setHoveredMain(option)}
                                                onClick={() => {
                                                    if (option === "다각형 설정" || option === "동 설정") {
                                                        handleRegionSelect(option);
                                                    }
                                                }}
                                            >
                                                {option}

                                                {hoveredMain === "동 설정" && option === "동 설정" && (
                                                    <div className="subcategory-menu">
                                                        {dongList.map((dong) => (
                                                            <div
                                                                key={dong}
                                                                className="subcategory-item"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRegionSelect(dong);
                                                                }}
                                                            >
                                                                {dong}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="right-buttons">
                        {isLoggedIn ? (
                            <div className="login-buttons">
                                <button
                                    className="Button2"
                                    onClick={handleMyPageClick}
                                >
                                    마이페이지
                                </button>
                                <button
                                    className="Button2"
                                    onClick={handleLogout}
                                >
                                    로그아웃
                                </button>
                            </div>
                        ) : (
                            <KakaoLogin
                                token={process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY}
                                onSuccess={responseKakao}
                                onFailure={errorKakao}
                                useLoginForm={true}
                                render={({ onClick }) => (
                                    <button
                                        className="Button2"
                                        onClick={onClick}
                                    >
                                        로그인
                                    </button>
                                )}
                            />
                        )}
                    </div>
                </div>

                <div className="bottom-row">
                    <button className="image-button" onClick={handleButtonClick}>
                        <img
                            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7BrQmBK8fB/8qkztdd1_expires_30_days.png"
                            className="image6"
                            alt="logo"
                        />
                    </button>
                </div>
            </div>

            {/* 챗봇 창을 조건부 렌더링으로 변경 */}
            {(isChatVisible || isClosing) && (
                <div className={`chat-container ${isClosing ? 'hide' : 'show'}`}>
                    <ChatBot />
                </div>
            )}
        </div>
    );
};


export default Home