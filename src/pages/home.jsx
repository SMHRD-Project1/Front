import React, { useState, useRef } from "react";
import axios from 'axios';
import '../styles/Style.css';
import MainPage from './MainPage';
import 업종분류 from '../config/업종분류.json'
import DetailPage from "./DetailPage";

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

    const dongList = [
        "광천동", "금호동", "농성동", "동천동", "상무1동", "상무2동",
        "서창동", "양동", "유덕동", "치평동", "풍암동", "화정동"
    ];

    // ===== 스프링을 위해 추가된 부분 시작 =====
    // 스프링으로 데이터 전송하는 함수
    const sendDataToSpring = async (category, dong) => {
        console.log("스프링으로 데이터 전송 시도:", { category, dong });
        try {
            const response = await axios.post('http://localhost:8088/analysis', {
                category: category,
                dong: dong,
                timestamp: new Date().toISOString()
            });
            console.log('서버 응답:', response.data);
        } catch (error) {
            console.error('데이터 전송 실패:', error);
        }
    };
    // ===== 스프링을 위해 추가된 부분 끝 =====

    // 업종 선택 처리 함수
    const handleCategorySelect = (category) => {
        console.log("업종 선택됨:", category);
        setSelectedCategory(category);
        setShowCategoryMenu(false);
        setHoveredMain(null);
        setHoveredSub(null);
        handleRegionAndCategory();
        // 업종 선택 시 데이터 전송
        if (selectedDong) {
            console.log("동이 선택되어 있어서 데이터 전송");
            sendDataToSpring(category, selectedDong);
        }
    };

    // 동 설정 클릭 시 동 목록을 보여줌
    const handleRegionButtonClick = () => {
        setShowRegionMenu(!showRegionMenu);
    };

    // 동 목록에서 동을 선택했을 때
    const handleDongSelect = (dong) => {
        console.log("동 선택됨:", dong);
        setSelectedRegion(dong);
        setSelectedDong(dong);
        handleRegionAndCategory();
        // 동 선택 시 데이터 전송
        if (selectedCategory !== "업종") {
            console.log("업종이 선택되어 있어서 데이터 전송");
            sendDataToSpring(selectedCategory, dong);
        }
    };
    // ===== 스프링을 위해 추가된 부분 끝 =====

    // 동과 업종 정보를 챗봇에 전달하는 함수
    const handleRegionAndCategory = () => {
        if (mainPageRef.current?.btn2Event) {
            const text = `${selectedDong || ''} ${selectedCategory || ''}`.trim();
            if (text) {
                mainPageRef.current.btn2Event(text);  // 챗봇에 텍스트 전달
            }
        }
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

    const handleButtonClick = () => {
        setIsChatVisible(!isChatVisible);  // 챗봇 대화창 숨기기
    };

    const navigate = useNavigate();

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
                                                    if (option === "다각형 설정") {
                                                        setSelectedRegion(`다각형 설정${selectedDong ? ` (${selectedDong})` : ''}`);
                                                        handleRegionAndCategory(); // 다각형 설정 시
                                                        setShowRegionMenu(false);
                                                        setHoveredMain(null);
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
                                                                    setShowRegionMenu(false);
                                                                    setHoveredMain(null);

                                                                    handleRegionAndCategory();  // 챗봇으로 동과 업종 정보를 전달
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
                        <button className="Button2" onClick={() => alert("Pressed!")}>로그인</button>
                        <button className="Button2" onClick={() => navigate('/mypage')}>마이페이지</button>
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
            <DetailPage 
                selectedRegion={selectedRegion}
                selectedDong={selectedDong}
                selectedCategory={selectedCategory}  // 선택한 업종을 전달
                data={[]} // 여기에 실제 데이터를 전달하거나 필요에 따라 수정
            />
        </div>
    );
};

export default Home;