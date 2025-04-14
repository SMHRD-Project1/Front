import React, { useState, useRef, useEffect } from "react";
import '../styles/Style.css';
import MainPage from './MainPage';
import 업종분류 from '../config/업종분류.json'
// import ChatbotWindow from "./ChatbotWindow";
import ChatBot from "../ChatBot";
import { useNavigate } from 'react-router-dom';  // 라우터 네비게이션을 위해 추가



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

    useEffect(() => {
        if (text1) {
            handleRegionAndCategory();
            console.log("텍스트1" , text1); 
        }
    }, [text1]);


    // 텍스트 값이 업데이트된 후 handleRegionAndCategory를 호출하기 위해 useEffect 사용
    useEffect(() => {
        if (text2) {
            handleRegionAndCategory();
        }
    }, [text2]);  // text2가 변경될 때마다 호출됨



    const handleButtonClick = () => {
        setIsChatVisible(!isChatVisible);  // 챗봇 대화창 숨기기
    };


    return (
        <div className="map-wrapper">

            <MainPage ref={mainPageRef} />

            {/* ✅ 지도 위에 떠있는 버튼들 */}
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
                                                                                onClick={() => {
                                                                                    setSelectedCategory(detail);
                                                                                    setText1(detail);  // ✅ text1에 저장
                                                                                    setShowCategoryMenu(false);
                                                                                    setHoveredMain(null);
                                                                                    setHoveredSub(null);
                                                                                }}
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
                                                    if (option === "다각형 설정") {
                                                        // 동 이름은 필요 없으므로 selectedDong이나 text2는 건드리지 않음
                                                        setSelectedRegion("다각형 설정");
                                                        handleRegionAndCategory();  // 이건 polygon 그리기용 이벤트 발생용
                                                        setShowRegionMenu(false);
                                                        setHoveredMain(null);
                                                        setSelectedDong(option);
                                                        setText2(option);  // ✅ text2에 저장
                                                        console.log("👉 텍스트:", text2);
                                                    } else if (option === "동 설정") {
                                                        setHoveredMain("동 설정");
                                                    }
                                                }}
                                            >
                                                {option}

                                                {/* ✅ 동 설정 시 중분류 (동 목록) 옆으로 표시 */}
                                                {hoveredMain === "동 설정" && option === "동 설정" && (
                                                    <div className="subcategory-menu">
                                                        {dongList.map((dong) => (
                                                            <div
                                                                key={dong}
                                                                className="subcategory-item"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedRegion(dong);
                                                                    setSelectedDong(dong);
                                                                    setText2(dong);  // ✅ text2에 저장
                                                                    setShowRegionMenu(false);
                                                                    setHoveredMain(null);
                                                                    handleRegionAndCategory(); // 동 선택 시
                                                                    console.log("👉 텍스트2222:", text2);
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
                        <button className="Button2" onClick={handleLoginClick}>로그인</button>
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
            {isChatVisible && (
                <div className="chat-container">
                    <ChatBot />
                </div>
            )}
        </div>
    );
};


export default Home