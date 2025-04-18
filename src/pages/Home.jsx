import { useNavigate } from 'react-router-dom';  // 라우터 이동을 위한 hook
import React, { useState } from "react";
import { LocationProvider } from '../contexts/LocationContext';  // 위치 정보 context
import { useAuth } from '../contexts/AuthContext';  // 로그인 상태 관리 context

import 업종분류 from '../config/업종분류.json'  // 업종 분류 데이터

import DetailPage from './DetailPage';  // 상세 페이지 컴포넌트
import RealEstate from './RealEstate';  // 부동산 정보 컴포넌트
import ChatBot from '../ChatBot';  // 챗봇 컴포넌트
import Login from '../components/Login';  // 로그인 컴포넌트
import MapPage from "./MainMapPage"

import '../styles/Style.css';  // 스타일 시트

const Home = () => {
    const navigate = useNavigate();  // 페이지 이동을 위한 훅

    // 상태 변수들 정의
    const [clickedMain, setClickedMain] = useState(null);  // 클릭된 대분류
    const [clickedSub, setClickedSub] = useState(null);    // 클릭된 중분류
    const [isClosing, setIsClosing] = useState(false);  // 챗봇 닫힘 애니메이션 여부
    const [hoveredSub, setHoveredSub] = useState(null);
    const { isLoggedIn, logout } = useAuth();  // 로그인 상태 및 로그아웃 함수
    const [hoveredMain, setHoveredMain] = useState(null);
    const [selectedDong, setSelectedDong] = useState('');  // 선택된 동 정보
    const [isChatVisible, setIsChatVisible] = useState(false);  // 챗봇 창 표시 여부
    const [showRegionMenu, setShowRegionMenu] = useState(false);  // 지역 메뉴 표시 여부
    const [showRealEstate, setShowRealEstate] = useState(false);  // 부동산 정보 표시 여부
    const [selectedRegion, setSelectedRegion] = useState("지역");  // 선택된 지역
    const [selectedCategory, setSelectedCategory] = useState("업종");  // 선택된 업종
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);  // 업종 메뉴 표시 여부
    const [polygonCoordinates, setPolygonCoordinates] = useState(null);  // 다각형 좌표
    const [mapToRegion, setMapToRegion] = useState(null);
    const [mapToCate, setMapToCate] = useState(null);

    const dongList = ["광천동", "금호동", "농성동", "동천동", "상무1동", "상무2동", "서창동", "양동", "유덕동", "치평동", "풍암동", "화정동"];


    // 메뉴 외부 클릭 시 닫히도록 설정
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

    // 챗봇 토글 버튼 클릭 핸들러
    const handleButtonClick = () => {
        if (isChatVisible) {
            setIsClosing(true);
            setTimeout(() => {
                setIsClosing(false);
                setIsChatVisible(false);
            }, 300);
        } else {
            setIsChatVisible(true);
        }
    };


    // // 업종 선택 시 처리 함수
    const handleCategorySelect = async (detail) => {
        setHoveredMain(null);
        setSelectedCategory(detail);
        setShowCategoryMenu(false);
        setHoveredSub(null);
        setMapToCate(detail);

    };

    // // 지역 선택 시 처리 함수
    const handleRegionSelect = (option) => {
        setHoveredMain(null);
        setSelectedRegion(option);
        setShowRegionMenu(false);
        setMapToRegion(option);


        if (option !== '동 설정' && option !== '다각형 설정') {
            setSelectedDong(option); // 그래프에 들어갈 동
            setPolygonCoordinates(null);
        }
    };


    return (
        <div className="home-container">

            <LocationProvider>
                {/* 상세 정보 페이지 */}
                <DetailPage
                    selectedRegion={selectedRegion}
                    selectedDong={selectedDong}
                    selectedCategory={selectedCategory}
                    polygonCoordinates={polygonCoordinates}
                />

                {/* 부동산 정보 창 */}
                <RealEstate
                    isOpen={showRealEstate}
                    onClose={() => setShowRealEstate(!showRealEstate)}
                />

                {/* 지도 페이지 */}
                <MapPage
                    region={mapToRegion}
                    cate={mapToCate}
                />
            </LocationProvider>

            {/* UI 오버레이 영역 */}
            <div className="ui-overlay">
                <div className="top-row">
                    <div className="left-buttons">
                        {/* 업종 선택 버튼 영역 */}
                        <div className="category-button-wrapper">
                            {/* 업종 버튼 클릭 시 업종 메뉴를 토글 */}
                            <button className="Button1" onClick={() => {
                                setShowCategoryMenu(!showCategoryMenu);  // 업종 메뉴 열기/닫기
                                setShowRegionMenu(false);  // 지역 메뉴는 강제로 닫기
                            }}>
                                {selectedCategory}  {/* 선택된 업종 텍스트 표시 */}
                            </button>

                            {/* 업종 메뉴 드롭다운 */}
                            {showCategoryMenu && (
                                <div className="category-menu-container">
                                    <div className="category-menu">
                                        {/* 대분류 (예: 음식, 서비스 등) */}
                                        {Object.entries(업종분류).map(([main, subs]) => (
                                            <div
                                                key={main}
                                                className="category-item"
                                                onClick={() => setClickedMain(main)}  // 클릭 시 고정
                                            >
                                                {main}

                                                {clickedMain === main && (
                                                    <div className="subcategory-menu">
                                                        {Object.entries(subs).map(([sub, details]) => (
                                                            <div
                                                                key={sub}
                                                                className="subcategory-item"
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // 부모 클릭 방지
                                                                    setClickedSub(sub);
                                                                }}
                                                            >
                                                                {sub}

                                                                {clickedSub === sub && (
                                                                    <div className="subsubcategory-menu">
                                                                        {details.map((detail) => (
                                                                            <div
                                                                                key={detail}
                                                                                className="subsubcategory-item"
                                                                                onClick={() => {
                                                                                    handleCategorySelect(detail);
                                                                                    setClickedMain(null);
                                                                                    setClickedSub(null);
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

                        {/* 지역 선택 버튼 영역 */}
                        <div className="category-button-wrapper">
                            {/* 지역 버튼 클릭 시 지역 메뉴를 토글 */}
                            <button
                                className="Button1"
                                onClick={() => {
                                    setShowRegionMenu(!showRegionMenu);  // 지역 메뉴 열기/닫기
                                    setShowCategoryMenu(false);  // 업종 메뉴는 강제로 닫기
                                }}
                            >
                                {selectedRegion}  {/* 선택된 지역 텍스트 표시 */}
                            </button>

                            {/* 지역 메뉴 드롭다운 */}
                            {showRegionMenu && (
                                <div className="category-menu-container region-menu">
                                    <div className="category-menu">
                                        {/* 동 설정 / 다각형 설정 메뉴 */}
                                        {["동 설정", "다각형 설정"].map((option) => (
                                            <div
                                                key={option}
                                                className="category-item"
                                                onClick={() => {
                                                    if (option === "동 설정") {
                                                        setClickedMain("동 설정");
                                                    } else {
                                                        handleRegionSelect(option);
                                                    }
                                                }}
                                            >
                                                {option}

                                                {clickedMain === "동 설정" && option === "동 설정" && (
                                                    <div className="subcategory-menu">
                                                        {dongList.map((dong) => (
                                                            <div
                                                                key={dong}
                                                                className="subcategory-item"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRegionSelect(dong);
                                                                    setClickedMain(null);
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


                    {/* 로그인 / 로그아웃 버튼 */}
                    <div className="right-buttons">
                        {isLoggedIn ? (
                            <div className="login-buttons">
                                <button className="Button2" onClick={() => navigate('/mypage')}>마이페이지</button>
                                <button className="Button2" onClick={() => logout()}>로그아웃</button>
                            </div>
                        ) : (
                            <Login />
                        )}
                    </div>
                </div>

                {/* 하단 챗봇 버튼 */}
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

            {/* 챗봇 렌더링 */}
            {(isChatVisible || isClosing) && (
                <div className={`chat-container ${isClosing ? 'hide' : 'show'}`}>
                    <ChatBot />
                </div>
            )}
        </div>
    );
};

export default Home;
