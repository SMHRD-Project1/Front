import React, { useState, useRef, useEffect } from "react";
import '../styles/Style.css';
import MainPage from './MainPage';
import 업종분류 from '../config/업종분류.json'
// import ChatbotWindow from "./ChatbotWindow";
import ChatBot from "../ChatBot";
import { useNavigate } from 'react-router-dom';  // 라우터 네비게이션을 위해 추가
import 업종코드목록 from '../config/업종코드목록.json';
import KakaoLogin from 'react-kakao-login';
import axios from 'axios';



const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState("업종");
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [hoveredMain, setHoveredMain] = useState(null);
    const [hoveredSub, setHoveredSub] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState("지역");
    const [showRegionMenu, setShowRegionMenu] = useState(false);
    const [selectedDong, setSelectedDong] = useState(null);  // 동 설정에 대한 선택
    const mainPageRef = useRef();
    const [isChatVisible, setIsChatVisible] = useState(false); // 챗봇 대화창 표시 상태
    const [isClosing, setIsClosing] = useState(false); // 챗봇 닫기 애니메이션 상태
    const navigate = useNavigate();  // 네비게이션 훅 추가
    const [text1, setText1] = useState("");  // 업종
    const [text2, setText2] = useState("");  // 지역(동)

    const dongList = [
        "광천동", "금호동", "농성동", "동천동", "상무1동", "상무2동",
        "서창동", "양동", "유덕동", "치평동", "풍암동", "화정동"
    ];

    // 동 설정 클릭 시 동 목록을 보여줌
    const handleRegionButtonClick = () => {
        setShowRegionMenu(!showRegionMenu);
    };

    // 동 목록에서 동을 선택했을 때
    const handleDongSelect = (dong) => {
        setSelectedRegion(dong);
    };

    // btn2Event의 로직을 Home 컴포넌트로 가져옴
    const handleRegionAndCategory = () => {
        if (mainPageRef.current?.btn2Event) {
            mainPageRef.current.btn2Event(text1, text2);
        }
    };

    // 로그인 페이지로 이동하는 함수
    const handleLoginClick = () => {
        navigate('/login');  // /login 경로로 이동
    };

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
        if (업종코드) {
            handleRegionAndCategory();
        }
    }, [업종코드]);

    useEffect(() => {
        if (text2) {
            handleRegionAndCategory();
        }
    }, [text2]);

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

    const handleCategorySelect = async (detail) => {
        setSelectedCategory(detail);
        const code = get업종코드(detail);
        setText1(detail);
        set업종코드(code);
        setShowCategoryMenu(false);
        setHoveredMain(null);
        setHoveredSub(null);

        setTimeout(() => {
            if (mainPageRef.current?.btn2Event) {
                mainPageRef.current.btn2Event(detail, text2);
            }
        }, 100);
    };

    const handleRegionSelect = (option) => {
        setSelectedRegion(option);
        setText2(option);
        setShowRegionMenu(false);
        setHoveredMain(null);
        
        setTimeout(() => {
            if (mainPageRef.current?.btn2Event) {
                mainPageRef.current.btn2Event(text1, option);
            }
        }, 100);
    };

    // 카카오 로그인 성공 시 호출되는 함수
    const responseKakao = (response) => {
        if (!response || !response.profile) {
            console.error("로그인 응답이 유효하지 않습니다");
            return;
        }
        
        const kakaoId = response.profile.id;
        const nickname = response.profile.properties.nickname;

        axios.post('http://localhost:8088/controller/login',
            { id: kakaoId, nickname: nickname })
            .then((res) => {
                // 로그인 성공 처리
            })
            .catch((err) => {
                console.error('로그인 처리 중 오류가 발생했습니다:', err);
            });
    };

    const errorKakao = (error) => {
        console.error('카카오 로그인 실패:', error);
    };

    return (
        <div className="map-wrapper">

            <MainPage ref={mainPageRef} 업종코드={업종코드} />

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
                                    setShowCategoryMenu(false); // 다른 메뉴는 닫기
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