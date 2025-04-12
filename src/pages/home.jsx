import React, { useState, useRef } from "react";
import '../style/Style.css';
import MainPage from './MainPage';
// import CategoryMenu from './CategoryMenu';
import 업종분류 from '../data/업종분류.json'




const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState("업종");
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [hoveredMain, setHoveredMain] = useState(null);
    const [hoveredSub, setHoveredSub] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState("지역");
    const [showRegionMenu, setShowRegionMenu] = useState(false);
    const mainPageRef = useRef();

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
                                                                                    setSelectedCategory(`${detail}`);
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
                                                onClick={() => {
                                                    setSelectedRegion(option);
                                                    setShowRegionMenu(false);

                                                    // ✅ 기능 실행
                                                    if (option === "동 설정") {
                                                        mainPageRef.current?.dongEvent(); // 🔹 GeoJSON 폴리곤
                                                    // } else if (option === "범위 설정") {
                                                    //     mainPageRef.current?.btnEvent(); 
                                                    } else if (option === "다각형 설정") {
                                                        mainPageRef.current?.btnEvent(); // 🔹 폴리곤 API 트리거
                                                    }
                                                }}
                                            >
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="right-buttons">
                        <button className="Button2" onClick={() => alert("Pressed!")}>로그인</button>
                    </div>
                </div>


                <div className="bottom-row">
                    <button className="image-button">
                        <img
                            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7BrQmBK8fB/8qkztdd1_expires_30_days.png"
                            className="image6"
                            alt="logo"
                        />
                    </button>
                </div>
            </div>
        </div >
    );
};


export default Home